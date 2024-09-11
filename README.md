# @digibear/tags

Tags is an ECS (Entity Component System) designed for use when creating UrsaMU. It provides a flexible and efficient way to manage and manipulate tags and their associated data.

## Installation

```
yarn add @digibear/tags
```

## Usage

```typescript
import { Tags, Tag } from '@digibear/tags';

// Create a new Tags instance
const tags = new Tags();

// Add tags
tags.add({
  name: 'admin',
  code: 'A',
  lvl: 5,
  data: { canEditUsers: true }
});

// Check tags
console.log(tags.check('user admin', 'admin')); // true

// Set tags
const result = tags.set('user', {}, 'admin');
console.log(result); // { tags: 'user admin', data: { admin: { canEditUsers: true } } }

// Get codes
console.log(tags.codes('user admin')); // 'A'
```

## API

### `Tags` Class

#### Constructor

- `constructor(...tags: Tag[])`: Create a new Tags object with optional initial tags.

#### Methods

- `add(...tags: Tag[])`: Add new tags to the tag system.
- `lvl(tags: string): number`: Get the highest level within a list of tags.
- `exists(t: string): Tag | undefined`: Check if a tag exists and return the entire tag object if it does.
- `codes(flags: string): string`: Get a list of codes for a given list of flags.
- `check(list: string, tagExpr: string): boolean`: Check a list of tags against a tag expression.
- `set(tags: string, data: Data, expr: string): { tags: string; data: Data }`: Modify a list of tags and associated data based on an expression.

### `Tag` Interface

```typescript
export interface Tag {
  name: string;
  code: string;
  data?: Record<string, any>;
  lvl?: number;
  lock?: string;
  add?: (data: Record<string, any>) => Record<string, any> | Promise<Record<string, any>>;
  remove?: (data: Record<string, any>) => Record<string, any> | Promise<Record<string, any>>;
}
```

## Features

- Case-insensitive tag handling
- Support for tag levels and hierarchies
- Flexible tag expressions with AND, OR, and NOT operations
- Associated data management for tags
- Custom add and remove functions for tags

## License

MIT

## Development

```
yarn install
```

## Testing

```
yarn run test
```

For more detailed information and advanced usage, please refer to the source code and comments.