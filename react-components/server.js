process.env.REACT_PUBLIC_URL = "/react-cmp/production";

const morgan = require('morgan');
const express = require('express');
const PORT = "3000";
const app = express();

//Template engine
app.set('view engine', 'pug');

//add http logging
app.use(morgan('dev'));

//Routing for public static files
app.use(express.static(__dirname + '/public'));

//declare public routes
app.get('/', function(req, res, next) {
  res.render('index');
});

//404 (no route has been found)
app.use((req, res, next) => {
 res.status(404).send('404 error');
});

//Routing Error handler
app.use((err, req, res, next) => {
  res.status(500).send('500 error');
});

//handle server events
const serverListeningHandler = () => {
  console.log(`Express server listening on port ${server.address().port}`);
}
const serverErrorHandler = (e) => {
  console.log("Express server failed", e);
}

//create the server and listen to traffic
const server = app.listen(PORT, serverListeningHandler).on('error', serverErrorHandler);