# @digibear/tags

Tags is an ECS system designed for use when creating UrsaMU

## installation

`yarn install @digibear/tags`

## Methods

- **`add(tag: Tag)`** Add a new tag to the Tags system.
- **`remove(name: string)`** Remove a tag from the tag system
- **`set(tagList?: string, expression: String)`** Modify a list of flags with a flag expression.
- **`check(tags: string, tagExpr: string)`** Check `tags` against `tagExpr`.
- **`codes(list: string)`** Return a list of codes for the given flags if they exist.

```js
interface Tag {
  name: string;
  code: string;
  data?: { [key: string]: any };
  lvl: number;
  lock?: string;
}
```

## License

MIT

## Development

`yarn install`

## Testing

`yarn run test`
