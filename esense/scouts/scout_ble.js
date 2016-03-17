var Scout = require('zetta-scout');
var util = require('util');
var serialport = require('serialport');
var convertHex = require('convert-hex');

var nordicBaroTempHumiDriver = require("../drivers/nordic-BaroTempHumi");
var nordicPIRDriver = require("../drivers/nordic-PIR");


var bleScout = module.exports = function() {
  Scout.call(this);
  this.name="bleScout";

};
util.inherits(bleScout, Scout);

bleScout.prototype.init = function(next) {

	this.discover(nordicBaroTempHumiDriver,"30303001");
	this.discover(nordicBaroTempHumiDriver,"30303002");
	this.discover(nordicBaroTempHumiDriver,"30303015");
	this.discover(nordicPIRDriver,"30303003");


	serialPort = new serialport.SerialPort("/dev/ttyMFD1", {
		parser: serialport.parsers.readline("\n"),
		baudrate: 115200
	});
        
        var self = this;

	serialPort.on("data", function (d) {
		var packet = d.substring(d.indexOf("[")+1,d.indexOf("]"));
		if(packet.length!=53)return;
		packet = packet.split(":").join("");
		var data = new Buffer(convertHex.hexToBytes(packet));	
		self.newData(data,"868");	
	});




  	next();
};

bleScout.prototype.newData = function(data,channel,peripheral){
	if(channel=="868"){
		var uuid = convertHex.bytesToHex([data[2],data[3],data[4],data[5]]);
		var device = this.server._jsDevices[uuid.toUpperCase()];
		
		if(device !== undefined) {
			device.processData(device,data,peripheral);
		} else {
		 	console.log(uuid);
		}
	} 

}
