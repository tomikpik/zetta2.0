//load necessary libraries
var device = require('zetta-device');
var util = require('util');
var uuid = require('uuid');

<<<<<<< HEAD

=======
/**
 * Export
 */
>>>>>>> e5bca83bb0af98437a0514b8b5dfac1a623f2372
var PIDhelper = module.exports = function(uuid) {


	device.call(this);
	this._uuid = uuid;
	this.id = uuid;
	this._device=undefined;
	this.p=0.53;
	this.i=0.00;
	this.d=0.01;
	this.location=new Object();
	

	this.target=500;
	this.error=0.05;

};
util.inherits(PIDhelper, device);

/**
 * Initialization
 */
PIDhelper.prototype.init = function(config) {
	config	.name('PIDhelper:'+this._uuid)
			.type('169')
			.state('proximity')
			//.state('intensity')
			//.state('onoff')
			
			.monitor('p')
			.monitor('i')
			.monitor('d')
			.monitor('target')
			.monitor('error')
			.monitor('location')
			.when('intensity',{allow:['set-pid','set-target','set-error']})
			.when('proximity',{allow:['set-location']})
			.map('set-pid',this.setPID,[{type:'number',name:'p'},{type:'number',name:'i'},{type:'number',name:'d'}])
			.map('set-location',this.setLocation,[{type:'text',name:'location'}])
			.map('set-target',this.setTarget,[{type:'number',name:'target'}])
			.map('set-error',this.setError,[{type:'number',name:'error'}]);
};

/**
 * Method for updating PID gains
 */
PIDhelper.prototype.setPID = function(p,i,d,cb){
	console.log(p,i,d);
	this.p=p;
	this.i=i;
	this.d=d;
	cb();
};

PIDhelper.prototype.setLocation = function(location,cb){
	this.location=JSON.parse(location);
	cb();
};

/**
 * Method for updating target illumination level
 */
PIDhelper.prototype.setTarget = function(target,cb){
	this.target=target;
	cb();
};

/**
 * Method for updating allowed error
 */
PIDhelper.prototype.setError = function(error,cb){
	this.error=error;
	cb();

};
