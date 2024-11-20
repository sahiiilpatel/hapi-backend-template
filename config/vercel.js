module.exports = {
  appName: 'payment-service',
  port: 2222,
  mode: 'development',
  baseurl: 'http://localhost:4407',
  debug: {
    request: ['error', 'info'],
    log: ['info', 'error', 'warning']
  },
  endpoints: {
    QUEUE_API_URL: "https://q-api.goprisma-lab.com",
    TENANT_API_URL: "https://tenant-api.goprisma-lab.com",
    ADMIN_API_URL: "https://api.goprisma-lab.com",
    ADMIN_URL: "https://app.goprisma-lab.com",
    TENANT_URL: "goprisma-lab.com",
    LLS_TENANT_URL: 'https://resident.goprisma-lab.com',
    LLS_ADMIN_URL: 'https://smb.goprisma-lab.com',
  },
  constants: {
    API_BASEPATH: 'alleged-loria-sahilpatel-e961e0fd.koyeb.app',
    S3_PREFIX: '',
    LLS_S3_PREFIX: 'LLS/',
    S3_BASE_PATH: 'https://prisma-assets-dev.s3.amazonaws.com/',
    CHROMIUM_PATH: {
      executablePath: '/usr/bin/chromium-browser',
    },
    WEBHOOK_ENDPOINT: null,
    log: {
      secret: ['req', 'type', 'requestId', 'isError', 'url', 'responseTime', 'method', 'statusCode', 'tags', '*.password'],
      needToRemove: true, // true :  will remove above defined arrays variable from response
      dbignore: ['ignore']
    },
  }
}
