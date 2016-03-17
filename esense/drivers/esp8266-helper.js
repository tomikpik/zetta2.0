var device = require('zetta-device');
var util = require('util');
var uuid = require('uuid');

var ESP8266helper = module.exports = function(uuid) {
	device.call(this);
	this._uuid = uuid;
	this.id = uuid;
	this._device=undefined;
	this._client=undefined;	
	this._server=undefined;
	this.location=undefined;
};
util.inherits(ESP8266helper, device);

ESP8266helper.prototype.init = function(config) {
	config	.name('ESP8266helper:'+this._uuid)
			.type('146')
			.state('ON')
			.monitor('location')
			.when('ON',{allow:['turn-all-on','turn-all-off','set-all-illumThreshold','receive-location']})
			.map('turn-off',this.gpio_turnOff)
			.map('turn-on',this.gpio_turnOn)
			.map('turn-all-off',this.gpio_turnAllOff)
			.map('turn-all-on',this.gpio_turnAllOn)
			.map('receive-location',this.receiveLocation,[{type:'text',name:'location'}])
			.map('set-all-illumThreshold',this.setIllumThreshold,[{type:'number',name:'illumThreshold'}]);
			
};

ESP8266helper.prototype.set = function(client,server) {
	this._client=client;
	this._server=server;
};

ESP8266helper.prototype.gpio_turnAllOn = function(cb){
	this._client.publish('/ESP8266/ALL/GPIO',"1:1",{qos:2},cb());	
}

ESP8266helper.prototype.gpio_turnAllOff = function(cb){
	this._client.publish('/ESP8266/ALL/GPIO',"0:1",{qos:2},cb());
}

ESP8266helper.prototype.setIllumThreshold = function(it,cb){
	var lightQuery = this._server.where({ type: '145' })
	this._server.observe([lightQuery], function(light){
		console.log("light",light.id,"threshold to",it);
		light.illumThreshold=it;
	});
	cb();
}


ESP8266helper.prototype.receiveLocation = function(location,cb){
	this.location = JSON.parse(location);
	cb();
}
