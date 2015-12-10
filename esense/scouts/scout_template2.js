var Scout = require('zetta-scout');
var util = require('util');

var mockLed = require('../drivers/mock-led');

var templateScout = module.exports = function() {
  Scout.call(this);
  this.name="template2";

};
util.inherits(templateScout, Scout);

templateScout.prototype.init = function(next) {

  this.discover(mockLed,"2");



  /*var device = this.server._jsDevices['uuid'];
  if(device !== undefined) {
    device.processData(device,null,peripheral);
  }*/
	next();
};
