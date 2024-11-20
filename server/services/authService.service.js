'use strict';
const Boom = require('@hapi/boom');
const Schmervice = require('@hapipal/schmervice');
const errorHelper = require('@utilities/error-helper');

const User = require('@models/user.model').schema

module.exports = class authService extends Schmervice.Service {
    async createMailLog(request) {
        try {
            const { payload: { firstName, lastName, email, password } } = request

            await User.create({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
            })

            return { message: "user created successfully" }
        } catch (error) {
            errorHelper.handleError(error)
        }
    }
}