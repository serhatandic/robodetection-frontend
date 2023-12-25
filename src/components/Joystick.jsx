// this is the joystick component with custom handleMove, handleStop, and handleStart functions

const UP = 'i';
const LEFT = 'j';
const DOWN = ',';
const RIGHT = 'l';
const UPRIGHT = 'o';
const UPLEFT = 'u';
const DOWNLEFT = 'm';
const DOWNRIGHT = '.';

const sendRequest = async (key) => {
	await fetch('http://144.122.71.16:8080/command', {
		method: 'POST',
		body: JSON.stringify({ key: key }),
		headers: {
			'Content-Type': 'application/json',
		},
	});
};

const handleRequest = async (key) => {
	sendRequest(key);
};

// Additional function to calculate the direction based on x and y coordinates
const getDirection = (x, y) => {
	if (x === null || y === null) return null;

	var angle = (Math.atan2(y, x) * 180) / Math.PI; // Convert radians to degrees

	// if (angle < 0){
	//     angle += 360
	// }

	// console.log('angle: ', angle);

	if (angle > -22.5 && angle <= 22.5) {
		return 'right';
	} else if (angle > 22.5 && angle <= 67.5) {
		return 'upright';
	} else if (angle > 67.5 && angle <= 112.5) {
		return 'up';
	} else if (angle > 112.5 && angle <= 157.5) {
		return 'upleft';
	}
	// else if (angle > 157.5 && angle <= -157.5) { // [157.5, 202.5] -> [-202.5, -157.5]
	//     return "left";
	// }
	else if (angle > -157.5 && angle <= -112.5) {
		//  angle > 202.5 && angle <= 247.5
		return 'downleft';
	} else if (angle > -112.5 && angle <= -67.5) {
		// angle > 247.5 && angle <= 292.5
		return 'down';
	} else if (angle > -67.5 && angle <= -22.5) {
		// angle > 292.5 && angle <= -22.5
		return 'downright';
	} else {
		return 'left';
	}
};

export const handleMove = (event) => {
	const direction = getDirection(event.x, event.y);

	// console.log(event);
	// console.log('direction:', direction.toUpperCase());

	if (direction == 'up') {
		handleRequest(UP);
		// console.log('Joystick moved:', event.direction);
	} else if (direction == 'down') {
		handleRequest(DOWN);
		// console.log('Joystick moved:', event.direction);
	} else if (direction == 'right') {
		handleRequest(RIGHT);
		// console.log('Joystick moved:', event.direction);
	} else if (direction == 'left') {
		handleRequest(LEFT);
		// console.log('Joystick moved:', event.direction);
	} else if (direction == 'upright') {
		handleRequest(UPRIGHT);
		// console.log('Joystick moved:', event.direction);
	} else if (direction == 'downleft') {
		handleRequest(DOWNLEFT);
		// console.log('Joystick moved:', event.direction);
	} else if (direction == 'upleft') {
		handleRequest(UPLEFT);
		// console.log('Joystick moved:', event.direction);
	} else if (direction == 'downright') {
		handleRequest(DOWNRIGHT);
		// console.log('Joystick moved:', event.direction);
	}
};

// these handleStop and handleStart functions are not used in the current implementation
export const handleStop = (event) => {
	console.log('Joystick stopped:', event);
};

export const handleStart = (event) => {
	console.log('Joystick started:', event);
};
