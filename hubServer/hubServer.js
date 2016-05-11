var zetta = require('../zetta2.0-runtime/zetta');
var illumThreshold = require('../esense/apps/illumThreshold');
var illumPID = require('../esense/apps/illumPID');
var location = require('../esense/apps/location');

var PORT = 1337;

var MqttScout = require('../esense/scouts/scout_mqtt');
var JablotronScout = require('../esense/scouts/scout_jablotron');
var bleScout = require('../esense/scouts/scout_ble');
var LoraScout = require('../esense/scouts/scout_lora');


zetta()
  .name('eclub-iot-hub')
  .link("http://mulder.sin.cvut.cz:1337")
  .use(MqttScout)
  .use(illumPID)
  .use(location)
  //.use(JablotronScout)
  //.use(bleScout)
  .use(LoraScout)
  .listen(PORT, function(err) {
    if(err) {
      console.error(err);
      process.exit(1);
    }
    console.log('running on http://localhost:', PORT)
  });



//removed
//.expose('*')
