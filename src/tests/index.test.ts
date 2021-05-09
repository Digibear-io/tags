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

test("Testing Tags.exists", () => expect(tags.exists("wizard")).toBeTruthy());
test("Testing Tags.lvls", () => expect(tags.lvl("wizard admin")).toEqual(10));

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

  expect(tags.exists("wizard").lvl).toEqual(9);
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
