const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const login = {
    payload: Joi.object().keys({
        email: Joi.string().required().trim().custom(value => `${value.toLowerCase()}`, 'toLowerCase').label('email'),
        password: Joi.string().required().trim().label('Password'),
    })
}

module.exports = {
    login
}