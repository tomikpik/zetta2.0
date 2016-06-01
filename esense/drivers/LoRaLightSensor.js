//load necessary libraries
var device = require('zetta-device');
var util = require('util');

/**
 * Export
 */
var LoRaLightSensor = module.exports = function(uuid) {
	device.call(this);
	this._uuid = uuid;
	this.id = uuid;

	this.increment=0;
	this.illumination=0;


	
};
util.inherits(LoRaLightSensor, device);

/**
 * Initialization
 */
LoRaLightSensor.prototype.init = function(config) {
	config	.name('LoRaLight:'+this._uuid)
			.type('156')
			.state('ON')
			.monitor('increment')
			.monitor('illumination');

};

/**
 * Parse incoming packet
 */
LoRaLightSensor.prototype.processData = function(data) {
    //update data
    var increment = parseInt("0x"+data.substr(18,2),16);
    var msb = parseInt("0x"+data.substr(20,2),16);
    var lsb = parseInt("0x"+data.substr(22,2),16);
    var crc = parseInt("0x"+data.substr(24,2),16);
    //if crc matches
    if((crc^msb^lsb)==0){
        this.increment=increment;
        
        //calculate illumination level from msb and lsb
        var raw = ((msb << 8) | lsb);
        var result = raw&0x0FFF;
        var exponent = (raw>>12)&0x000F;

        switch(exponent){
            case 0: //*0.015625
                this.illumination= result>>6; break;
            case 1: //*0.03125
                this.illumination= result>>5; break;
            case 2: //*0.0625
                this.illumination= result>>4; break;
            case 3: //*0.125
                this.illumination= result>>3; break;
            case 4: //*0.25
                this.illumination= result>>2; break;
            case 5: //*0.5
                this.illumination= result>>1; break;
            case 6:
                this.illumination= result;    break;
            case 7: //*2
                this.illumination= result<<1; break;
            case 8: //*4
                this.illumination= result<<2; break;
            case 9: //*8
                this.illumination= result<<3; break;
            case 10: //*16
                this.illumination= result<<4; break;
            case 11: //*32
                this.illumination= result<<5; break;
        }
        //console.log(this.increment,this.illumination);
    }    
};