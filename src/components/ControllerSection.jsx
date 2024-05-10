/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';
import KeyboardController from './KeyboardController';
import InfoSection from './InfoSection';
import Button from '@mui/material/Button';
import useSocket from '../hooks/useSocket';
import JoystickWrapper from './JoystickWrapper';
import Box from '@mui/material/Box';

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
	currentlyTrackingId,
	setShouldClearTrackables,
	setShouldClearActivityLog,
	shouldClearActivityLog,
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
			// eslint-disable-next-line react-hooks/exhaustive-deps
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
			<div className='w-full h-full flex justify-between gap-4 flex-col md:flex-row'>
				<InfoSection
					trackable={trackable}
					trackStatus={trackStatus}
					handleTrackStatus={handleTrackStatus}
					currentlyTrackingId={currentlyTrackingId}
					shouldClearActivityLog={shouldClearActivityLog}
					setShouldClearActivityLog={setShouldClearActivityLog}
				/>
				<Box className='w-full md:w-1/3 flex md:flex-col items-center justify-between h-full flex-row gap-4'>
					{inputMethod === 'keyboard' ? (
						<div className='w-full flex flex-col items-center md:h-2/3 justify-between'>
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
						<div className='w-full flex flex-col items-center md:h-2/3 justify-between h-full gap-4 '>
							<JoystickWrapper />
							<Button
								className='w-full'
								variant='contained'
								onClick={toggleInputMethod}
							>
								Switch to Keyboard
							</Button>
						</div>
					)}
					<Box className='flex flex-col gap-2 w-full h-full justify-end md:'>
						<Button
							onClick={() => {
								setShouldClearTrackables(true);
							}}
							variant='contained'
						>
							Clear Track List
						</Button>
						<Button
							onClick={() => {
								setShouldClearActivityLog(true);
							}}
							variant='contained'
						>
							Clear Activity Log
						</Button>
						<Button variant='contained' color='secondary'>
							Return to Base
						</Button>
					</Box>
				</Box>
			</div>
		</>
	);
};

export default ControllerSection;
