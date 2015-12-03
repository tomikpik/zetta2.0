var device = require('zetta-device');
var util = require('util');
var convertHex = require('convert-hex');
timeout3=-1;

var ThatWasEasyButton = module.exports = function(uuid) {
	device.call(this);
	this._uuid = uuid;
	this.id = uuid;
	this.temperature=NaN;
	this.humidity=NaN;
	this.vbat=NaN;
    this.rssi=NaN;
    this.pressure=NaN;
    this.state=0;
};
util.inherits(ThatWasEasyButton, device);

ThatWasEasyButton.prototype.init = function(config) {
	config	.name('ThatWasEasyButton: '+this._uuid)
			.type('200')
			.state('0')
			.monitor('state')
			.monitor('temperature')
			.monitor('increment')
			.monitor('vbat')
			.monitor('rssi')
			.monitor('pressure');
			
};

ThatWasEasyButton.prototype.processData = function(device, packet) {
	if(this.state==0 && timeout3==-1){
		this.state = 1;
		var self = this;
		timeout3=setTimeout(function(){ 
			if(self.state==1){
				self.state=0;
				timeout3=-1;
			}
		}, 1200);
	}
	
	this.increment=packet[6];
	this.pressure=parseInt("0x"+convertHex.bytesToHex([packet[8],packet[9]]),16)/10;
	this.temperature=parseInt("0x"+convertHex.bytesToHex([packet[10],packet[11]]),16)/256;
	this.vbat=parseInt("0x"+convertHex.bytesToHex([packet[14],packet[15]]),16);
	this.rssi=packet[16]-256;
   
};
