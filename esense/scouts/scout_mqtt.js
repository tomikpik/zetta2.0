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
	//this.discover(esp8266gpio,"4AAC4");
	var self = this;
	client=mqtt.connect({port:41235,host:"localhost"});

	client.on('connect', function () {
    		client.subscribe('/ESP8266/ALL/HEARTBEAT',{qos:2});
		client.subscribe('/ESP8266/ALL/ACK',{qos:2});
      	});

  	client.on('message', function (topic, message) {
      		if(topic=='/ESP8266/ALL/HEARTBEAT'){
        		self.newData(message.toString().split(":"),"MQTT");
      		}
		if(topic=='/ESP8266/ALL/ACK'){
        		self.newData(message.toString().split(":"),"MQTT_ACK");
      		}
  	});
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
	if(channel=="MQTT_ACK"){
    		var uuid = data[0];
    		var device = this.server._jsDevices[uuid.toUpperCase()];
   		if(device!=undefined) {
			device.processAck(data); 
    		}
    		   
  	}
}
