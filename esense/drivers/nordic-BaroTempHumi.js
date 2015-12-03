var device = require('zetta-device');
var util = require('util');
var convertHex = require('convert-hex');
var request = require("request");

var NordicBaroTempHumi = module.exports = function(uuid) {
	device.call(this);
	this._uuid = uuid;
	this.id = uuid;
	this.increment=NaN;
	this.pressure=NaN;
	this.temperature=NaN;
	this.humidity=NaN;
	this.vbat=NaN;
    this.rssi=NaN;
};
util.inherits(NordicBaroTempHumi, device);

NordicBaroTempHumi.prototype.init = function(config) {
	config	.name('BaroTempHumi: '+this._uuid)
			.type('128')
			.monitor('increment')
			.monitor('pressure')
			.monitor('temperature')
			.monitor('humidity')
			.monitor('vbat')
			.monitor('rssi')
};

NordicBaroTempHumi.prototype.processData = function(device, packet) {
	this.increment=packet[6];
	//26 type
	this.pressure=parseInt("0x"+convertHex.bytesToHex([packet[8],packet[9]]),16)/10;
	this.temperature=parseInt("0x"+convertHex.bytesToHex([packet[10],packet[11]]),16)/256;
	this.humidity=packet[12];
	this.vbat=parseInt("0x"+convertHex.bytesToHex([packet[14],packet[15]]),16);
	this.rssi=packet[16]-256;
	
	var key = "";
	if(this._uuid=="30303001"){
		key="5QS61N9880TU4I6O";
	} else if(this._uuid=="30303002"){
		key="2QW63RAWBIULEHY0";
	}

	
	request("http://api.thingspeak.com/update?key="+key+"&field1="+this.vbat+"&field2="+this.temperature+"&field3="+this.pressure+"&field4="+this.humidity);
};
