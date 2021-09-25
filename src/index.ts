export interface Tag {
  name: string;
  code: string;
  data?: { [key: string]: any };
  lvl: number;
  lock?: string;
}

export class Tags {
  tags: Tag[];

  /**
   * Create a new Tags Object.
   * @param tags An optional list of Tags to initialize the Tag object with.
   */
  constructor(...tags: Tag[]) {
    this.tags = tags;
  }

  /**
   * Add new tags to the tag system.
   * @param tag The tag to be added to the system
   */
  add(...tags: Tag[]) {
    tags.forEach((tag) => this._add(tag));
  }

  /**
   * Add a tag to the tags system.
   * @param tag The tag to be added to the system
   */
  private _add(tag: Tag) {
    const t = this.tags.find(
      (tg) => tg.name.toLowerCase() === tag.name.toLowerCase()
    );

    // If the tag exists, map through the tags and look for it.
    if (t) {
      this.tags = this.tags.map((tg) => {
        if (t.name.toLowerCase() === tg.name.toLowerCase()) {
          return {
            name: t.name.toLowerCase(),
            code: tag.code,
            lvl: tag.lvl || 0,
          };
        } else {
          return tg;
        }
      });
    } else {
      tag.lvl = tag.lvl ? tag.lvl : 0;
      this.tags.push(tag);
    }
  }

  /**
   * Get the highest level within a list of tags.
   * @param tags The tag list to check against
   */
  lvl(tags: string) {
    const list = tags.split(" ");
    let lvl = 0;
    return list.reduce((acc: Number, cur: string) => {
      const tag = this.exists(cur);
      return acc < tag?.lvl ? tag.lvl : acc;
    }, 0);
  }

  /**
   * Check to see if a tag exists, if it does - return the entire tag object,
   * @param t The tag to check for
   */
  exists(t: string) {
    return this.tags.filter(
      (tag) => tag.name.toLowerCase() === t.toLowerCase() || tag.code === t
    )[0];
  }

  /**
   * Get a list of codes for a given list of flags
   * @param flags The list of flags you want to get codes for.
   * @returns
   */
  codes(flags: string) {
    return flags
      .split(" ")
      .map((flag) => this.exists(flag) && this.exists(flag).code)
      .reduce((a, b) => (a += b), "");
  }

  /**
   *  Check a list of tags against a tag expression.
   * @param list The list of tags to check.
   * @param tagExpr The expression string to check tags against.
   */
  check(list: string, tagExpr: string) {
    const tags = tagExpr.split(" ");
    const listArray = list.split(" ");
    const results: boolean[] = [];
    if (tags.length > 0) {
      tags.forEach((tag) => {
        /**
         * Compare a tag expression against tagList.
         * @param tag The tag to check against tagList
         */
        const compare = (tag: string) => {
          if (tag.startsWith("!")) {
            tag = tag.slice(1);
            return !listArray.includes(tag);
          } else {
            return listArray.includes(tag);
          }
        };

        // Or flag statement
        if (/\|/.test(tag)) {
          const exprList = tag.split("|");
          const tempResults: boolean[] = [];
          exprList.forEach((expr) => tempResults.push(compare(expr)));
          return !!tempResults.includes(true);
        } else if (/.*\+$/.test(tag)) {
          return results.push(
            this.lvl(list) >= this.exists(tag.slice(0, -1)).lvl
          );
        } else {
          // Regular comparrison.
          results.push(compare(tag));
        }
      });
    } else {
      results.push(true);
    }
    return !results.includes(false);
  }

  /**
   * Set a flag string + data object for setting tags.
   * @param tags The existing list of tags to modify
   * @param data Any flag data that already exsits
   * @param expr The expression to evaluate for new tags.
   */
  set(tags: string, data: { [key: string]: any }, expr: string) {
    const list = expr.split(" ");
    const tagSet = new Set(tags.split(" "));

    list.forEach((item) => {
      const tag = this.exists(item);
      if (item.startsWith("!")) {
        tagSet.delete(item.slice(1));
        delete data[item.slice(1)];
      } else if (tag) {
        tagSet.add(tag.name);
        if (tag.data && !data.hasOwnProperty(tag.name))
          data[tag.name] = tag.data;
      }
    });
    return {
      tags: Array.from(tagSet).join(" ").trim(),
      data,
    };
  }
}
