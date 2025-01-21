module.exports = {
  appName: 'payment-service',
  port: 2222,  // Default port for local development
  mode: 'default',
  baseurl: 'http://localhost:4407',
  debug: {
    request: ['error', 'info'],
    log: ['info', 'error', 'warning']
  },
  endpoints: {
    ADMIN_API_URL: "http://localhost:2202",
  },
  constants: {
    API_BASEPATH: 'api.trogoninfotech.com',  // Adjust for live deployment if needed
    CHROMIUM_PATH: {},
    EXPIRATION_PERIOD: '730h',
    JWT_SECRET: process.env.JWT_SECRET || 'jwtsecret',
    dbRetentionMonth: 2,
    log: {
      secret: ['req', 'type', 'requestId', 'isError', 'url', 'responseTime', 'method', 'statusCode', 'tags', '*.password'],
      needToRemove: true,
      dbignore: ['ignore']
    },
  },
  connections: {
    db: process.env.DB,  // Ensure the DB environment variable is set in Koyeb or .env file
  },
  tmpDir: "./tmp",
};