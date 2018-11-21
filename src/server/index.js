const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');
const mime = require('mime-types');
const gpio = require('rpi-gpio');
const gpiop = gpio.promise;

http.listen(8080); //listen to port 8080

const webroot = __dirname + '/../../build';
const motor1A = 16;
const motor1B = 18;
const motor1E = 22;

const motor2A = 19;
const motor2B = 21;
const motor2E = 23;

// Setting up the pins
gpiop.setup(motor1A, gpio.DIR_OUT);
gpiop.setup(motor1B, gpio.DIR_OUT);
gpiop.setup(motor1E, gpio.DIR_OUT);
gpiop.setup(motor2A, gpio.DIR_OUT);
gpiop.setup(motor2B, gpio.DIR_OUT);
gpiop.setup(motor2E, gpio.DIR_OUT);

app.use(express.static(webroot));

io.sockets.on('connection', function (socket) {
  let direction = 'stop'; //static variable for current direction (foward, backward, stop)

  socket.on('direction', function (data) { //get light switch status from client
    direction = data;
    console.log(direction);
    if (direction === 'forward') {
      gpio.write(motor1A, true);
      gpio.write(motor1B, false);
      gpio.write(motor2A, true);
      gpio.write(motor2B, false);

      gpio.write(motor1E, true);
      gpio.write(motor2E, true);
    } else if(direction === 'backward') {
      gpio.write(motor1A, false);
      gpio.write(motor1B, true);
      gpio.write(motor2A, false);
      gpio.write(motor2B, true);

      gpio.write(motor1E, true);
      gpio.write(motor2E, true);
    } else {
      // By default we turn off the motors
      gpio.write(motor1E, false);
      gpio.write(motor2E, false);
    }
    
  });
});

process.on('SIGINT', function () { //on ctrl+c
  gpio.destroy(() => {
    console.log('All pins unexported');
    process.exit(); //exit completely
  })
});
