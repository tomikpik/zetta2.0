var device = require('zetta-device');
var util = require('util');

var HubLED = module.exports = function(uuid) {
	device.call(this);
	this._uuid = uuid;
	this.id = uuid;
	this._serialPort=undefined;
};
util.inherits(HubLED, device);

HubLED.prototype.init = function(config) {
	config	.name('LED: '+this._uuid)
			.type('1')
			.state('disconnected')
			.when('disconnected',{allow:['send-message']})
			.map('send-message',this.sendMessage,[{type:'text',name:'message'}]);
};

HubLED.prototype.processData = function(serialPort) {
	this._serialPort=serialPort;
};

HubLED.prototype.sendMessage = function(message,cb){
	if(message.length==48){
		this._serialPort.write("L"+message+"Z\r\n");
		cb();
	}
	
}
