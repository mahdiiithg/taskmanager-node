const Item = require('../models/tasks');
const crudEmitter = require('../events/crudEvents');

async function createItem(data) {
    const newItem = new Item(data);
    crudEmitter.emit('create', newItem.description);
}

async function updateItem(id, data) {
    const updatedItem = await Item.findById(id, data, { new: true });
    crudEmitter.emit('update', updatedItem);
}

async function deleteItem(id) {
    await Item.findById(id);
    crudEmitter.emit('delete', id);
}

module.exports = { createItem, updateItem, deleteItem /*, other exports */ };
