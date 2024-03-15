import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import KeyboardController from './KeyboardController';
import InfoSection from './InfoSection';
import { Joystick } from 'react-joystick-component';
import { handleStart, handleMove, handleStop } from './Joystick';
import Button from '@mui/material/Button';
import useSocket from '../hooks/useSocket';

const UP = 'i';
const LEFT = 'j';
const DOWN = ',';
const RIGHT = 'l';
const UPRIGHT = 'o';
const UPLEFT = 'u';
const DOWNLEFT = 'm';
const DOWNRIGHT = '.';

const socketUrl = import.meta.env.VITE_SOCKET_URL;

const ControllerSection = ({
	trackable,
	connectionStatus,
	trackStatus,
	handleTrackStatus,
}) => {
	// create a ref (reference) for each button
	// ref.current is the corresponding button
	const upRef = useRef(null);
	const leftRef = useRef(null);
	const downRef = useRef(null);
	const rightRef = useRef(null);
	const upRightRef = useRef(null);
	const upLeftRef = useRef(null);
	const downLeftRef = useRef(null);
	const downRightRef = useRef(null);

	const [pressedKeys, setPressedKeys] = useState(new Set());
	const [inputMethod, setInputMethod] = useState('keyboard'); // Default to keyboard
	const keyIntervals = useRef({});

	const { socket, isConnected } = useSocket(socketUrl); // Custom hook to manage socket connection

	const sendRequest = async (key) => {
		// await fetch(`http://${backendIP}:${backendPort}/command`, {
		// 	method: 'POST',
		// 	body: JSON.stringify({ key: key }),
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 	},
		// });

		if (!isConnected) return;

		socket.emit('command', { key });
	};

	const handleRequest = async (key) => {
		sendRequest(key);
	};

	const handleKeyDown = (event) => {
		// Avoid creating a new interval if the key is already being processed
		if (keyIntervals.current[event.key]) return;

		// Call setPressedKeys immediately for the first time
		setPressedKeys((prev) => new Set(prev).add(event.key));

		// Then, use setInterval to keep calling setPressedKeys every second
		keyIntervals.current[event.key] = setInterval(() => {
			setPressedKeys((prev) => new Set(prev).add(event.key));
		}, 500);
	};

	const handleKeyUp = (event) => {
		// Clear the interval for the released key
		if (keyIntervals.current[event.key]) {
			clearInterval(keyIntervals.current[event.key]);
			delete keyIntervals.current[event.key]; // Clean up
		}

		// Proceed with your existing logic for removing the key from pressedKeys
		setPressedKeys((prev) => {
			const newSet = new Set(prev);
			newSet.delete(event.key);
			return newSet;
		});

		// Your switch statement for handling focus
		switch (event.key) {
			case 'ArrowUp':
				upRef.current?.blur();
				break;
			case 'ArrowLeft':
				leftRef.current?.blur();
				break;
			case 'ArrowDown':
				downRef.current?.blur();
				break;
			case 'ArrowRight':
				rightRef.current?.blur();
				break;
			default:
				break;
		}
	};

	const checkCombinations = () => {
		// Handle UPRIGHT
		if (pressedKeys.has('ArrowUp') && pressedKeys.has('ArrowRight')) {
			handleRequest(UPRIGHT);
			upRightRef.current?.focus();
		} else if (pressedKeys.has('ArrowUp') && pressedKeys.has('ArrowLeft')) {
			handleRequest(UPLEFT);
			upLeftRef.current?.focus();
		} else if (
			pressedKeys.has('ArrowDown') &&
			pressedKeys.has('ArrowLeft')
		) {
			handleRequest(DOWNLEFT);
			downLeftRef.current?.focus();
		} else if (
			pressedKeys.has('ArrowDown') &&
			pressedKeys.has('ArrowRight')
		) {
			handleRequest(DOWNRIGHT);
			downRightRef.current?.focus();
		} else if (pressedKeys.has('ArrowUp')) {
			handleRequest(UP);
			upRef.current?.focus();
		} else if (pressedKeys.has('ArrowDown')) {
			handleRequest(DOWN);
			downRef.current?.focus();
		} else if (pressedKeys.has('ArrowLeft')) {
			handleRequest(LEFT);
			leftRef.current?.focus();
		} else if (pressedKeys.has('ArrowRight')) {
			handleRequest(RIGHT);
			rightRef.current?.focus();
		}
	};

	const toggleInputMethod = () => {
		setInputMethod((current) =>
			current === 'keyboard' ? 'joystick' : 'keyboard'
		);
	};

	useEffect(() => {
		checkCombinations();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pressedKeys]);

	useEffect(() => {
		// everything in this effect will fire when component mounts, only once.

		window.addEventListener('keydown', handleKeyDown); // fire handlekeydown when key is pressed
		window.addEventListener('keyup', handleKeyUp); // fire handlekeyup when key is released

		// when component unmounts this anonymous function will fire
		return () => {
			// handlekeydown will be removed from the event listener
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
			Object.values(keyIntervals.current).forEach(clearInterval);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.ctrlKey && event.key === 's') {
				event.preventDefault(); // Prevents the default action of Ctrl + S
				toggleInputMethod();
			}
		};

		// Cleanup the event listener when the component unmounts
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, []); //single run

	return (
		<>
			<div className='flex gap-2 mb-2'>
				<div className=' bg-gray-100 flex items-center p-2 rounded-lg w-fit'>
					Speed:
				</div>
				<div className=' bg-gray-100 flex items-center p-2 rounded-lg w-fit'>
					Direction:
				</div>
				<div className=' bg-gray-100 flex items-center p-2 rounded-lg w-fit'>
					Currently Tracking:
				</div>
			</div>
			<div className='w-full h-1/5  flex justify-between'>
				<InfoSection
					trackable={trackable}
					trackStatus={trackStatus}
					handleTrackStatus={handleTrackStatus}
				/>
				{inputMethod === 'keyboard' ? (
					<div className='w-1/3 flex flex-col justify-between items-center ml-2'>
						<KeyboardController
							connectionStatus={connectionStatus}
							handleRequest={handleRequest}
							upRef={upRef}
							leftRef={leftRef}
							downRef={downRef}
							rightRef={rightRef}
							upRightRef={upRightRef}
							upLeftRef={upLeftRef}
							downLeftRef={downLeftRef}
							downRightRef={downRightRef}
						/>
						<Button
							className='w-full'
							variant='contained'
							onClick={toggleInputMethod}
						>
							Switch to Joystick
						</Button>
					</div>
				) : (
					<div className='w-1/3 h-full flex flex-col justify-between items-center ml-2'>
						<Joystick
							size={150}
							sticky={false}
							baseColor='#87CEFA'
							stickColor='#FF7F50'
							start={handleStart}
							move={handleMove}
							stop={handleStop}
						/>
						<Button
							className='w-full'
							variant='contained'
							onClick={toggleInputMethod}
						>
							Switch to Keyboard
						</Button>
					</div>
				)}
			</div>
		</>
	);
};

ControllerSection.propTypes = {
	trackable: PropTypes.string,
	connectionStatus: PropTypes.string,
	trackStatus: PropTypes.bool,
	handleTrackStatus: PropTypes.func,
};

export default ControllerSection;
