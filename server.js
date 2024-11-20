'use strict'

require('module-alias/register')

if (process.env.NODE_ENV === 'default') {
  require('dotenv').config({ path: './.env' });
} else {
  require('dotenv').config()
}

const Glue = require('@hapi/glue')
const Glob = require('glob')
const serverConfig = require('./config/manifest')

const options = {
  ...serverConfig.options,
  relativeTo: __dirname
}

const startServer = async () => {
  try {
    const server = await Glue.compose(
      serverConfig.manifest,
      options
    )

    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('NODE_CONFIG_DIR:', process.env.NODE_CONFIG_DIR);
    console.log('DB Connection String:', process.env.DB);

    server.events.on('response', async function (request) {
    });

    const services = Glob.sync('server/services/*.js')
    services.forEach(service => {
      server.registerService(require(`${process.cwd()}/${service}`))
    })

    await server.start()
    console.log(`Server listening on ${server.info.uri}`)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

startServer()
