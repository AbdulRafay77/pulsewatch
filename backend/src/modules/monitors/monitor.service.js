const Monitor = require("./monitor.model");

async function createMonitor(data) {
  return Monitor.create(data);
}

async function getMonitors() {
  return Monitor.find().sort({ createdAt: -1 });
}

module.exports = {
  createMonitor,
  getMonitors
};