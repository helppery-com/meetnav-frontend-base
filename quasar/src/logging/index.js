import { v4 as uuidv4 } from 'uuid'
import api from '../store/api'

class Logging {
  app = { logging: {} }
  router = { logging: {} }
  Vue = { logging: {} }
  store = { logging: {} }
  uuid = uuidv4()
  console = {}

  init (app, router, Vue) {
    this.app = app
    this.router = router
    this.Vue = Vue
    this.initMethods()
    this.attachToConsole()
    this.injectLogging()
  }

  filterOut (msg) {
    try {
      if ((msg || '').indexOf('vue-i18n') !== -1) {
        return true
      }
    } catch {}
    return false
  }

  initMethods () {
    ['info', 'log', 'debug', 'trace', 'warn', 'error'].forEach(k => {
      this[k] = function (msg) {
        const args = [...arguments]
        if (!this.filterOut(msg)) {
          const stack = this.getSource()
          api.log({
            type: k,
            args,
            stack
          })
        }
        if (!this.console[k]) {
          k = 'log'
        }
        this.console[k].apply(this, args)
      }
    })
  }

  getSource () {
    try {
      const stack = new Error().stack
      return stack.split('\n').filter(l => {
        return !l.startsWith('Error') &&
          l.indexOf('/src/logging/') === -1
      }).join('\n')
    } catch (ex) {
      return `Error getting message stack ${ex.message}`
    }
  }

  attachToConsole () {
    ['log', 'warn', 'error'].forEach(k => {
      this.console[k] = console[k]
      console[k] = this[k].bind(this)
    })
  }

  injectLogging () {
    this.app.logging = this
    this.router.logging = this
    this.Vue.logging = this
    const state = this
    window.addEventListener('error', ev => {
      state.error(ev)
      return false
    })
    window.onerror = function (msg, url, lineNo, columnNo, error) {
      state.error(msg, url, lineNo, columnNo, error)
      return false
    }
  }
}

export const logging = new Logging()

export function initLogging (app, router, Vue, store) {
  logging.init(app, router, Vue, store)
}

export function log (target, name, descriptor) {
  const original = descriptor.value
  if (typeof original === 'function') {
    descriptor.value = function (...args) {
      logging.log(`Arguments: ${args}`)
      try {
        const result = original.apply(this, args)
        logging.log(`Result: ${result}`)
        return result
      } catch (e) {
        logging.error(`Error: ${e}`)
        throw e
      }
    }
  }
  return descriptor
}

export function Log (target, property, descriptor) {
  const actualFunction = descriptor.value
  const _class = target.constructor.name
  var decoratorFunc = function () {
    try {
      const res = actualFunction.apply(this, arguments)
      logging.info('Invocation', _class, property, [...arguments])
      return res
    } catch (ex) {
      logging.error('Invocation error', ex, _class, property, [...arguments])
    }
  }
  // Here, we are overwriting the getFullName with the decoratorFunc which has log
  // functionality and also actualFunction i.e. getFullName function
  descriptor.value = decoratorFunc
  // This descriptor will overwrite the getFullName descriptor's value property
  return descriptor
}
