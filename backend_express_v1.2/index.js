require('dotenv').config();
const app = require('./app');
require('./database');
const logger = require('./src/utils/logger');

async function main() {
    await app.listen(app.get('port'), () => {
                logger.info('Servidor en el puerto ' + app.get('port'))
              }).on('error', function (e) {
                logger.error(e)
              });
}

main();