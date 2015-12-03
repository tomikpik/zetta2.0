var Scout = require('zetta-scout');
var util = require('util');
var convertHex = require('convert-hex');

var serialport = require("serialport");

var nordicAccelerometerDriver = require("./nordic-accelerometer");
var thatWasEasyButtonDriver = require("./nordic-thatWasEasy");
var nordicBaroTempHumiDriver = require("./nordic-BaroTempHumi");
var nordicPIRDriver = require("./nordic-PIR");
var lcd = require('./arduino-lcd');
var hubLed= require('./hub-led');
var ebayBeacon = require('./ebay-beacon');
var esp8266gpio = require('./esp8266-gpio');

var arduinoUltrasonicDriver = require("./arduino-ultrasonic");

var mqtt = require('mqtt');
var client;


var BLEScout = module.exports = function() {
  Scout.call(this);
  this._name = 'ConcentratorScout';

};
util.inherits(BLEScout, Scout);



BLEScout.prototype.init = function(next) {
  client=mqtt.connect({port:41235,host:"localhost"});


	//this.discover(nordicAccelerometerDriver, "20202002");
	//this.discover(thatWasEasyButtonDriver,"20202066");
	//var a = this.discover(hubLed,"1");

	//this.discover(nordicBaroTempHumiDriver,"30303001");
	//this.discover(nordicBaroTempHumiDriver,"30303002");
	//this.discover(nordicPIRDriver,"30303003");
	//this.discover(lcd,"DCDA6AF37B7B");
	//this.discover(ebayBeacon,"FFFFF0000E6D");


	console.log("listening MQTT, BLE and 868mhz...");
  //self.newData(newData,"BLE");

  var self = this;

  client.on('connect', function () {
    client.subscribe('/ESP8266/ALL/HEARTBEAT',{qos:1});
    //client.publish('/ESP8266/ALL/HEARTBEAT', 'Hello mqtt',{qos:1});
  });

  client.on('message', function (topic, message) {
      if(topic=='/ESP8266/ALL/HEARTBEAT'){
        self.newData(message.toString().split(":"),"MQTT");
      }
  });


	next();
};

BLEScout.prototype.newData = function(data,channel,peripheral){
	if(channel=="BLE"||channel=="868"){
		var uuid = convertHex.bytesToHex([data[2],data[3],data[4],data[5]]);
		var device = this.server._jsDevices[uuid.toUpperCase()];

		if(device !== undefined) {
			device.processData(device,data,peripheral);
		}
	} else if(channel=="BLE_MAC"){
		var uuid=peripheral.uuid;
		var device = this.server._jsDevices[uuid.toUpperCase()];
		if(device !== undefined) {
			device.processData(device,null,peripheral);
		}
	} else if(channel=="MQTT"){
    var uuid = data[0];
    var device = this.server._jsDevices[uuid.toUpperCase()];
   // console.log(data);
    if(device == undefined) {
      device=this.discover(esp8266gpio, uuid);
    }
    device.processData(device,data,client);    
  }

}

BLEScout.prototype.registerDevice = function(uuid, sensor_type) {
	console.log("Registering device with uuid: "+uuid+" | Type: "+sensor_type);

	if(this.server._jsDevices[uuid] === undefined) {

	switch(sensor_type) {
		case 89:
			this.discover(nordicAccelerometerDriver, uuid);
			break;
		case 123:
			this.discover(lcd,uuid);
			break;
		case 124:
			this.discover(ebayBeacon,uuid);
			break;
		case 128:
			this.discover(nordicBaroTempHumiDriver, uuid);
			break;
		case 129:
			this.discover(nordicPIRDriver, uuid);
			break;
		case 200:
		    this.discover(thatWasEasyButtonDriver, uuid);
			break;
		case 241:
		    this.discover(arduinoUltrasonicDriver,uuid);
		    break
		default:
			console.log("Register: No such device type, sorry.");
			break;
		}

	}

	//Send message to the cloud
	var object = new Object();
	object.type = 'DISCOVERED';
	object.uuid = this.server.httpServer.zetta._uuid
	object.sensor_uuid = uuid;
	object.sensor_id = uuid;
	this.server.httpServer.zetta._cloudSocket.sendData(object);
};

BLEScout.prototype.deleteDevice = function(uuid) {
	var device = this.server._jsDevices[uuid.toUpperCase()];
	console.log("Deleting sensor: "+uuid);
	if(device !== undefined) {
		delete this.server._jsDevices[uuid.toUpperCase()];
	}
};
