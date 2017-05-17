const R = require('ramda')
const datastore = require('@google-cloud/datastore')

/**
 * Connect to a datastore.
 *
 * @param {Object} options
 * @return {Object}
 */
module.exports.connect = (options) => {
  const store = datastore(options)

  /**
   * Create datastore key.
   *
   * @param {string} kind
   * @param {string} id
   * @return {Object}
   */
  const key = (kind, id) => store.key({
    namespace: options.namespace,
    path: [kind, id]
  })

  /**
   * Add data to the store.
   *
   * @param {string} kind
   * @param {Object} data
   * @return {Promise}
   */
  const add = R.curry((kind, data) => store.save({
    key: key(kind, data.id),
    data
  }))

  /**
   * Update data in the store.
   *
   * @param {string} kind
   * @param {string} id
   * @return {Promise}
   */
  const update = R.curry((kind, data) => store.update({
    key: key(kind, data.id),
    data
  }))

  /**
   * Remove data from the store.
   *
   * @param {string} kind
   * @param {string} id
   * @return {Promise}
   */
  const remove = R.curry((kind, id) => {
    return store.delete(key(kind, id))
  })

  /**
   * Create datastore query.
   *
   * @param {string} kind
   */
  const createQuery = (kind) => store.createQuery(kind)

  /**
   * Run datastore query.
   *
   * @param {Object} query
   * @return {Promise}
   */
  const runQuery = (query) => {
    return store.runQuery(query)
      .then(result => result[0])
  }

  /**
   * Find all data of a given kind.
   *
   * @param {string} kind
   * @return {Promise}
   */
  const findAll = (kind) => {
    const query = createQuery(kind)
    return runQuery(query)
      .then(result => result[0])
  }

  /**
   * Find data by its id.
   *
   * @param {string} kind
   * @param {string} id
   * @return {Promise}
   */
  const find = R.curry((kind, id) => {
    return store.get(key(kind, id))
      .then(result => result[0])
  })

  return {
    add,
    update,
    remove,
    find,
    findAll,
    createQuery,
    runQuery,
  }
}
