// core/Registry.js
class Registry {
  constructor() {
    this.handlers = new Map();
  }

  register(namespace, instance) {
    if (this.handlers.has(namespace)) {
      throw new Error(`Handler for namespace '${namespace}' already registered.`);
    }
    this.handlers.set(namespace, instance);
  }

  get(namespace) {
    return this.handlers.get(namespace);
  }
}

module.exports = new Registry();
