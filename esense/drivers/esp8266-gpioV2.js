//load necessary libraries
var device = require('zetta-device');
var util = require('util');
var uuid = require('uuid');

/**
 * Export
 */
var ESP8266V2 = module.exports = function(uuid) {
	device.call(this);
	this._uuid = uuid;
	this.id = uuid;
	this._client=undefined;
	this.power=0;
	this.version="";
	this.increment=0;
	this._callbacks=[];
	this._requestId=0;	
};
util.inherits(ESP8266V2, device);

/**
 * Initialization
 */
ESP8266V2.prototype.init = function(config) {
	config	.name('ESP8266V2:'+this._uuid)
			.type('165')
			.state('ON')		
			.monitor('power')
			.monitor('version')
			.monitor('increment')
			.when('ON',{allow:['set-power']})
			.when('OFF',{allow:['set-power']})
			.map('set-power',this.setPower,[{type:'number',name:'power'}]);
			
};

/**
 * Method for passing new data (packet)
 */
ESP8266V2.prototype.processData = function(packet) {
	//copy data
    this.version=packet.version;
	this.power=packet.power;
	this.increment=packet.increment;
    //delete from pending queue
	var callback = this._callbacks[packet.reqID];
	if(callback!==undefined){
		callback();
		delete this._callbacks[packet.reqID];
	}

};

/**
 * Method used to set power to desired level
 */
ESP8266V2.prototype.setPower = function(power,cb){
	//create pending queue record
    var o = new Object();
	o.reqID = uuid.v1();
	o.power = power;

    //publish message
	this._client.publish('/ESP8266V2/'+this._uuid,JSON.stringify(o),{qos:2});
	//add record to queue
    this._callbacks[o.reqID]=cb;	
}

/**
 * MQTT client setter
 */
ESP8266V2.prototype.setClient = function(client){
	this._client=client;
}


