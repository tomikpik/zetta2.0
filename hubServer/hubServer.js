//load zetta
var zetta = require('../zetta2.0-runtime/zetta');
//load zetta apps
var illumThreshold = require('../esense/apps/illumThreshold');
var illumPID = require('../esense/apps/illumPID');
var location = require('../esense/apps/location');

//zetta port
var PORT = 1337;

//MQTT scout (network)
var MqttScout = require('../esense/scouts/scout_mqtt');
//Jablotron scout (usb dongle)
var JablotronScout = require('../esense/scouts/scout_jablotron');
//BLE scout (built-in bluetooth LE)
var bleScout = require('../esense/scouts/scout_ble');
//LoRa scout (usb dongle)
var LoraScout = require('../esense/scouts/scout_lora');

//start zetta
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

