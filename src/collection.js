const fs = require('fs');
const R = require('ramda');
const uuid = require('uuid/v4');

/**
 * @template T
 */
class Collection {
  /**
   *
   * @param {string} name
   */
  constructor(path) {
    this._collectionPath = path;
    this._ensureStorage();
  }

  /**
   * Inserts an object into the database without checking for existence
   * @param {T} obj
   */
  async insert(obj) {
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

  async find(id) {
      return (await this._get()).find(item => item._id === id);
  }

  /**
   * 
   * @param {string} id 
   * @param {T} obj 
   */
  async update(id, obj) {
    const db = await this._get();

    const newDb = db.map(val => (val._id === id ? obj : val));
    return this._save(newDb);
  }

  /**
   * 
   * @param {string} id 
   */
  async delete(id) {
    // read the db
    const db = await this._get();

    const dbWithoutMatchingObject = db.filter(weather => weather._id !== id);

    return this._save(dbWithoutMatchingObject);
  }

  /**
   * 
   * @param {T} obj 
   */
  _initObject(obj) {
    return R.assoc('_id', uuid(), obj);
  }

  _ensureStorage() {
    if(!fs.existsSync(this._collectionPath)) this._save([]);
  }

  /**
   * @returns {Promise<Array<any>>}
   */
  _get() {
    return new Promise((res, rej) => {
      fs.readFile(this._collectionPath, (err, data) => {
        if (err) return rej(err);
        return res(JSON.parse(data));
      });
    });
  }
  /**
   *
   * @param {Array<T>} data
   * @returns {Promise<string>}
   */
  _save(data) {
    return new Promise((res, rej) => {
      fs.writeFile(this._collectionPath, JSON.stringify(data), err => {
        if (err) return rej(err);
        return res('yay');
      });
    });
  }
}

module.exports = Collection;
