var device = require('zetta-device');
var util = require('util');
var uuid = require('uuid');

var ESP8266 = module.exports = function(uuid) {
	device.call(this);
	this._uuid = uuid;
	this.id = uuid;
	this._device=undefined;
	this._client=undefined;
	this.rssi=NaN;
	this.increment=NaN;
	this.illumination=NaN;
	this.pressure=NaN;
	this.temperature=NaN;
	this._callbacks=[];
	this._requestId=0;
	this.illumThreshold=-1;
	
};
util.inherits(ESP8266, device);

ESP8266.prototype.init = function(config) {
	config	.name('ESP8266:'+this._uuid)
			.type('145')
			.state('ON')
			
.when('ON',{allow:['turn-off','turn-all-on','turn-all-off','set-illumThreshold']})
			
.when('OFF',{allow:['turn-on','turn-all-on','turn-all-off','set-illumThreshold']})


			//.when('connected',{allow:['disconnect','send-message']})
			.monitor('rssi')
			.monitor('increment')
			.monitor('illumination')
			.monitor('pressure')
			.monitor('temperature')
			.monitor('illumThreshold')
			.map('turn-off',this.gpio_turnOff)
			.map('turn-on',this.gpio_turnOn)
			.map('turn-all-off',this.gpio_turnAllOff)
			.map('turn-all-on',this.gpio_turnAllOn)
			.map('set-illumThreshold',this.setIllumThreshold,[{type:'number',name:'illumThreshold'}]);
			
};

ESP8266.prototype.processData = function(device,packet,client) {
	//device.processData(device,data,peripheral);
		this._device=device;
		this.rssi=packet[2];
		this.increment=packet[1];
		this._client=client;
		this.illumination=packet[4];
		this.pressure=packet[5]/100;
		this.temperature=packet[6]/100;

		this.state=(packet[3].charAt(0)==1)?'ON':'OFF';
};

ESP8266.prototype.processAck = function(packet) {
	var callback = this._callbacks[packet[1]];
	if(callback!==undefined){
		this.state=(packet[2].charAt(0)==1)?'ON':'OFF';
		this._callbacks[packet[1]]();
		delete this._callbacks[packet[1]];
	}	
}


ESP8266.prototype.gpio_turnOn = function(cb){
	var u = uuid.v1();
	this._client.publish('/ESP8266/'+this._uuid+'/GPIO',"1:"+u,{qos:2});
	this._callbacks[u]=cb;	
}

ESP8266.prototype.gpio_turnOff = function(cb){
	var u = uuid.v1();
	this._client.publish('/ESP8266/'+this._uuid+'/GPIO',"0:"+u,{qos:2});
	this._callbacks[u]=cb;	
}

ESP8266.prototype.gpio_turnAllOn = function(cb){
	var u = uuid.v1();
	this._client.publish('/ESP8266/ALL/GPIO',"1:"+u,{qos:2});
	this._callbacks[u]=cb;	
}

ESP8266.prototype.gpio_turnAllOff = function(cb){
	var u = uuid.v1();
	this._client.publish('/ESP8266/ALL/GPIO',"0:"+u,{qos:2});
	this._callbacks[u]=cb;	
}

ESP8266.prototype.setIllumThreshold = function(it,cb){
	if(it<-1)it=-1;
	console.log("setting threshold to: "+it);
	this.illumThreshold=it;
	cb();
}


