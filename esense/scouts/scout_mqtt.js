var Scout = require('zetta-scout');
var util = require('util');

var mqtt = require('mqtt');
var esp8266gpio = require('../drivers/esp8266-gpio');
var client;


var MqttScout= module.exports = function() {
  Scout.call(this);

};
util.inherits(MqttScout, Scout);

MqttScout.prototype.init = function(next) {
	var self = this;
	client=mqtt.connect({port:41235,host:"localhost"});

	client.on('connect', function () {
    		client.subscribe('/ESP8266/ALL/HEARTBEAT',{qos:1});
    		//client.publish('/ESP8266/ALL/HEARTBEAT', 'Hello mqtt',{qos:1});
  	});

  	client.on('message', function (topic, message) {
      		if(topic=='/ESP8266/ALL/HEARTBEAT'){
        		self.newData(message.toString().split(":"),"MQTT");
      		}
  	});

	/*var device = this.server._jsDevices['uuid'];
  	if(device !== undefined) {
    		device.processData(device,null,peripheral);
  	}*/
	next();
};

MqttScout.prototype.newData = function(data,channel,peripheral){
	if(channel=="MQTT"){
    		var uuid = data[0];
    		var device = this.server._jsDevices[uuid.toUpperCase()];
   		// console.log(data);
    		if(device == undefined) {
      			device=this.discover(esp8266gpio, uuid);
    		}
    		device.processData(device,data,client);    
  	}
}
