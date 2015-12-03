var device = require('zetta-device');
var util = require('util');
timeout=-1;
timeout2=-1;
oldTime = new Date().getTime();
//fffff0000e6d

var EbayBeacon = module.exports = function(uuid) {
	device.call(this);
	this._uuid = uuid;
	this.id = uuid;
	this._device=undefined;
	this.rssi=NaN;
	this._timeout=undefined;
	this.state=0;
	this.time=NaN;
	this.button='RELEASED';
};
util.inherits(EbayBeacon, device);

EbayBeacon.prototype.init = function(config) {
	config	.name('EbayBeacon: '+this._uuid)
			.type('124')
			.monitor('rssi')
			.monitor('state')	
			.monitor('time')
			.monitor('button');	
};

EbayBeacon.prototype.processData = function(device,packet,peripheral) {
	this.rssi=peripheral.rssi;
	this.state=1;
	
	newTime = new Date().getTime();
	this.time=newTime-oldTime;
	oldTime=newTime;
	
	var self = this;
	
	if(this.time<300&&timeout2==-1){
		this.button='PRESSED';
		timeout2=setTimeout(function(){ 
			self.button='RELEASED';
			timeout2=-1;
		}, 1500);
	}
	
	clearTimeout(timeout);
	this.state = 1;
	
	timeout=setTimeout(function(){ 
		self.state=0;
	}, 40000);
	
	
};
