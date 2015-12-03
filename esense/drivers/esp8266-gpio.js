var device = require('zetta-device');
var util = require('util');

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
	this._callbackQueue= new Array();
	
};
util.inherits(ESP8266, device);

ESP8266.prototype.init = function(config) {
	config	.name('ESP8266:'+this._uuid)
			.type('145')
			.state('ON')
			.when('ON',{allow:['turn-off','turn-all-on','turn-all-off']})
			.when('OFF',{allow:['turn-on','turn-all-on','turn-all-off']})


			//.when('connected',{allow:['disconnect','send-message']})
			.monitor('rssi')
			.monitor('increment')
			.monitor('illumination')
			.monitor('pressure')
			.monitor('temperature')
			//.map('GPIO',this.gpio,[{type:'text',name:'value'}])
			//.map('GPIO ALL',this.gpioAll,[{type:'text',name:'value'}]);
			.map('turn-off',this.gpio_turnOff)
			.map('turn-on',this.gpio_turnOn)
			.map('turn-all-off',this.gpio_turnAllOff)
			.map('turn-all-on',this.gpio_turnAllOn);

};

ESP8266.prototype.processData = function(device,packet,client) {
	//device.processData(device,data,peripheral,server);
		this._device=device;
		this.rssi=packet[2];
		this.increment=packet[1];
		this._client=client;
		this.illumination=packet[4];
		this.pressure=packet[5]/100;
		this.temperature=packet[6]/100;
		
		if(packet[3].charAt(0)==1){
			this.state='ON';
		} else {
			this.state='OFF';	
		}

	this._callbackQueue.forEach(function(element) {
		element();
	});
	this._callbackQueue.splice(0,this._callbackQueue.length);	

};

ESP8266.prototype.gpio_turnOn = function(cb){
	this._client.publish('/ESP8266/'+this._uuid+'/GPIO',"1",{qos:2});
	this._callbackQueue.push(cb);
	
}

ESP8266.prototype.gpio_turnOff = function(cb){
	this._client.publish('/ESP8266/'+this._uuid+'/GPIO',"0",{qos:2});
	this._callbackQueue.push(cb);
}

ESP8266.prototype.gpio_turnAllOn = function(cb){
	this._client.publish('/ESP8266/ALL/GPIO',"1",{qos:2});
	this._callbackQueue.push(cb);
}

ESP8266.prototype.gpio_turnAllOff = function(cb){
	this._client.publish('/ESP8266/ALL/GPIO',"0",{qos:2});
	this._callbackQueue.push(cb);
}

ESP8266.prototype.gpio = function(value,cb){
	this._client.publish('/ESP8266/'+this._uuid+'/GPIO', value,{qos:1});
	cb();
}

ESP8266.prototype.gpioAll = function(value,cb){
	this._client.publish('/ESP8266/ALL/GPIO', value,{qos:1});
	cb();
}


