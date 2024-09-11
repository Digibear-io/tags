import { expect, test } from '@jest/globals';
import { Tags } from "../index";

const tags = new Tags(
  {
    name: "wizard",
    code: "W",
    lvl: 10,
  },
  {
    name: "admin",
    code: "a",
    lvl: 8,
  },
  {
    name: "staff",
    code: "s",
    lvl: 5,
  },
  {
    name: "character",
    code: "C",
    lvl: 0,
    data: {
      idle: 0,
      thingTwo: true,
    },
  },
  {
    name: "connect",
    code: "c",
    lvl: 0,
    data: {
      test: "Foobar",
    },
  }
);

test("Testing Tags.exists", () => {
  expect(tags.exists("wizard")).toBeTruthy();
});

test("Testing Tags.lvls", () => {
  expect(tags.lvl("wizard admin")).toEqual(10);
});

test("Testing Tags.check", () => {
  expect(tags.check("wizard connected player", "!admin")).toBeTruthy();
  expect(tags.check("wizard", "staff+")).toBeTruthy();
  expect(tags.check("wizard", "wizard|staff")).toBeTruthy();
  expect(tags.check("wizard", "wizard|foobar staff+ !connected")).toBeTruthy();
});

test("Testing Tags.add", () => {
  tags.add({
    name: "wizard",
    code: "w",
    lvl: 9,
  });

  expect(tags.exists("wizard")?.lvl).toEqual(9);
});

test("Testing Tags.set", () => {
  // Check to make sure data is being set.
  const { data, tags: flags } = tags.set("foo", {}, "character wizard");

  expect(flags).toBe("foo character wizard");
  expect(
    tags.set(
      "",
      { staff: { test: "Foobar" } },
      "wizard connected !staff connect"
    ).data.staff
  ).toBeUndefined();

  expect(
    tags.set("", { connected: { test: "baz" } }, "connected").data.connected
      .test
  ).toEqual("baz");

  expect(tags.set("", {}, "character wizard !staff").tags).toContain("wizard");
});

test("Tags comparing greater than are returning true.", () => {
  expect(tags.check("foo bar baz wizard", "wizard+")).toEqual(true);
});

test("Tags Codes are returned when using the codes method", () => {
  expect(tags.codes("character wizard")).toEqual("Cw");
});

test("Empty Tags returns true", () => {
  expect(tags.check("wizard connect", "")).toEqual(true);
});

// Add these new tests after your existing tests

test("Testing Tags.exists with non-existent tag", () => {
  expect(tags.exists("nonexistent")).toBeUndefined();
});

test("Testing Tags.lvl with single tag", () => {
  expect(tags.lvl("admin")).toEqual(8);
});

test("Testing Tags.lvl with non-existent tag", () => {
  expect(tags.lvl("nonexistent")).toEqual(0);
});

test("Testing Tags.check with OR condition", () => {
  expect(tags.check("admin", "wizard|admin")).toBeTruthy();
  expect(tags.check("staff", "wizard|admin")).toBeFalsy();
});

test("Testing Tags.check with NOT condition", () => {
  expect(tags.check("staff", "!admin")).toBeTruthy();
  expect(tags.check("admin", "!admin")).toBeFalsy();
});

test("Testing Tags.check with level comparison", () => {
  expect(tags.check("staff", "character+")).toBeTruthy();
  expect(tags.check("character", "admin+")).toBeFalsy();
});

test("Testing Tags.codes with multiple tags", () => {
  expect(tags.codes("admin staff character")).toEqual("asC");
});

test("Testing Tags.codes with non-existent tag", () => {
  expect(tags.codes("admin nonexistent staff")).toEqual("as");
});

test("Testing Tags.add with new tag", () => {
  tags.add({
    name: "newTag",
    code: "N",
    lvl: 3,
  });
  expect(tags.exists("newTag")).toBeTruthy();
  expect(tags.exists("newTag")?.lvl).toEqual(3);
});

test("Testing Tags.set with adding and removing tags", () => {
  const result = tags.set("admin staff", {}, "character !staff wizard");
  expect(result.tags).toContain("admin");
  expect(result.tags).toContain("character");
  expect(result.tags).toContain("wizard");
  expect(result.tags).not.toContain("staff");
});

test("Testing Tags.set with data manipulation", () => {
  const initialData = { admin: { access: true } };
  const result = tags.set("admin", initialData, "character");
  expect(result.data.admin).toEqual({ access: true });
  expect(result.data.character).toEqual({ idle: 0, thingTwo: true });
});

test("Testing Tags.check with complex expression", () => {
  expect(tags.check("admin staff", "admin staff !wizard character+")).toBeTruthy();
  expect(tags.check("admin wizard", "admin staff !wizard character+")).toBeFalsy();
});

test("Testing case insensitivity", () => {
  expect(tags.exists("ADMIN")).toBeTruthy();
  expect(tags.check("ADMIN staff", "admin STAFF")).toBeTruthy();
});

// Add this test if you implement a remove method
// test("Testing Tags.remove", () => {
//   tags.remove("admin");
//   expect(tags.exists("admin")).toBeUndefined();
// });
