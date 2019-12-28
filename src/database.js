const fs = require('fs');
const path = require('path');
const os = require('os')
const Collection = require('./collection');

class Database {
  /**
   *
   * @param {string} name
   */
  constructor(name) {
    this._dbPath = path.join(os.userInfo().homedir, `/.${name}/`);
    this._ensureStorage();
  }

  /**
   * 
   * @param {string} name 
   */
  collection(name) {
    const collectionPath = path.join(this._dbPath, `${name}.json`);
    return new Collection(collectionPath);
  }

  _ensureStorage() {
    if(!fs.existsSync(this._dbPath)) fs.mkdirSync(this._dbPath);
  }
}

module.exports = Database;
