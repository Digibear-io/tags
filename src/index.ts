export type Data = Record<string, any>;
export interface Tag {
  name: string;
  code: string;
  data?: Data;
  lvl?: number;
  lock?: string;
  add?: (data: Data) => Data | Promise<Data>;
  remove?: (data: Data) => Data | Promise<Data>;
}

export class Tags {
  private tagMap: Map<string, Tag>;

  /**
   * Create a new Tags Object.
   * @param tags An optional list of Tags to initialize the Tag object with.
   */
  constructor(...tags: Tag[]) {
    this.tagMap = new Map(tags.map(tag => [tag.name.toLowerCase(), tag]));
  }

  /**
   * Add new tags to the tag system.
   * @param tag The tag to be added to the system
   */
  add(...tags: Tag[]) {
    tags.forEach(tag => {
      const lowerName = tag.name.toLowerCase();
      this.tagMap.set(lowerName, {
        ...this.tagMap.get(lowerName),
        ...tag,
        name: lowerName,
        lvl: tag.lvl || 0,
      });
    });
  }

  /**
   * Get the highest level within a list of tags.
   * @param tags The tag list to check against
   */
  lvl(tags: string): number {
    return tags.split(/\s+/).reduce((acc, cur) => {
      const tag = this.exists(cur);
      return Math.max(acc, tag?.lvl || 0);
    }, 0);
  }

  /**
   * Check to see if a tag exists, if it does - return the entire tag object,
   * @param t The tag to check for
   */
  exists(t: string): Tag | undefined {
    return this.tagMap.get(t.toLowerCase()) || this.tagMap.get(t);
  }

  /**
   * Get a list of codes for a given list of flags
   * @param flags The list of flags you want to get codes for.
   * @returns
   */
  codes(flags: string): string {
    return flags.split(/\s+/)
      .map(flag => this.exists(flag)?.code || '')
      .join('');
  }

  /**
   *  Check a list of tags against a tag expression.
   * @param list The list of tags to check.
   * @param tagExpr The expression string to check tags against.
   */
  check(list: string, tagExpr: string): boolean {
    const tags = tagExpr.toLowerCase().split(/\s+/).filter(Boolean);
    const listSet = new Set(list.toLowerCase().split(/\s+/).filter(Boolean));

    if (tags.length === 0) return true;

    return tags.every(tag => {
      if (tag.includes('|')) {
        return tag.split('|').some(t => this.compareTag(t, listSet));
      } else if (tag.endsWith('+')) {
        const baseTag = tag.slice(0, -1);
        return (this.lvl(list) || 0) >= (this.exists(baseTag)?.lvl || 0);
      } else {
        return this.compareTag(tag, listSet);
      }
    });
  }

  /**
   * Set a flag string + data object for setting tags.
   * @param tags The existing list of tags to modify
   * @param data Any flag data that already exsits
   * @param expr The expression to evaluate for new tags.
   */
  set(tags: string, data: Data, expr: string): { tags: string; data: Data } {
    const tagSet = new Set(tags.split(/\s+/));
    const exprList = expr.split(/\s+/);

    exprList.forEach(item => {
      const tag = this.exists(item);
      if (item.startsWith('!')) {
        const tagName = item.slice(1);
        tagSet.delete(tagName);
        delete data[tagName];
        tag?.remove?.(data);
      } else if (tag) {
        tagSet.add(tag.name);
        if (tag.data && !(tag.name in data)) {
          data[tag.name] = tag.data;
        }
        tag.add?.(data);
      }
    });

    return {
      tags: Array.from(tagSet).join(' '),
      data,
    };
  }

  private compareTag(tag: string, listSet: Set<string>): boolean {
    if (tag.startsWith('!')) {
      return !listSet.has(tag.slice(1).toLowerCase());
    }
    return listSet.has(tag.toLowerCase());
  }
}
