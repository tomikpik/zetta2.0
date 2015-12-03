var zetta = require('../zetta2.0-runtime/zetta');

var PORT = 1337;

var templateScout = require('../esense/scouts/scout_template');


zetta()
  .name('eclub-iot-hub')
  .link('http://zettor.sin.cvut.cz:1337')
  .use(templateScout)
  .listen(PORT, function(err) {
    if(err) {
      console.error(err);
      process.exit(1);
    }
    console.log('running on http://localhost:', PORT)
  });



//removed
//.expose('*')
