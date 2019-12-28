import fs from "fs";
import R from "ramda";
import uuid from "uuid/v4";
import { CollectionItem } from "./CollectionItem";

/**
 * @template T
 */
class Collection<T extends CollectionItem> {
  _collectionPath: string;
  /**
   *
   * @param {string} name
   */
  constructor(path: string) {
    this._collectionPath = path;
    this._ensureStorage();
  }

  /**
   * Inserts an object into the database without checking for existence
   * @param {T} obj
   */
  async insert(obj: T) {
    const db = await this._get();

    const initObject = obj._id ? obj : this._initObject(obj);

    db.push(initObject);
    await this._save(db);
    return initObject._id;
  }

  /**
   * @returns {Promise<Array<T>>}
   */
  async read() {
    return this._get();
  }

  async find(id: any) {
    return (await this._get()).find((item: { _id: any }) => item._id === id);
  }

  /**
   *
   * @param {string} id
   * @param {T} obj
   */
  async update(id: any, obj: any) {
    const db = await this._get();

    const newDb = db.map((val: { _id: any }) => (val._id === id ? obj : val));
    return this._save(newDb);
  }

  /**
   *
   * @param {string} id
   */
  async delete(id: any) {
    // read the db
    const db = await this._get();

    const dbWithoutMatchingObject = db.filter(
      (weather: { _id: any }) => weather._id !== id
    );

    return this._save(dbWithoutMatchingObject);
  }

  /**
   *
   * @param {T} obj
   */
  _initObject(obj: any) {
    return R.assoc("_id", uuid(), obj);
  }

  _ensureStorage() {
    if (!fs.existsSync(this._collectionPath)) this._save([]);
  }

  /**
   */
  _get(): Promise<Array<T>> {
    return new Promise((res, rej) => {
      fs.readFile(this._collectionPath, { encoding: "utf8" }, (err, data) => {
        if (err) return rej(err);
        return res(JSON.parse(data));
      });
    });
  }
  /**
   *
   */
  _save(data: Array<T>): Promise<void> {
    return new Promise((res, rej) => {
      fs.writeFile(this._collectionPath, JSON.stringify(data), (err: any) => {
        if (err) return rej(err);
        return res();
      });
    });
  }
}

export default Collection;
