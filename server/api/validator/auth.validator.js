const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const login = {
    payload: Joi.object().keys({
        email: Joi.string().required().trim().custom(value => `${value.toLowerCase()}`, 'toLowerCase').label('email'),
        password: Joi.string().required().trim().label('Password'),
    })
}

const register = {
    payload: Joi.object().keys({
        firstName: Joi.string().required().trim().label('firstName'),
        lastName: Joi.string().required().trim().label('lastName'),
        email: Joi.string().required().trim().custom(value => `${value.toLowerCase()}`, 'toLowerCase').label('email'),
        password: Joi.string().required().trim().label('Password'),
    })
}

module.exports = {
    login,
    register
}