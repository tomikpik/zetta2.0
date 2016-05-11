

module.exports = function(server) {
  	var helperQuery = server.where({ type: '169' });
	var lightQuery = server.where({ id: '4DCC31640E0' });
  	var last = "";

	var results = new Array(); 


  	server.observe([helperQuery, lightQuery], function(helper,light){
     	    	
    		helper.streams.location.on('data', function(obj) {
   			if(helper.state!='proximity')return;
			var proximityInfo = obj.data;
			if(proximityInfo.user!="tomas.pikous@gmail.com")return;
			if(proximityInfo.ssid!="F3:8C:33:42:50:10")return;
				

			results.push(proximityInfo.level);

			var limit = 5;

			if(results.length>limit)results.shift();			
			
		});

		setInterval(function(){ 
			var sum=0;
			var count=0;
			results.forEach(function(entry) {
    				sum+=entry;
				count++;
			});
	
			console.log(results);
			var avg = Math.abs(sum/count);
			console.log("avg",avg);
			
			var input = (avg-55)/20;
			if(input<0)input=0;
			if(input>1)input=1;

			input = Math.round(1023*(1-input));
			console.log("input",input);
			light.call('set-power',input);
			
		}, 750);
	});
}
