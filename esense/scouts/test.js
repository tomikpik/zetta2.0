var serialport = require('serialport');

serialPort = new serialport.SerialPort("/dev/ttyMFD1", {
	parser: serialport.parsers.readline("\n"),
	baudrate: 115200
});
  
	serialPort.on("data", function (d) {
		var packet = d.substring(d.indexOf("[")+1,d.indexOf("]"));
		console.log(packet);	
	});