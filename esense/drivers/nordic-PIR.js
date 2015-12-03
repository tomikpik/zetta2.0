var device = require('zetta-device');
var util = require('util');
var convertHex = require('convert-hex');
timeoutPIR=-1;

var NordicPIR = module.exports = function(uuid) {
	device.call(this);
	this._uuid = uuid;
	this.id = uuid;
	this.increment=NaN;  
	this.pir=0;
    this.vbat=NaN;
    this.rssi=NaN;
};
util.inherits(NordicPIR, device);

NordicPIR.prototype.init = function(config) {
	config	.name('PIR: '+this._uuid)
			.type('129')
			.monitor('pir')
			.monitor('vbat')
			.monitor('rssi');
};

NordicPIR.prototype.processData = function(device, packet) {
	this.increment=packet[6];
	 
	var pir=packet[8];
	if(pir==255){
		if(this.pir==0){
			this.pir=1;
			var self = this;
			if(timeoutPIR==-1){
				timeoutPIR=setTimeout(function(){ 
					if(self.pir==1){
						self.pir=0;
					}
					timeoutPIR=-1;
				}, 4000);
			}
		}
	}
   
    this.vbat=parseInt("0x"+convertHex.bytesToHex([packet[14],packet[15]]),16);
	this.rssi=packet[16]-256;
	
    
};
