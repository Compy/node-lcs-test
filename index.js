/**
 * LCS test software for node JS or electron based systems.
 * This uses the node serialport package to communicate with the LCS hardware on the backend
 * 
 * Jimmy Lipham <hello@86pixels.com>
 */
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

/**
 * This function searches all available serial ports on the PC to find hardware with our specific
 * version tags. Once found, it returns the path (COMX on Windows/or a /dev path on OSX/*nix)
 * If no hardware is found, the function returns false
 */
async function findScoringHardware() {
  const ports = await SerialPort.list()
  for (const port of ports) {
    if (port.vendorId == '1a86' && port.productId == '7523') {
      return port.path
    }
  }
  return false
}

/**
 * The 'main' routine here if you will. Finds the scoring hardware, then connects to it and starts
 * parsing data
 */
findScoringHardware()
  .then((port) => {
    if (!port) {
      console.error('No LCS hardware found')
    } else {
      console.log('Found LCS hardware at', port)
      /* Connect to our LCS hardware at a specific baud rate */
      const serial = new SerialPort(port, { baudRate: 115200 })
      /* Set up a delimiter parser so that any time we get a new line feed, the data gets piped to our function */
      const parser = serial.pipe(new Readline({ delimiter: '\r\n' }))
      parser.on('data', (data) => {
        /* LCS data commands are split by pipe. For the most part we only care about the first segment */
        commands = data.split('|')
        /* Heartbeat commands come about every second. Most implementations can ignore them unless you want to alert
         * the user that their hardware is disconnected
         */
        if (commands[0] == 'HEARTBEAT') {
          console.log('Got heartbeat from LCS hardware')
        }
        /* The score command is the meat and potatoes. It is sent by the hardware any time the beam gets interrupted
         * and can only be sent after the beam closes again. There is also a 1 second hardware debounce here to prevent
         * a flood of messages to the host
         */
        else if (commands[0] == 'SCORE') {
          console.log('Beam interrupted. Doing scoring routine')
        }
      })
    }
  })
