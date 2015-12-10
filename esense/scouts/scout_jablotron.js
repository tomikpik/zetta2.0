var Scout = require('zetta-scout');
var util = require('util');
var serialport = require("serialport");

var JablotronController = require("../drivers/JablotronControllerDriver");

var templateScout = module.exports = function() {
  Scout.call(this);

};
util.inherits(templateScout, Scout);

templateScout.prototype.init = function(next) {
	 this.discover(JablotronController, "08444732");

	serialPort = new serialport.SerialPort("/dev/ttyUSB0", {
		parser: serialport.parsers.readline("\n"),
		baudrate: 57600
	}, false);

	var self = this;

	serialPort.open(function(error) {
		if(error) {
			console.log("Error: No serial port available!");
		}else {
			console.log("Serial port wired up!");
		}
	});
	
	serialPort.on("data", function (data) {
		console.log(data);
		//Get the uuid
		var uuid = data.substring(0, 8);
		//Check if device is registred
		var device = self.server._jsDevices[uuid];

		if(device === undefined)
			device = self.server._jsDevices[data.substring(1,9)];

		//Device is registred, process the data!
		if(device !== undefined) {
			device.processData(device, data);
		}
	});
	next();
};
