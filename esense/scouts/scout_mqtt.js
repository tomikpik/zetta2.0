var Scout = require('zetta-scout');
var util = require('util');

var mqtt = require('mqtt');
var esp8266gpio = require('../drivers/esp8266-gpio');
var esp8266gpioV2 = require('../drivers/esp8266-gpioV2');
var esp8266helper = require('../drivers/esp8266-helper');
var client;


var MqttScout= module.exports = function() {
  Scout.call(this);

};
util.inherits(MqttScout, Scout);

MqttScout.prototype.init = function(next) {
	helper = this.discover(esp8266helper,"helper");

	var self = this;
	client=mqtt.connect({port:41235,host:"localhost"});

	client.on('connect', function () {
    		client.subscribe('/ESP8266/ALL/HEARTBEAT',{qos:2});
		client.subscribe('/ESP8266/ALL/ACK',{qos:2});
		client.subscribe('/ESP8266V2/ALL/HEARTBEAT',{qos:2});
      	});

  	client.on('message', function (topic, message) {
      		if(topic=='/ESP8266/ALL/HEARTBEAT'){
        		self.newData(message.toString().split(":"),"MQTT");
      		}
		if(topic=='/ESP8266/ALL/ACK'){
        		self.newData(message.toString().split(":"),"MQTT_ACK");
      		}
		if(topic=='/ESP8266V2/ALL/HEARTBEAT'){
        		self.newData(message.toString(),"MQTTV2");
      		}
  	});

	helper.set(client,this.server);
	next();
};

MqttScout.prototype.newData = function(data,channel,peripheral){
	if(channel=="MQTT"){
    		var uuid = data[0].toUpperCase();
    		var device = this.server._jsDevices[uuid];
   		// console.log(data);
    		if(device == undefined) {
      			device=this.discover(esp8266gpio, uuid);
    		}
    		device.processData(device,data,client);    
  	}
	if(channel=="MQTT_ACK"){
    		var uuid = data[0].toUpperCase();
    		var device = this.server._jsDevices[uuid];
   		if(device!=undefined) {
			device.processAck(data); 
    		}
    		   
  	}
	if(channel=="MQTTV2"){
		var message = JSON.parse(data);
		var device = this.server._jsDevices[message.clientid.toUpperCase()];
   		//console.log(message);
    		if(device == undefined) {
      			device=this.discover(esp8266gpioV2, message.clientid.toUpperCase());
			device.setClient(client)
    		}
    		device.processData(message);        		
  	}
}
