//module initialization
module.exports = function(server) {
    //target and hysteresis constants
	var target = 800;
	var hysteresis = Math.round(target/10);

    //steps between two power levels
	var transitionSteps = 2;

    //pid library
	var PID = require('pid-controller');
	//filesystem libray   
    var fs = require('fs');

<<<<<<< HEAD
	var lightQuery = server.where({ id: '4DCC31640E0' });
   	var illuminationQuery = server.where({ type: '156' });
=======
    //queries for devices
	var lightQuery = server.where({ type: '165' });
    var illuminationQuery = server.where({ type: '156' });
>>>>>>> e5bca83bb0af98437a0514b8b5dfac1a623f2372
	var helperQuery = server.where({ type: '169' });
	
    //controller
	var ctr = undefined;
  	
	var input=0;

    //check for changes on devices from queries
	server.observe([lightQuery,illuminationQuery,helperQuery], function(light,illumination,helper){
<<<<<<< HEAD
     	

		
  	    
     	light.streams.power.on('data', function(m) {
     			//console.log("power",m.data);
		});

=======
        
        //update PID gains
>>>>>>> e5bca83bb0af98437a0514b8b5dfac1a623f2372
		helper.streams.p.on('data', function(m) {
			if(ctr!=undefined){
				ctr.setTunings(helper.p,helper.i,helper.d);
			}			
     		});

        //update target illumination level
		helper.streams.target.on('data', function(m) {
				if(m.data<0)return;
				if(ctr!==undefined)ctr.setPoint(m.data);
		});
            
        //new illumination level from sensor received
		illumination.streams.illumination.on('data', function(m) {
<<<<<<< HEAD
			if(helper.state!='intensity')return;
=======
            //controller initialization
>>>>>>> e5bca83bb0af98437a0514b8b5dfac1a623f2372
			if(ctr==undefined){
                //load values from PID helper
				ctr = new PID(m.data,helper.target,helper.p,helper.i,helper.d, 'direct');
<<<<<<< HEAD
								

=======
				//ctr = new PID(m.data,target,0.03,0.15,0.001, 'direct');							
>>>>>>> e5bca83bb0af98437a0514b8b5dfac1a623f2372
				ctr.setMode(1);
				ctr.setOutputLimits(-1023,1023);
				ctr.initialize();
			}
            
			console.log("illum",m.data,"error:",Math.abs(m.data-helper.target));
<<<<<<< HEAD
			

			ctr.setInput(m.data);
    			ctr.compute();
			input = input + Math.round(ctr.getOutput());
			if(input<0)input=0;
			if(input>1023)input=1023	


			console.log("SET POWER TO: ",input);	
			light.call('set-power',input);
			
			var text = new Date().getTime()+";"+m.data+";"+input+";\n";
			fs.appendFile('log.csv',text,function (err) {
				console.log(err);
			});
				

			     			
=======
			//if lower than hysteresis
            if(Math.abs(m.data-helper.target)<0){
				console.log("ok");
			} else {
                //pass input data to PID controller
				ctr.setInput(m.data);
    			ctr.compute();
                //get actuator input
				input = 255-Math.round(ctr.getOutput());
	            
                //if the power level stays the same 
				if(light.power-input==0)return;
				console.log("SET POWER TO: ",input);	


				var diff = (input-light.power);
				var ip = light.power;

				//light.call('set-power',input);
                
                //1st transition step 50% of change applied
				setTimeout(function(){
					light.call('set-power',Math.round(ip+((diff/transitionSteps)*1)));
					console.log(Math.round(ip+((diff/transitionSteps)*1)));
				},0);
                //2nd transition step 100% of change applied
				setTimeout(function(){
					light.call('set-power',Math.round(ip+((diff/transitionSteps)*2)));
					console.log(Math.round(ip+((diff/transitionSteps)*2)));
				},250);

                //log values to file
				var text = new Date().getTime()+";"+m.data+";"+input+";\n";
				fs.appendFile('log.csv',text,function (err) {
					console.log(err);
				});
				
			}
     			
>>>>>>> e5bca83bb0af98437a0514b8b5dfac1a623f2372
		});
	});


	


}
