

module.exports = function(server) {
  var helperQuery = server.where({ type: '146' });
  var last = "";
  server.observe([helperQuery], function(helper){
     	    
     helper.streams.location.on('data', function(obj) {
	var rssi = -200;
	var kkey = "";
	var m = obj.data;
	Object.keys(m).forEach(function(key){
		if(m[key]>rssi){
			rssi=m[key];
			kkey=key;
		}
	});
   	
	console.log(rssi,kkey);

	if(kkey!=last){

		var lightQuery = server.where({ type: '145' })
		server.observe([lightQuery], function(light){
			console.log("light",light.id);	
			if(light.id==kkey){
				if(light.available('turn-on')){
					light.call('turn-on');
				}
			} else {
				if(light.available('turn-off')){
					light.call('turn-off');
				}
			}
		});
		last=kkey;
	}
   });
});}
