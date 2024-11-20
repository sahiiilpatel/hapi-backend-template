'use strict';

const PRODUCTION = 'production';

const getArgument = (argument) => {
  return process.argv.indexOf(argument);
};

// Set NODE_ENV and NODE_CONFIG_DIR based on the '--live' flag
if (getArgument('--live') !== -1) {
  process.env.NODE_ENV = 'live';
  process.env.NODE_CONFIG_DIR = `${__dirname}`; // Set config directory for live environment
}

const config = require('config');
const mongoose = require('mongoose');
const Config = JSON.parse(JSON.stringify(config));

const swaggerOptions = {
  info: {
    title: 'pg-management-api-v1',
    version: require('../package.json').version,
    description: 'pg-management-api-v1',
  },
  documentationPath: '/docs',
  basePath: '/api',
  tags: [],
  grouping: 'tags',
  securityDefinitions: {
    jwt: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
    },
  },
  security: [
    {
      jwt: [],
    },
  ],
};

const DEFAULT = 'default';

let plugins = [];
const ENV = config.util.getEnv('NODE_ENV').trim();

if (ENV !== DEFAULT) {
  swaggerOptions.schemes = ['https', 'http'];
  swaggerOptions.host = Config.constants.API_BASEPATH;
  mongoose.set('debug', true);
}

if (ENV !== PRODUCTION) {
  plugins = [
    {
      plugin: '@hapi/vision',
    },
    {
      plugin: 'hapi-swagger',
      options: swaggerOptions,
    },
    {
      plugin: 'hapi-dev-errors',
      options: {
        showErrors: process.env.NODE_ENV !== 'production',
        toTerminal: true,
      },
    },
  ];
}

plugins = plugins.concat([
  {
    plugin: '@hapi/inert',
  },
  {
    plugin: 'hapi-auth-jwt2',
  },
  {
    plugin: '@hapi/basic',
  },
  {
    plugin: '@hapipal/schmervice',
  },
  {
    plugin: 'mrhorse',
    options: {
      policyDirectory: `${__dirname}/../server/policies`,
      defaultApplyPoint:
        'onPreHandler', // optional. Defaults to onPreHandler
    },
  },
  {
    plugin: '@plugins/mongoose.plugin',
    options: {
      connections: Config.connections,
    },
  },
  {
    plugin: '@plugins/auth.plugin',
  },
  {
    plugin: '@routes/root.route',
  }
]);

const isDefault = ENV === DEFAULT;
plugins = plugins.concat([
]);

const routesOb = {
  'auth.route': 'auth',
};
const routes = Object.keys(routesOb);

routes.forEach((r) => {
  plugins = plugins.concat([
    {
      plugin: `@routes/${r}`,
      routes: {
        prefix: `/api/v1${routesOb[r] ? `/${routesOb[r]}` : ``}`,
      },
    },
  ]);
});

exports.manifest = {
  server: {
    router: {
      stripTrailingSlash: true,
      isCaseSensitive: false,
    },
    routes: {
      security: {
        hsts: false,
        xss: 'enabled',
        noOpen: true,
        noSniff: true,
        xframe: false,
      },
      cors: {
        origin: ['*'],
        headers: ['Accept', 'Authorization', 'Content-Type'],
      },
      validate: {
        failAction: async (request, h, err) => {
          request.server.log(
            ['validation', 'error'],
            'Joi throw validation error',
          );
          throw err;
        },
      },
      auth: false,
    },
    debug: Config.debug,
    port: process.env.PORT || 8000,
  },
  register: {
    plugins,
  },
};

exports.options = {};