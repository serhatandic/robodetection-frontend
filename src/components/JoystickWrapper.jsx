/* eslint-disable react/prop-types */
import { Joystick } from 'react-joystick-component';
import SignalConverter from '../utils/signalconverter';
import { useEffect } from 'react';
import { Box } from '@mui/material';

const UP = 'i';
const LEFT = 'j';
const DOWN = ',';
const RIGHT = 'l';
const UPRIGHT = 'o';
const UPLEFT = 'u';
const DOWNLEFT = 'm';
const DOWNRIGHT = '.';

const signalConverter = new SignalConverter(100);

function JoystickWrapper({ socket, isConnected }) {
	useEffect(() => {
		const handleMove = (event) => {
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
					break;
			}
		};

		// Start streaming updates
		signalConverter.streamUpdates((state) => {
			if (state) {
				handleMove(state);
			}
		});

		const handleRequest = async (key) => {
			if (!isConnected) return;
			socket.emit('command', { key });
		};

		// Cleanup function to stop streaming and clear interval
		return () => {
			signalConverter.stopStreaming();
		};
	}, [isConnected, socket]);

	const getDirection = (x, y) => {
		if (x === null || y === null) return null;
		var angle = (Math.atan2(y, x) * 180) / Math.PI;
		if (angle > -22.5 && angle <= 22.5) return 'right';
		if (angle > 22.5 && angle <= 67.5) return 'upright';
		if (angle > 67.5 && angle <= 112.5) return 'up';
		if (angle > 112.5 && angle <= 157.5) return 'upleft';
		if (angle > -157.5 && angle <= -112.5) return 'downleft';
		if (angle > -112.5 && angle <= -67.5) return 'down';
		if (angle > -67.5 && angle <= -22.5) return 'downright';
		return 'left';
	};

	return (
		<Box className='h-full'>
			<Joystick
				size={100}
				sticky={false}
				baseColor='#000' //'#87CEFA'
				stickColor='#fff' //'#FF7F50'
				move={(update) => signalConverter.onMove(update)}
				start={(update) => signalConverter.onMove(update)}
				stop={() => signalConverter.onStop()}
			/>
		</Box>
	);
}

export default JoystickWrapper;
