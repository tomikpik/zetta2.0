var zetta = require('../zetta2.0-runtime/zetta');

var PORT = 1337;

var MqttScout = require('../esense/scouts/scout_mqtt');
var JablotronScout = require('../esense/scouts/scout_jablotron');


zetta()
  .name('eclub-iot-hub')
  .link('http://zettor.sin.cvut.cz:1337')
  .use(MqttScout)
  .use(JablotronScout)
  .listen(PORT, function(err) {
    if(err) {
      console.error(err);
      process.exit(1);
    }
    console.log('running on http://localhost:', PORT)
  });



//removed
//.expose('*')
