'use strict'

require('module-alias/register')

if (process.env.NODE_ENV === 'default') {
  require('dotenv').config({ path: './../.env' });
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

module.exports = async (req, res) => {
  try {
    const server = await Glue.compose(serverConfig.manifest, options);

    const services = Glob.sync('server/services/*.js');
    services.forEach(service => {
      server.registerService(require(`${process.cwd()}/${service}`));
    });

    await server.initialize();

    await server.inject({
      method: req.method,
      url: req.url,
      payload: req.body,
      headers: req.headers
    });

    res.status(200).send('Request handled by Hapi server');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
