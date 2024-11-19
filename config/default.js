module.exports = {
  appName: 'payment-service',
  port: 2222,
  mode: 'default',
  baseurl: 'http://localhost:4407',
  debug: {
    request: ['error', 'info'],
    log: ['info', 'error', 'warning']
  },
  endpoints: {
    QUEUE_API_URL: "http://localhost:2203",
    TENANT_API_URL: "http://localhost:2204",
    ADMIN_API_URL: "http://localhost:2202",
    ADMIN_URL: "http://localhost:4404",
    TENANT_URL: "localhost:4405",
    LLS_TENANT_URL: 'http://localhost:4407',
    LLS_ADMIN_URL: 'http://localhost:4406',
  },
  constants: {
    API_BASEPATH: 'localhost:2222',
    S3_PREFIX: 'local/',
    LLS_S3_PREFIX: 'local/LLS/',
    S3_BASE_PATH: 'https://prisma-assets-dev.s3.amazonaws.com/',
    CHROMIUM_PATH: {},
    EXPIRATION_PERIOD: '730h',
    JWT_SECRET: process.env.JWT_SECRET || 'jwtsecret',
    EMAIL_LOGO: process.env.EMAIL_LOGO || `images/logo_white.png`,
    QUEUE_DRIVER: 'sync',
    PASSPORT_TOKEN: process.env.PASSPORT_SANDBOX_TOKEN,
    SFTP_CONFIG: {
      host: process.env.SBOX_PAY_NEAR_ME_SMTP_HOST,
      port: process.env.SBOX_PAY_NEAR_ME_SMTP_PORT, // Default SFTP port is 22
      username: process.env.SBOX_PAY_NEAR_ME_SMTP_USERNAME,
      password: process.env.SBOX_PAY_NEAR_ME_SMTP_PASSWORD
    },
    SBOX_PAY_NEAR_ME_SMTP_PATH: process.env?.SBOX_PAY_NEAR_ME_SMTP_PATH,
    LIVE_PAY_NEAR_ME_SMTP_PATH: process.env?.PAY_NEAR_ME_SMTP_PATH,
    dbRetentionMonth: 2,
    WEBHOOK_ENDPOINT: null,
    log: {
      secret: ['req', 'type', 'requestId', 'isError', 'url', 'responseTime', 'method', 'statusCode', 'tags', '*.password'],
      needToRemove: true, // true :  will remove above defined arrays variable from response
      dbignore: ['ignore']
    },
  },
  connections: {
    db: process.env.DB,
  },
  tmpDir:"./tmp",
  mailgun: {
    enabled: process.env.ENABLE_MAILGUN === 'true' ? true : false,
    key: process.env.MAILGUN_KEY,
    domain: process.env.MAILGUN_DOMAIN,
    fromAddress: "no-reply@goprisma.com",
    fromName: "Landlord Station Notification"
  }
}
