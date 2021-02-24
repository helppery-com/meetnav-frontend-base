const NodeRestServer = require("node-rest-server");
const CICDControllers = require('./controllers');
 
const secret = process.env.GIT_WEBHOOKS_SECRET
const port = parseInt(process.env.GIT_WEBHOOKS_WEBHOOKS_PORT || 8082)
const urlPrefix = process.env.GIT_WEBHOOKS_WEBHOOKS_PREFIX || 'project'

function getAllMethodNames(obj) {
  return Object.getOwnPropertyNames(CICDControllers.prototype)
          .filter(m => m !== 'constructor')
}
const controllers = new CICDControllers();

function safe (cb) {
  try {
    return cb()
  } catch (ex) {
    console.error('ERROR processing request', ex)
  }
  return { ops: 500 }
}
const routeConfig = getAllMethodNames(controllers).reduce((acc, m) => {
  acc[`/${urlPrefix}/webhooks/${m}`] = {
    method: 'POST',
    status: 200,
    controller: function () {
      const args = [...arguments]
      return safe(() => controllers[m].apply(controllers, args))
    },
  }
  return acc
}, {});

routeConfig[`/${urlPrefix}/webhooks/test`] = {
    method: 'GET',
    status: 200,
    controller: () => {
      return {
        cwd: process.cwd()
      }
    }
}

const serverConfig = {
  port,
  logger: {
      enable: true,
      debug: false,
  },
  cors: {
    origin: '*'
  }
};
 
console.log('Running', routeConfig, serverConfig, secret)
NodeRestServer(routeConfig, serverConfig);