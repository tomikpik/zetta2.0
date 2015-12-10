var device = require('zetta-device');
var util = require('util');

var JablotronControllerDriver = module.exports = function(uuid) {
	device.call(this);
	this._uuid = uuid;
	this.id = uuid;
	this.value = undefined;
	//1: 08444732 2: 09493308
};
util.inherits(JablotronControllerDriver, device);

JablotronControllerDriver.prototype.init = function(config) {
	config	.name('Jablotron Remote Controller: '+this._uuid)
			.type('RC-86K')
			.monitor('value')
};

JablotronControllerDriver.prototype.processData = function(device, data) {
	//this.value = data.data[0].measured[0].value;
	//this.rssi = data.data[0].measured[1].value;
	var attr = data.split(" ");
	if(attr[2] === "ARM:1")
		this.value = 1;
	else if(attr[2] === "ARM:0")
		this.value = 0;
};