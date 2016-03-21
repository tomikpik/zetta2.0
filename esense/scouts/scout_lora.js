var Scout = require('zetta-scout');
var util = require('util');
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var serialPort;
var delay=100;


var LoRaLight = require('../drivers/LoRaLight');
var LoRaLightSensor = require('../drivers/LoRaLightSensor');

var LoraScout= module.exports = function() {
    this.lastSent=(new Date).getTime();
    Scout.call(this);

};
util.inherits(LoraScout, Scout);

LoraScout.prototype.init = function(next) {
    var self=this;
    
    var queue = new Array();
    
    
    var dev1 = this.discover(LoRaLight, "0004A30B001B28AB");
    dev1.setQueue(queue);
    

    var dev3 = this.discover(LoRaLightSensor, "0004A30B001B2898");


    
    var dev2 = this.discover(LoRaLight, "0004A30B001B9BEE");
    dev2.setQueue(queue);

    setInterval(function(){
        var tmp = ((new Date).getTime()-self.lastSent);
        
        if(tmp>delay*1.5){
            console.log("   ",tmp);
            console.log("that's bad");
            self.setupDongle();
        }
    }, 3000);


    serialPort = new SerialPort("/dev/ttyUSB1", {
        baudrate: 57600,
        parser: serialport.parsers.readline("\r\n")
    });
    
    serialPort.on('data', function(data) {
                
        if(data.indexOf("radio_tx_ok")!=-1){
            serialPort.write("radio rx 0\r\n");     
            self.lastSent=(new Date).getTime();
            return;
        } 
        
        if(data.indexOf("radio_err")!=-1){
            
            
            if(queue.length>0){
                var a = queue[0].uuid;
                var device = self.server._jsDevices[a.toUpperCase()];
                if(device != undefined) {
                    self.lastSent=(new Date).getTime();
                    var message = "radio tx 43"+a+((device.setPower<16)?"0":"")+(device.setPower.toString(16).toUpperCase())+"00\r\n";
                    console.log(message)
                    serialPort.write(message);                            
                    return;
                }    
            } else {
                serialPort.write("radio rx 0\r\n");     
                self.lastSent=(new Date).getTime();    
            }
            
            
            return;
        } 
        if(data.indexOf("radio_rx")!=-1){
            
            
            
            var a = data.split("  ")[1];
 	    console.log(a,a.length);
            if(a.length==30){
                if(a.indexOf('42')==0){
                    var uuid = a.substr(2,16);
                    var increment = parseInt("0x"+a.substr(18,2),16);
                    var pwm = parseInt("0x"+a.substr(20,2),16);
                    var type = parseInt("0x"+a.substr(22,2),16);
                    
                    
                    var device = self.server._jsDevices[uuid.toUpperCase()];
                    if(device != undefined) {
                        //device=self.discover(LoRaLight, uuid);
                        device.processData(increment,pwm,type);   
                        console.log('\r\nuuid:',uuid,"inc:",increment,"pwm",pwm,"type",type);  
                        if(queue.length>0){
                            var a = queue[0].uuid;
                            var device = self.server._jsDevices[a.toUpperCase()];
                            if(device != undefined) {
                                self.lastSent=(new Date).getTime();
                                var message = "radio tx 43"+a+((device.setPower<16)?"0":"")+(device.setPower.toString(16).toUpperCase())+"00\r\n";
                                console.log(message)
                                serialPort.write(message);                            
                                return;
                            }    
                        }                          
                    }                    
                } else if(a.indexOf('41')==0){
                    var uuid = a.substr(2,16);
	    	    var device = self.server._jsDevices[uuid.toUpperCase()];
			
                    if(device != undefined) {
                        device.processData(a);  
                    }	
			
		}
  			
            }
            serialPort.write("radio rx 0\r\n"); 
            self.lastSent=(new Date).getTime();  
        }
        
        
        
        
        if(data=='ok')return;
        if(data=='radio_err')return;
        if(data.indexOf('radio_rx')!=-1)return;
        console.log(data);
        
    });
    
    serialPort.on("open", function () {
        console.log('open');
        self.setupDongle();
    });
    
	next();
};

LoraScout.prototype.newData = function(data,channel,peripheral){

}


LoraScout.prototype.setupDongle = function(){
  setTimeout(function(){ serialPort.write("sys reset\r\n") }, 0);
  //setTimeout(function(){ serialPort.write("sys get ver\r\n") }, 100);
  setTimeout(function(){ serialPort.write("radio set pwr 0\r\n") }, 200);
  setTimeout(function(){ serialPort.write("radio set bw 500\r\n") }, 300);
  setTimeout(function(){ serialPort.write("radio set sf sf7\r\n") }, 400);
  setTimeout(function(){ serialPort.write("radio set cr 4/8\r\n") }, 500);
  setTimeout(function(){ serialPort.write("radio set crc on\r\n") }, 600);
  setTimeout(function(){ serialPort.write("radio set wdt "+delay+"\r\n") }, 700);
  setTimeout(function(){ serialPort.write("mac pause\r\n") }, 800);  
  setTimeout(function(){ serialPort.write("radio rx 0\r\n"); console.log("ok"); }, 900);       
}