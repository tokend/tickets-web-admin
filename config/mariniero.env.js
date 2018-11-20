const merge = require('webpack-merge')
const env = require('./default.env')

module.exports = merge(env, {
  NODE_ENV: '"dev"',
  STORAGE_SERVER: '"https://storage.stage.mariniero.tokend.io/api"',
  KEY_SERVER_ADMIN: '"https://admin.stage.mariniero.tokend.io/_/adks"',
  HORIZON_SERVER: '"https://api.stage.mariniero.tokend.io"',
  NETWORK_PASSPHRASE: '"Mariniero Stage Network!"'
})
