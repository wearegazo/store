const R = require('ramda')
const datastore = require('@google-cloud/datastore')

module.exports = (projectId, namespace) => {
  const store = datastore({projectId})

  const generateKey = (kind) => store.key({
    namespace,
    path: [kind]
  })

  return {
    /**
     * Save data into the store.
     *
     * @param {string} kind
     * @param {Object} data
     * @return {Promise}
     */
    save: (kind, data) => store.save({
      key: generateKey(kind),
      data
    }),

    /**
     * Find all data of a given kind.
     *
     * @param {string} kind
     * @return {Promise}
     */
    findAll: R.pipe(store.createQuery, store.runQuery)
  }
}
