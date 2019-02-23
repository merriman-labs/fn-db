const fs = require('fs');
const path = require('path');
const R = require('ramda');
const uuid = require('uuid/v4');

class DB {
  /**
   *
   * @param {string} name
   */
  constructor(name) {
    this._dbPath = path.join(__dirname, '../data/', name + '.json');
    this._ensureStorage();
  }

  /**
   * Inserts an object into the database without checking for existence
   * @param {*} obj
   */
  async insert(obj) {
    const db = await this._get();

    const initObject = obj._id ? obj : this._initObject(obj);

    db.push(initObject);
    return this._save(db);
  }

  async read() {
    return this._get();
  }

  async update(id, obj) {
    const db = await this._get();

    const newDb = db.map(val => (val._id === id ? obj : val));
    return this._save(newDb);
  }

  async delete(id) {
    // read the db
    const db = await this._get();

    const dbWithoutMatchingObject = db.filter(weather => weather._id !== id);

    return this._save(dbWithoutMatchingObject);
  }

  _initObject(obj) {
    return R.pipe(
      R.assoc('_id', uuid()),
      R.assoc('created', new Date().toString())
    )(obj);
  }

  _ensureStorage() {
    return new Promise((res, rej) => {
      fs.exists(this._dbPath, exists => {
        if (!exists) {
          return res(this._save([]));
        }
      });
      return res('yay anyway');
    });
  }

  /**
   * @returns {Promise<Array<any>>}
   */
  _get() {
    return new Promise((res, rej) => {
      fs.readFile(this._dbPath, (err, data) => {
        if (err) return rej(err);
        return res(JSON.parse(data));
      });
    });
  }
  /**
   *
   * @param {Array<*>} data
   * @returns {Promise<string>}
   */
  _save(data) {
    return new Promise((res, rej) => {
      fs.writeFile(this._dbPath, JSON.stringify(data), err => {
        if (err) return rej(err);
        return res('yay');
      });
    });
  }
}

module.exports = DB;
