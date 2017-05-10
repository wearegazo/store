const datastore = require('@google-cloud/datastore')

module.exports = (options) => {
  const store = datastore(options)

  const generateKey = (kind) => store.key({
    namespace: options.namespace,
    path: [kind]
  })

  /**
   * Save data into the store.
   *
   * @param {string} kind
   * @param {Object} data
   * @return {Promise}
   */
  const save = (kind, data) => store.save({
    key: generateKey(kind),
    data
  })

  /**
   * Find all data of a given kind.
   *
   * @param {string} kind
   * @return {Promise}
   */
  const findAll = (kind) => store.runQuery(store.createQuery(kind))

  return {save, findAll}
}
