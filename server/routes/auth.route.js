'use strict'
// Never take constants here
module.exports = {
  plugin: {
    async register(server, options) {
      const API = require('@api/auth.api')
      server.route([
        {
          method: 'POST',
          path: '/login',
          config: {
            auth: null,
            plugins: {
              policies: ['log.policy'],
              'hapi-swaggered': {
                security: []
              }
            },
            tags: ['api', 'Authentication'],
            description: 'login',
            notes: 'login',
            validate: API.login.validate,
            pre: API.login.pre,
            handler: API.login.handler
          }
        },
        {
          method: 'POST',
          path: '/register',
          config: {
            auth: null,
            plugins: {
              policies: ['log.policy'],
              'hapi-swaggered': {
                security: []
              }
            },
            tags: ['api', 'Authentication'],
            description: 'login',
            notes: 'login',
            validate: API.register.validate,
            pre: API.register.pre,
            handler: API.register.handler
          }
        },
      ])
    },
    version: require('../../package.json').version,
    name: 'auth-routes'
  }
}
