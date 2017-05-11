const R = require('ramda')
const datastore = require('@google-cloud/datastore')

module.exports = (options) => {
  const store = datastore(options)

  const generateKey = (kind) => store.key({
    namespace: options.namespace,
    path: [kind]
  })

  /**
   * Add data to the store.
   *
   * @param {string} kind
   * @param {Object} data
   * @return {Promise}
   */
  const add = R.curry((kind, data) => store.save({
    key: generateKey(kind),
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
   */
  const runQuery = (query) => store.runQuery(query)

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
    const query = createQuery(kind)
      .filter('id', '=', id)

    return runQuery(query)
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
