const util = require('util');
const winston = require('winston');
const config = require('../config');

const winstonLogger = winston.createLogger({
  level: config.logLevel,
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.colorize({all: !config.production}),
    winston.format.simple()
  ),
  exitOnError: false, // do not exit on handled exceptions
});
//workaround to support logging with ...args
const writeLogType = (logLevel) => {
  return function () {
    const args = Array.from(arguments);
    winstonLogger[logLevel](util.format(...args));
  };
};
const logger = {
  debug: writeLogType('debug'), //only for quick debug (that will be deleted)
  verbose: writeLogType('verbose'), //log process/steps/states validations
  log: writeLogType('verbose'), //shorthand for verbose, that could map console.log() method
  info: writeLogType('info'), //log important steps/configuration for production
  warn: writeLogType('warn'), //log non fatal errors/weird behaviors that should be investigated
  error: writeLogType('error') //log fatal errors that should be fixed
};

logger.info('LOG LEVEL :', config.logLevel);
//try to set the logger as a global object
if(!global['_logger']){
  global._logger = logger;
}
else{
  logger.error('_logger global variable name not available');
}

module.exports = {
  logger: logger,
  winstonLogger: winstonLogger
}