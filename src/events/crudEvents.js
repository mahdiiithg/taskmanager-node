const EventEmitter = require('events');

class CrudEmitter extends EventEmitter {}

const crudEmitter = new CrudEmitter();
module.exports = crudEmitter;
