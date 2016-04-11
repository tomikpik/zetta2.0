var device = require('zetta-device');
var util = require('util');
var uuid = require('uuid');

var PIDhelper = module.exports = function(uuid) {
	device.call(this);
	this._uuid = uuid;
	this.id = uuid;
	this._device=undefined;
	this.p=0.03;
	this.i=0.27;
	this.d=0.0;
	this.target=300;
	this.error=50;

};
util.inherits(PIDhelper, device);

PIDhelper.prototype.init = function(config) {
	config	.name('PIDhelper:'+this._uuid)
			.type('169')
			.state('ON')
			.monitor('p')
			.monitor('i')
			.monitor('d')
			.monitor('target')
			.monitor('error')
			.when('ON',{allow:['set-pid','set-target','set-error']})
			.map('set-pid',this.setPID,[{type:'number',name:'p'},{type:'number',name:'i'},{type:'number',name:'d'}])
			.map('set-target',this.setTarget,[{type:'number',name:'target'}])
			.map('set-error',this.setError,[{type:'number',name:'error'}]);
};

PIDhelper.prototype.setPID = function(p,i,d,cb){
	console.log(p,i,d);
	this.p=p;
	this.i=i;
	this.d=d;
	cb();
}

PIDhelper.prototype.setTarget = function(target,cb){
	this.target=target;
	cb();
}

PIDhelper.prototype.setError = function(error,cb){
	this.error=error;
	cb();
}