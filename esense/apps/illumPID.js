module.exports = function(server) {
	var target = 800;
	var hysteresis = Math.round(target/10);

	var transitionSteps = 2;

	var PID = require('pid-controller');
	var fs = require('fs');

	var lightQuery = server.where({ id: '4DCC31640E0' });
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
			if(helper.state!='intensity')return;
			if(ctr==undefined){
				ctr = new PID(m.data,helper.target,helper.p,helper.i,helper.d, 'direct');
								

				ctr.setMode(1);
				ctr.setOutputLimits(-1023,1023);
				ctr.initialize();
			}

			console.log("illum",m.data,"error:",Math.abs(m.data-helper.target));
			

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
				

			     			
		});
	});


	


}
