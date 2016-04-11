module.exports = function(server) {
	var target = 800;
	var hysteresis = Math.round(target/10);

	var transitionSteps = 2;

	var PID = require('pid-controller');
	var fs = require('fs');

	var lightQuery = server.where({ type: '165' });
   var illuminationQuery = server.where({ type: '156' });
	var helperQuery = server.where({ type: '169' });
	
	var ctr = undefined;
  	
	var input=0;

	server.observe([lightQuery,illuminationQuery,helperQuery], function(light,illumination,helper){
     	
		
  	    
     	light.streams.power.on('data', function(m) {
     			//console.log("power",m.data);
		});

		helper.streams.p.on('data', function(m) {
			if(ctr!=undefined){
				ctr.setTunings(helper.p,helper.i,helper.d);
			}			
     	});

		helper.streams.target.on('data', function(m) {
				if(m.data<0)return;
				if(ctr!==undefined)ctr.setPoint(m.data);
		});


		illumination.streams.illumination.on('data', function(m) {
			if(ctr==undefined){
				ctr = new PID(m.data,helper.target,helper.p,helper.i,helper.d, 'direct');
				//ctr = new PID(m.data,target,0.03,0.15,0.001, 'direct');
								

				ctr.setMode(1);
				ctr.setOutputLimits(0,255);
				ctr.initialize();
			}

			console.log("illum",m.data,"error:",Math.abs(m.data-helper.target));
			if(Math.abs(m.data-helper.target)<0){
				console.log("ok");
			} else {



				ctr.setInput(m.data);
    			ctr.compute();
				input = 255-Math.round(ctr.getOutput());
	
				if(light.power-input==0)return;
				console.log("SET POWER TO: ",input);	


				var diff = (input-light.power);
				var ip = light.power;

				//light.call('set-power',input);
				setTimeout(function(){
					//light.call('set-power',Math.round(ip+((diff/transitionSteps)*1)));
					//console.log(Math.round(ip+((diff/transitionSteps)*1)));
				},0);
				setTimeout(function(){
					light.call('set-power',Math.round(ip+((diff/transitionSteps)*2)));
					console.log(Math.round(ip+((diff/transitionSteps)*2)));
				},0);

				var text = new Date().getTime()+";"+m.data+";"+input+";\n";
				fs.appendFile('log.csv',text,function (err) {
					console.log(err);
				});
				

				
			}
     			
		});
	});


	


}
