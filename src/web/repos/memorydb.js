function MemoryRepository () {

  let store = {};

  function save (object) {
    store[object.uid] = object;
    return store[object.uid];
  }

  function getCount () {
    return Object.keys(store).length;
  }

  function get (uid) {
    const object = store[uid];
    if (object) {
      return object;
    } else {
      throw new Error('Entity not found');
    }
  }

  function getRandomObject (n = 1) {
    const results = [];
    for (let i = 0; i < n; i++) {
      const keys = Object.keys(store);
      const rand = Math.round(Math.random() * keys.length - 1);
      results.push(store[keys[rand]]);
    }
    return results;
  }

  function getAll (limit = null) {
    const keys = Object.keys(store);
    return keys.map(k => store[k])
      .slice(0, limit || keys.length);
  }

  function removeAll () {
    store = {};
  }

  function remove (uid) {
    store[uid] = undefined;
  }

  function exists (uid) {
    return store[uid] !== undefined;
  }

  return {
    save,
    get,
    remove,
    removeAll,
    getAll,
    exists,
    getCount,
    getRandomObject
  }

}

module.exports = MemoryRepository;
