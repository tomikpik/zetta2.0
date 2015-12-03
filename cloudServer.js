var zetta = require('./zetta2.0-runtime/zetta');

var PORT = 1337;

zetta()
  .name('eclub-iot-cloud')
  .listen(PORT, function(err) {
    if(err) {
      console.error(err);
      process.exit(1);
    }
    console.log('running on http://localhost:', PORT)
  });



//removed
//.expose('*')
