import fs from "fs";
import R from "ramda";
import uuid from "uuid/v4";
import { CollectionItem } from "./CollectionItem";

/**
 * @template T
 */
class Collection<T extends CollectionItem> {
  _collectionPath: string;

  constructor(path: string) {
    this._collectionPath = path;
    this._ensureStorage();
  }

  /**
   * Inserts an object into the database without checking for existence.
   */
  public async insert(obj: T): Promise<string> {
    const db = await this._get();

    const initObject = obj._id ? obj : this._initObject(obj);

    db.push(initObject);
    await this._save(db);
    return initObject._id as string;
  }

  /**
   * Inserts an array of objects into the database without checking for existence.
   */
  public async insertMany(obj: Array<T>): Promise<Array<string>> {
    const db = await this._get();

    const initObjects = obj.map(item =>
      item._id ? item : this._initObject(item)
    );
    const ids = obj.map(item => item._id as string);

    db.push(...initObjects);
    await this._save(db);
    return ids;
  }

  /**
   * Returns every entry in the collection.
   */
  public async read(): Promise<Array<T>>;
  public async read(predicate: (item: T) => boolean): Promise<Array<T>>;
  public async read(predicate?: (item: T) => boolean): Promise<Array<T>> {
    if (typeof predicate === "undefined") return this._get();
    return (await this._get()).filter(predicate);
  }

  /**
   * Finds an item by _id or using the specified predicate.
   */
  public async find(id: string): Promise<T>;
  public async find(predicate: (item: T) => boolean): Promise<T>;
  public async find(id: string | ((item: T) => boolean)) {
    const predicate =
      typeof id === "function" ? id : (item: T) => item._id === id;
    return (await this._get()).find(predicate);
  }

  /**
   * Update an item. Will not update if the item does not have an `_id` property
   */
  public async update(obj: T): Promise<void> {
    const db = await this._get();

    if (!obj._id) return;
    const newDb = db.map(val => (val._id === obj._id ? obj : val));
    return this._save(newDb);
  }

  /**
   * Delete items by `_id` or using a specified predicate.
   * Items for which the predicate returns true will be deleted.
   */
  public async delete(id: string): Promise<void>;
  public async delete(predicate: (item: T) => boolean): Promise<void>;
  public async delete(id: string | ((item: T) => boolean)) {
    const predicate =
      typeof id === "function"
        ? R.pipe(id, R.not)
        : (item: T) => item._id !== id;

    const db = await this._get();

    const deleted = db.filter(predicate);

    return this._save(deleted);
  }

  private _initObject(obj: T): T {
    return R.assoc("_id", uuid(), obj);
  }

  private _ensureStorage() {
    if (!fs.existsSync(this._collectionPath)) this._save([]);
  }

  private _get(): Promise<Array<T>> {
    return new Promise((res, rej) => {
      fs.readFile(this._collectionPath, { encoding: "utf8" }, (err, data) => {
        if (err) return rej(err);
        return res(JSON.parse(data));
      });
    });
  }

  private _save(data: Array<T>): Promise<void> {
    return new Promise((res, rej) => {
      fs.writeFile(this._collectionPath, JSON.stringify(data), (err: any) => {
        if (err) return rej(err);
        return res();
      });
    });
  }
}

export default Collection;
