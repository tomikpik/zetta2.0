var device = require('zetta-device');
var util = require('util');

var NRFUART_SERVICE_UUID = '6e400001b5a3f393e0a9e50e24dcca9e';
var NRFUART_WRITE_CHAR   = '6e400002b5a3f393e0a9e50e24dcca9e';


var ArduinoLCD = module.exports = function(uuid) {
	device.call(this);
	this._uuid = uuid;
	this.id = uuid;
	this._device=undefined;
	this._peripheral=undefined;
};
util.inherits(ArduinoLCD, device);

ArduinoLCD.prototype.init = function(config) {
	config	.name('LCD: '+this._uuid)
			.type('123')
			.state('disconnected')
			.when('disconnected',{allow:['connect']})
			.when('connected',{allow:['disconnect','send-message']})
			.map('connect',this.connect)
			.map('disconnect',this.disconnect)
			.map('send-message',this.sendMessage,[{type:'text',name:'message'}]);

};

ArduinoLCD.prototype.processData = function(device,packet,peripheral) {
	this._peripheral=peripheral;
};

ArduinoLCD.prototype.connect = function(cb){
	var self = this;
	this._peripheral.on('connect',function(){
		console.log("connected");
		self._peripheral.discoverSomeServicesAndCharacteristics([NRFUART_SERVICE_UUID], [NRFUART_WRITE_CHAR], function(error, services, characteristics){
			if(!error){
				self.sendTextData = function(line){
					characteristics[0].write(new Buffer(line),true,function(){
						console.log("> "+line);
					});
				}
			}
		});
		self.state="connected";
		cb();
	});

	this._peripheral.connect();

}

ArduinoLCD.prototype.disconnect = function(cb){
	this._peripheral.disconnect();
	this.state="disconnected";
	cb();
}

ArduinoLCD.prototype.sendMessage = function(message,cb){
	console.log("writing "+message);
	this.sendTextData(message);
	cb();
}
