module.exports = function(server) {
  var lightQuery = server.where({ type: '145' });
  
  server.observe([lightQuery], function(light){
     	    
     light.streams.illumination.on('data', function(m) {
      if(light.illumThreshold!=-1){
        if(m.data < light.illumThreshold-3) {
          if (light.available('turn-on')) {
            light.call('turn-on');
          }
        } else if(m.data > light.illumThreshold+3) {
          if (light.available('turn-off')) {
            light.call('turn-off');
          }
        } 
      }
   });
});}
