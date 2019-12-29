# Basic JSON DB

## Installing
```bash
npm i @johnny.reina/json-db
```

## Usage
```typescript
import { Database } from '@johnny.reina/json-db';

type Book = { _id?: string, title: string, author: string };

const collection = new Database('my-db').collection<Book>('my-collection');
```
This will create a file at `%HOMEDIR%/.my-db/my-collection.json` containing an empty array.

### `Collection<T>.insert(obj: T): Promise<string>`
Insert an item to the collection. Note that this will add an `_id` property.

### `Collection<T>.insertMany(obj: Array<T>): Promise<Array<string>>`
Insert an array of items to the collection. Note that this will add an `_id` property to each item.

### `Collection<T>.read(): Promise<Array<T>>`
Returns the entire contents of the collection.

### `Collection<T>.read(predicate: (item: T) => boolean): Promise<Array<T>>`
Returns the collection items for which the supplied predicate function returns `true`.

### `Collection<T>.find(id: string): Promise<T>`
Returns the collection item with the specified `_id`.

### `Collection<T>.find(predicate: (item: T) => boolean): Promise<T>`
Returns the collection item for which the supplied predicate function returns `true`.

### `Collection<T>.update(obj: T): Promise<void>`
Finds the collection item matching the provided object's `_id` property and replaces it with the supplied object.

### `Collection<T>.delete(id: string): Promise<void>`
Delete an object by id.

### `Collection<T>.delete(predicate: (item: T) => boolean): Promise<void>`
Deletes the collection **items** for which the supplied predicate function returns `true`.

## License
MIT
