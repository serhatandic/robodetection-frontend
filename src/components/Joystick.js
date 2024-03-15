// this is the joystick component with custom handleMove, handleStop, and handleStart functions

const UP = 'i';
const LEFT = 'j';
const DOWN = ',';
const RIGHT = 'l';
const UPRIGHT = 'o';
const UPLEFT = 'u';
const DOWNLEFT = 'm';
const DOWNRIGHT = '.';

const socketUrl = import.meta.env.VITE_SOCKET_URL;

const intervals = {}; // Object to store intervals for each direction

const sendRequest = async (key) => {
	await fetch(`${socketUrl}command`, {
		method: 'POST',
		body: JSON.stringify({ key: key }),
		headers: {
			'Content-Type': 'application/json',
		},
	});
};

const handleRequest = async (key) => {
	if (intervals[key]) return; // Prevent multiple intervals for the same key
	intervals[key] = setInterval(() => {
		for (let i = 0; i < 3; i++) {
			sendRequest(key);
		}
	}, 1000); // Send request every second
};

const clearIntervals = () => {
	Object.values(intervals).forEach(clearInterval); // Clear all intervals
	for (let key in intervals) delete intervals[key]; // Reset the intervals object
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

	switch (direction) {
		case 'up':
			handleRequest(UP);
			break;
		case 'down':
			handleRequest(DOWN);
			break;
		case 'right':
			handleRequest(RIGHT);
			break;
		case 'left':
			handleRequest(LEFT);
			break;
		case 'upright':
			handleRequest(UPRIGHT);
			break;
		case 'downleft':
			handleRequest(DOWNLEFT);
			break;
		case 'upleft':
			handleRequest(UPLEFT);
			break;
		case 'downright':
			handleRequest(DOWNRIGHT);
			break;
		default:
			clearIntervals(); // If direction is not recognized, stop all requests
			break;
	}
};

// these handleStop and handleStart functions are not used in the current implementation
export const handleStop = (event) => {
	console.log('Joystick stopped:', event);
	clearIntervals(); // Clear intervals to stop sending requests
};

export const handleStart = (event) => {
	console.log('Joystick started:', event);
};
