const R = require('ramda')
const datastore = require('@google-cloud/datastore')

module.exports = (options) => {
  const store = datastore(options)

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
  const findById = (kind, id) => {
    return store.get(key(kind, id))
      .then(result => result[0])
  }

  return {
    add,
    createQuery,
    runQuery,
    findAll,
    findById,
  }
}
