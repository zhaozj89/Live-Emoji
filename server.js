// Load required modules
// var http    = require("http");              // http server core module
var https = require( "https" );              // http server core module
var express = require( "express" );           // web framework external module
var serveStatic = require( 'serve-static' );  // serve static files
var socketIo = require( "socket.io" );        // web socket external module
var easyrtc = require( "./easyrtc" );               // EasyRTC external module

var fs = require( 'fs' );

var privateKey = fs.readFileSync( 'private.pem', 'utf8' );
var certificate = fs.readFileSync( 'file.crt', 'utf8' );
var credentials = { key: privateKey, cert: certificate };

// Set process name
process.title = "node-easyrtc";

// Setup and configure Express http server. Expect a subfolder called "static" to be the web root.
var app = express();
// console.log(__dirname);
app.use( serveStatic( 'frontend' ) );
app.use( serveStatic( 'frontend', { 'index': [ '/index.html' ] } ) );

// Start Express http server on port 8080
var webServer = https.createServer( credentials, app ).listen( 8080 );

// Start Socket.io so it attaches itself to Express server
var socketServer = socketIo.listen( webServer, { "log level": 1 } );

// easyrtc.setOption( "logLevel", "debug" );

// Overriding the default easyrtcAuth listener, only so we can directly access its callback
// easyrtc.events.on( "easyrtcAuth", function ( socket, easyrtcid, msg, socketCallback, callback ) {
// 	easyrtc.events.defaultListeners.easyrtcAuth( socket, easyrtcid, msg, socketCallback, function ( err, connectionObj ) {
// 		if ( err || !msg.msgData || !msg.msgData.credential || !connectionObj ) {
// 			callback( err, connectionObj );
// 			return;
// 		}

// 		connectionObj.setField( "credential", msg.msgData.credential, { "isShared": false } );

// 		console.log( "[" + easyrtcid + "] Credential saved!", connectionObj.getFieldValueSync( "credential" ) );

// 		callback( err, connectionObj );
// 	} );
// } );

// To test, lets print the credential to the console for every room join!
// easyrtc.events.on( "roomJoin", function ( connectionObj, roomName, roomParameter, callback ) {
// 	console.log( "[" + connectionObj.getEasyrtcid() + "] Credential retrieved!", connectionObj.getFieldValueSync( "credential" ) );
// 	easyrtc.events.defaultListeners.roomJoin( connectionObj, roomName, roomParameter, callback );
// } );

// Start EasyRTC server
// var rtc = easyrtc.listen( app, socketServer, null, function ( err, rtcRef ) {
// 	console.log( "Initiated" );

// 	rtcRef.events.on( "roomCreate", function ( appObj, creatorConnectionObj, roomName, roomOptions, callback ) {
// 		console.log( "roomCreate fired! Trying to create: " + roomName );

// 		appObj.events.defaultListeners.roomCreate( appObj, creatorConnectionObj, roomName, roomOptions, callback );
// 	} );
// } );

//listen on port 8080
// webServer.listen(8080, function () {
//     console.log('listening on https://localhost:8080');
// });

// heart rate
// var five = require( "johnny-five" );

// var board = new five.Board();

// board.on( "ready", function () {

// 	board.info( 'Board', 'ready' );

// 	var sensor = new five.Sensor( {
// 		pin: "A0",
// 		freq: 10
// 	} );

// 	sensor.scale( [ 0, 100 ] ).on( "change", function () {
// 		socketServer.sockets.emit( 'pulse', this.scaled )
// 	} );

// } );