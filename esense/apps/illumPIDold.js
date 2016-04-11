module.exports = function(server) {
	var target = 350;
	var hysteresis = Math.round(target/10);

	var transitionSteps = 6;

	var PID = require('pid-controller');

	var lightQuery = server.where({ type: '165' });
   var illuminationQuery = server.where({ type: '156' });
	
	var ctr = undefined;
  	
	var input=0;

	server.observe([lightQuery,illuminationQuery], function(light,illumination){
     	
		
  	    
     		light.streams.power.on('data', function(m) {
     			//console.log("power",m.data);
		});
		illumination.streams.illumination.on('data', function(m) {

			if(ctr==undefined){
				//ctr = new PID(m.data,target,0.08,0.7,0.01, 'direct');
				ctr = new PID(m.data,target,0.007,0.00006,0.0067, 'direct');
				
				

				ctr.setMode(1);
				ctr.setOutputLimits(0,255);
				ctr.initialize();
			}

			console.log("illum",m.data);
			if(Math.abs(m.data-target)<hysteresis){
				console.log("ok");
			} else {
				ctr.setInput(m.data);
    			ctr.compute();
				input = 255-Math.round(ctr.getOutput());
	
				console.log("-regulate",input);	
				light.call('set-power',input);

				return;
				var diff = (input-light.power);
				var ip = light.power;
				if((ip-input)==0)return;
				
				if(Math.abs(diff)<1000){
					setTimeout(light.call('set-power',ip+diff),0);
					return;
				}

				setTimeout(function(){
					light.call('set-power',Math.round(ip+((diff/transitionSteps)*1)));
					console.log(Math.round(ip+((diff/transitionSteps)*1)));
				},0);
				setTimeout(function(){
					light.call('set-power',Math.round(ip+((diff/transitionSteps)*2)));
					console.log(Math.round(ip+((diff/transitionSteps)*2)));
				},167);
				setTimeout(function(){
					light.call('set-power',Math.round(ip+((diff/transitionSteps)*3)));
					console.log(Math.round(ip+((diff/transitionSteps)*3)));
				},333);
				setTimeout(function(){
					light.call('set-power',Math.round(ip+((diff/transitionSteps)*4)));
					console.log(Math.round(ip+((diff/transitionSteps)*4)));
				},500);
				setTimeout(function(){
					light.call('set-power',Math.round(ip+((diff/transitionSteps)*5)));
					console.log(Math.round(ip+((diff/transitionSteps)*5)));
				},667);
				setTimeout(function(){
					light.call('set-power',Math.round(ip+((diff/transitionSteps)*6)));
					console.log(Math.round(ip+((diff/transitionSteps)*1)));
				},833);

					
				
			}
     			
		});
	});


	


}
