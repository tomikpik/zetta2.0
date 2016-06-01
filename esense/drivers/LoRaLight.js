//load necessary libraries
var device = require('zetta-device');
var util = require('util');

/**
 * Export
 */
var LoRaLight = module.exports = function(uuid) {
	device.call(this);
	this._uuid = uuid;
	this.id = uuid;

	this.increment=0;
	this.power=NaN;
    this.setPower=0;
    this._queue=null;
	
};
util.inherits(LoRaLight, device);

/**
 * Initialization
 */
LoRaLight.prototype.init = function(config) {
	config	.name('LoRaLight:'+this._uuid)
			.type('155')
			.state('ON')
			.when('ON',{allow:['set-power']})
			.monitor('increment')
			.monitor('power')
			.map('set-power',this.setIllum,[{type:'number',name:'value'}]);

};

/**
 * Parse incoming packet
 */
LoRaLight.prototype.processData = function(increment,pwm,type) {
    //console.log(increment,pwm,type);
    //copy data
    this.increment=increment;
    this.power=pwm;
    
   
    var uuid = this._uuid;
    var q=undefined;
    
    //check if record exists in pending request queue
    var o = this._queue.find(function(obj,index){
        if(obj.uuid===uuid)q=index;
        return (obj.uuid===uuid);
    });
    
    //delete from pending request queue
    if(o!=undefined){
        if(pwm==o.value){
	    console.log(">>>>>>>>>>>>",new Date().getTime());	
            o.cbArray.forEach(function(callback){
               callback(); 
            });
            this._queue.splice(q,1);
        }
    }
    
};

/**
 * Set power to desired level
 */
LoRaLight.prototype.setIllum = function(value,cb){
    //crop values
    if(value<0)value=0;
    if(value>255)value=255;
    console.log(">>>>>>>>>>>>",new Date().getTime());	
  
    //check if record exists in pending request queue
    var uuid = this._uuid;
    var o = this._queue.find(function(obj){
        console.log(obj.uuid,(obj.uuid===uuid));
        return (obj.uuid===uuid);
    });
    
    if(o==undefined){
        //update old
        o=new Object();
        o.uuid=this._uuid;
        o.cbArray=new Array();
        o.value=value;
        o.cbArray.push(cb);
        this._queue.push(o);
    } else {
        //create new
        o.value=value;
        o.cbArray.push(cb);   
    }
    
    this.setPower=value;
}

/**
 * Pending queue setter
 */
LoRaLight.prototype.setQueue = function(queue){
    this._queue=queue;
}


