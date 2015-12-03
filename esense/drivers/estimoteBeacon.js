var device = require('zetta-device');
var util = require('util');

var EstimoteBeacon = module.exports = function(uuid) {
	device.call(this);
	this._uuid = uuid;
	this.id = uuid;
	this.device = undefined;
	//this.rssi = NaN;
};
util.inherits(EstimoteBeacon, device);

EstimoteBeacon.prototype.init = function(config) {
	config	.name('EstimoteBeacon: '+this._uuid)
			.type('130')
			.monitor('device')
			//.monitor('rssi');
};

EstimoteBeacon.prototype.processData = function(device, data) {
	this.device = data.data[0].measured[0].value;
	//this.rssi = data.data[0].measured[1].value;
};
