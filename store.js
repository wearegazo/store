const _ = require('ramda')
const datastore = require('@google-cloud/datastore')

/**
 * Connect to a datastore.
 *
 * @param {Object} options
 * @return {Object}
 */
module.exports.connect = (options = {}) => {
  const store = datastore(options)

  /**
   * Create datastore key.
   *
   * @param {string} kind
   * @param {string} id
   * @return {Object}
   */
  const key = _.curry((kind, id) => store.key({
    namespace: options.namespace,
    path: [kind, id]
  }))

  /**
   * Add data to the store.
   *
   * @param {string} kind
   * @param {Object} data
   * @return {Promise}
   */
  const add = _.curry((kind, data) => store.insert({
    key: key(kind, data.id),
    data
  }))

  /**
   * Update data in the store.
   *
   * @param {string} kind
   * @param {string} id
   * @param {Object} data
   * @return {Promise}
   */
  const update = _.curry((kind, id, data) => store.update({
    key: key(kind, id),
    data
  }))

  /**
   * Add data to the store, or update if it already exists.
   *
   * @param {string} kind
   * @param {Object} data
   * @return {Promise}
   */
  const addOrUpdate = _.curry((kind, data) => store.upsert({
    key: key(kind, data.id),
    data
  }))

  /**
   * Add range of data to the store, or update if it already exists.
   *
   * @param {string} kind
   * @param {Object} datas
   * @return {Promise}
   */
  const addOrUpdateRange = _.curry((kind, datas) => {
    const makeData = (data) => ({
      key: key(kind, data.id),
      data
    })
    const data = _.map(makeData, datas)

    return store.upsert(data)
  })

  /**
   * Remove data from the store.
   *
   * @param {string} kind
   * @param {string} id
   * @return {Promise}
   */
  const remove = _.curry((kind, id) => {
    return store.delete(key(kind, id))
  })

  /**
   * Remove range of data from the store.
   *
   * @param {string} kind
   * @param {string} ids
   * @return {Promise}
   */
  const removeRange = _.curry((kind, ids) => {
    const makeKey = key(kind)
    const keys = _.map(makeKey, ids)

    return store.delete(keys)
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
  const findAll = _.pipe(createQuery, runQuery)

  /**
   * Find data by its id.
   *
   * @param {string} kind
   * @param {string} id
   * @return {Promise}
   */
  const find = _.curry((kind, id) => {
    return store.get(key(kind, id))
      .then(result => result[0])
  })

  return {
    add,
    update,
    addOrUpdate,
    addOrUpdateRange,
    remove,
    removeRange,
    find,
    findAll,
    createQuery,
    runQuery
  }
}
