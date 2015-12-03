var device = require('zetta-device');
var util = require('util');
var convertHex = require('convert-hex');

var NordicAccelerometer = module.exports = function(uuid) {
	device.call(this);
	this._uuid = uuid;
	this.id = uuid;
	this.increment=NaN;
	this.accX=NaN;
	this.accY=NaN;
	this.accZ=NaN;
	this.vbat=NaN;
    this.rssi=NaN;
};
util.inherits(NordicAccelerometer, device);

NordicAccelerometer.prototype.init = function(config) {
	config	.name('Accelerometer: '+this._uuid)
			.type('89')
			.monitor('accX')
			.monitor('accY')
			.monitor('accZ')
			.monitor('increment')
			.monitor('vbat');
};

NordicAccelerometer.prototype.processData = function(device, packet) {
	this.increment=packet[6];

	var accX=parseInt("0x"+convertHex.bytesToHex([packet[8],packet[9]]),16);
    var accY=parseInt("0x"+convertHex.bytesToHex([packet[10],packet[11]]),16);
    var accZ=parseInt("0x"+convertHex.bytesToHex([packet[12],packet[13]]),16);
	
	if(accX>32768){
		this.accX=(-(65535-accX)+250)/17000;
	} else {
		this.accX=(accX+250)/17000;
	}
	
	if(accY>32768){
		this.accY=(-(65535-accY)-250)/17000;
	} else {
		this.accY=(accY-250)/17000;
	}
	
	if(accZ>32768){
		this.accZ=(-(65535-accZ)-250)/17000;
	} else {
		this.accZ=(accZ-250)/17000;
	}


	this.vbat=parseInt("0x"+convertHex.bytesToHex([packet[14],packet[15]]),16);
	this.rssi=packet[16]-256;
    
};
