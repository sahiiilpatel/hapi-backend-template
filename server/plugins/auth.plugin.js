'use strict'
const config = require('config')
const ObjectId = require('mongodb').ObjectId;

exports.plugin = {
  async register(server, options) {
    const jwtValidate = async (decodedToken, request, h) => {
      const User = require('@models/user.model').schema

      const credentials = {
        user: {}
      }
      let isValid = false

      const user = await User.findOne({
        _id: new ObjectId(decodedToken.user._id),
        firstName: decodedToken.user.firstName,
        lastName: decodedToken.user.lastName,
        email: decodedToken.user.email,
        resetToken: decodedToken.user.token,
      })

      credentials.user = user
      isValid = true

      return {
        isValid,
        credentials
      }
    }

    server.auth.strategy('auth', 'jwt', {
      key: config.constants.JWT_SECRET,
      validate: jwtValidate,
      verifyOptions: {
        algorithms: ['HS256']
      }
    })

    const getIP = function (request) {
      return (
        request.headers['x-real-ip'] ||
        request.headers['x-forwarded-for'] ||
        request.info.remoteAddress
      )
    }
    server.method('getIP', getIP, {})
  },

  roleScope() {
    return ['waitstaff', 'ADMIN'];
  },

  name: 'auth',
  version: require('../../package.json').version
}