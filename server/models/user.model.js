'use strict'

const mongoose = require('mongoose')

const Bcrypt = require('bcrypt')

const Schema = mongoose.Schema

const { v4: Uuidv4 } = require('uuid');

const Types = Schema.Types

const modelName = 'user'

const errorHelper = require('@utilities/error-helper')

const { errors } = require('@utilities/constants');

const Boom = require('@hapi/boom')

const dbConn = require('@plugins/mongoose.plugin').plugin.mainDbConn()

const UserSocialsSchema = new Schema(
  {
    idx: {
      type: Types.String,
      default: null
    },
    type: {
      type: Types.String,
      default: null
    },
    createdAt: {
      type: Types.Date,
      default: null
    },
    updatedAt: {
      type: Types.Date,
      default: null
    }
  },
  {
    _id: true,
    timestamps: true,
  }
)

const UserSchema = new Schema(
  {
    firstName: {
      type: Types.String,
      default: null,
      canSearch: true
    },
    lastName: {
      type: Types.String,
      default: null,
      canSearch: true
    },
    email: {
      type: Types.String,
      required: true,
      unique: true,
      index: true,
      canSearch: true
    },
    password: {
      type: Types.String,
      default: null,
    },
    mobileNo: {
      type: Types.String,
      default: null,
    },
    impersonateToken: {
      type: Types.String,
      default: null,
    },
    sql_profilePic: {
      type: Types.String,
      default: null
    },
    profilePic: {
      type: Types.String,
      default: null
    },
    // Use for account varification
    verifyToken: {
      type: Types.String,
      default: null,
      index: true
    },
    // Use for update or reset a password
    resetToken: {
      type: Types.String,
      default: null,
      index: true
    },
    unsubscribeEmails: {
      type: Types.String,
      default: ""
    },
    unsubscribeSms: {
      type: Types.String,
      default: ""
    },
    disableECheckGuidelines: {
      type: Types.Boolean,
      default: false
    },
    tablePreference: {
      type: Types.Mixed,
      default: null
    },
    roleData: {
      permission: {
        type: Types.Array,
        default: []
      },
      name: {
        type: Types.String,
        default: null
      },
    },
    // Array of permission slugs where permission type = USER in permission table
    permissions: {
      type: Types.Array,
      default: []
    },
    socials: {
      type: [UserSocialsSchema],
      default: []
    },
    createdBy: {
      type: Types.ObjectId,
      ref: 'user',
      default: null
    },
    updatedBy: {
      type: Types.ObjectId,
      ref: 'user',
      default: null
    },
    createdAt: {
      type: Types.Date,
      default: null
    },
    termsConditionsUpdatedAt: {
      type: Types.Date,
      default: null
    },
    updatedAt: {
      type: Types.Date,
      default: null
    },
    deletedAt: {
      type: Types.Date,
      default: null
    },
    deletedBy: {
      type: Types.ObjectId,
      default: null,
      ref: 'user'
    },
    deleted: {
      type: Types.Boolean,
      default: false,
    },
    unsubscribeKey: {
      type: Types.String,
      default: ""
    }
  },
  {
    collection: modelName,
    versionKey: false,
    timestamps: true,
  }
)

UserSchema.pre('save', async function (next) {
  const user = this
  if (user.isNew) {
    // Set Password & hash before save it
    if (user.password) {
      const passHash = await user.generateHash(user.password)
      user.password = passHash.hash
    }
    const emailHash = await user.generateHash()
    user.emailHash = emailHash.hash
    user.wasNew = true
  }
  next()
})

UserSchema.methods = {
  generateHash: async function (key) {
    try {
      if (key === undefined) {
        key = Uuidv4()
      }
      const salt = await Bcrypt.genSalt(10)
      const hash = await Bcrypt.hash(key, salt)
      return {
        key,
        hash
      }
    } catch (err) {
      errorHelper.handleError(err)
    }
  }
}

UserSchema.statics = {
  findByCredentials: async function (username, password) {
    try {
      const self = this;

      const query = {
        email: username
      };

      const selectField = "firstName lastName email password resetToken permissions profilePic roleData  socials tablePreference termsConditionsUpdatedAt unsubscribeEmails unsubscribeKey unsubscribeSms updatedAt createdAt deleted"
      const mongooseQuery = self.findOne(query).select(selectField);

      const user = await mongooseQuery.lean();

      if (!user) {
        const errorObj = {};
        errorObj.email = errors.user.wrongEmail.message;
        await errorHelper.setCustomError(errorObj);
      }

      const source = user.password;

      if (!source) errorHelper.handleError(Boom.badRequest("Please setup your password !"))

      const passwordMatch = await Bcrypt.compare(password, source);
      if (passwordMatch) {
        return user;
      } else {
        const errorObj = {};
        errorObj.password = errors.user.wrongPassword.message;
        await errorHelper.setCustomError(errorObj);
      }
    } catch (err) {
      errorHelper.handleError(err);
    }
  },
  generateHash: async function (key) {
    try {
      if (key === undefined) {
        key = Uuidv4()
      }
      const salt = await Bcrypt.genSalt(10)
      const hash = await Bcrypt.hash(key, salt)
      return {
        key,
        hash
      }
    } catch (err) {
      errorHelper.handleError(err)
    }
  }
}

exports.schema = dbConn.model(modelName, UserSchema)
