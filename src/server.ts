import * as http from 'http';
import Express from './config/express';
const port = normalizePort(process.env.PORT) || 3000;
const SocketIO = require('socket.io');

// set server's port
Express.set('port', port);

//initiate an instance of the server
const server = http.createServer(Express);
// server listen on port
server.listen(port);
server.on('listen', onListening);
server.on('error', onError);

function onListening ():void {
    let addr = server.address();
    let bind = (typeof addr === "string") ? `pipe ${addr}` : `port ${addr.port}`
    console.info(`Listening on ${bind}`);
}
//error handling
function onError (err: NodeJS.ErrnoException):void {
    if (err.syscall !== "listen") throw err;

    let bind = (typeof port === "string") ? `pipe ${port}` : `port ${port}`;

    switch (err.code) {
        case 'EACCESS':
            console.error(`You don't have access to ${bind}`);
            process.exit(1);
        //if address already in use
        case 'EADDRINUSE':
            console.error(`The address ${bind} is taken. Boohoo for you.`);
            process.exit(1);
        default:
            throw err;
    }
}

// Initialize Socket Server over the same port
const io = new SocketIO(server);

// Setup auth middleware for sockets server
io.use(async (socket, next) => {
  try {
    if (socket.handshake.query && socket.handshake.query.token) {

      next();
    } else {
      next(new Error('Authentication error'));
    }
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  // Connection is authenticated.
  // Notify the client that the connection is established.
    console.log('client connected')
  io.to(socket.id).emit('message', 'sucessfully connected to server.');
});

let app = Express;
// Save a reference of the socket instance for later use
// USE: req.app.get('socketio');
app.set('socketio', io);


/**
 * Normalize port
 * @param {*} val
 */
function normalizePort(val: number | string): number | string | boolean {
    let port: number = (typeof val === 'string') ? parseInt(val, 10) : val;
    if (isNaN(port)) return val;
    else if (port >= 0) return port;
    else return false;
}
