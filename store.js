const datastore = require('@google-cloud/datastore')

module.exports = (projectId, namespace) => {
  const store = datastore({projectId})

  const generateKey = (kind) => store.key({
    namespace,
    path: [kind]
  })

  const save = (kind, data) => store.save({
    key: generateKey(kind),
    data
  })

  return {save}
}
