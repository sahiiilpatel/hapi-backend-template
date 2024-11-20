'use strict'

const Joi = require('joi')
const config = require('config')
const Boom = require('@hapi/boom')
Joi.objectId = require('joi-objectid')(Joi)
const Token = require('@utilities/create-token')
const errorHelper = require('@utilities/error-helper')
const authValidator = require('@validator/auth.validator')

const User = require('@models/user.model').schema;

module.exports = {
  login: {
    validate: authValidator.login,
    pre: [
      {
        assign: 'loginUser',
        method: async (request, h) => {
          try {
            const email = request.payload.email
            const password = request.payload.password

            const user = await User.findByCredentials(email, password)
            if (user) {
              return user
            } else {
              errorHelper.handleError(
                Boom.badRequest('Wrong email or password'),
              );
            }
          } catch (err) {
            errorHelper.handleError(err);
          }
        }
      },
      {
        assign: 'accessToken',
        method: (request, h) => {
          try {
            if (request && request.payload) {
              return Token(request.pre.loginUser, '365d')
            } else {
              return Token(request.pre.loginUser, config.constants.EXPIRATION_PERIOD)
            }
          } catch (err) {
            errorHelper.handleError(err);
          }
        }
      }
    ],
    handler: async (request, h) => {
      let response = {}
      const accessToken = request.pre.accessToken
      const user = request.pre.loginUser
      delete user.password
      response = {
        user: user,
        accessToken
      }
      return h.response(response).code(200)
    }
  },
  register: {
    validate: authValidator.register,
    pre: [],
    handler: async (request, h) => {
      try {
        const { authService } = request.server.services();
        return await authService.register(request)
      } catch (err) {
        errorHelper.handleError(err)
      }
    }
  },
}
