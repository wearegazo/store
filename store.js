const datastore = require('@google-cloud/datastore')

module.exports = (options) => {
  const store = datastore(options)

  const generateKey = (kind) => store.key({
    namespace: options.namespace,
    path: [kind]
  })

  /**
   * Add data of a given kind to the store.
   *
   * @param {string} kind
   * @param {Object} data
   * @return {Promise}
   */
  const add = (kind, data) => store.save({
    key: generateKey(kind),
    data
  })

  /**
   * Find all data of a given kind.
   *
   * @param {string} kind
   * @return {Promise}
   */
  const all = (kind) => {
    const query = store.createQuery(kind)
    return store.runQuery(query)
      .then(data => data[0])
  }

  return {save, findAll}
}
