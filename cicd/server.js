const NodeRestServer = require("node-rest-server");
const CICDControllers = require('./controllers');
 
const secret = process.env.GIT_WEBHOOKS_SECRET
const port = process.env.GIT_WEBHOOKS_WEBHOOKS_PORT || 8082
const urlPrefix = process.env.GIT_WEBHOOKS_WEBHOOKS_PREFIX || 'project'

function getAllMethodNames(obj) {
  return Object.getOwnPropertyNames(CICDControllers.prototype)
          .filter(m => m !== 'constructor')
}
const controllers = new CICDControllers();

const routeConfig = getAllMethodNames(controllers).reduce((acc, m) => {
  acc[`/${urlPrefix}/webhooks/${m}`] = {
    method: 'POST',
    status: 200,
    controller: function () { return controllers[m].apply(controllers, [...arguments]) },
  }
  return acc
}, {});

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