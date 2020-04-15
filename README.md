# OpenScore LCS Hardware Test
This nodejs project is a simple demonstration of interfacing with LCS based hardware manufactured by OpenScore.

## What's here?
The `firmware/` directory contains a simple mock arduino sketch that can be flashed to literally any arduino hardware that sends commands to the host over the USB serial link. You can then use the main nodejs program to receive commands from it.

## License
MIT