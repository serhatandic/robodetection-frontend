/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';
import KeyboardController from './KeyboardController';
import InfoSection from './InfoSection';
import Button from '@mui/material/Button';
import JoystickWrapper from './JoystickWrapper';
import Box from '@mui/material/Box';
import useGamepad from '../hooks/useGamepad';

const UP = 'i';
const LEFT = 'j';
const DOWN = ',';
const RIGHT = 'l';
const UPRIGHT = 'o';
const UPLEFT = 'u';
const DOWNLEFT = 'm';
const DOWNRIGHT = '.';

const ControllerSection = ({
	trackable,
	connectionStatus,
	trackStatus,
	handleTrackStatus,
	currentlyTrackingId,
	setCurrentlyTrackingId,
	socket,
	isConnected,
}) => {
	// create a ref (reference) for each button
	// ref.current is the corresponding button
	const { leftStick, rightStick } = useGamepad();
	const leftStickRef = useRef(leftStick);
	const rightStickRef = useRef(rightStick);

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
		leftStickRef.current = leftStick;
	}, [leftStick]);

	useEffect(() => {
		rightStickRef.current = rightStick;
	}, [rightStick]);

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

	useEffect(() => {
		if (
			Math.abs(leftStickRef.current.xVelocity) > 0.1 ||
			Math.abs(leftStickRef.current.yVelocity) > 0.1
		) {
			socket.emit('command360-left', leftStickRef.current);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [leftStickRef.current]);

	useEffect(() => {
		console.log(rightStickRef.current);
		if (Math.abs(parseInt(rightStickRef.current.angle)) > 0) {
			socket.emit('command360-right', rightStickRef.current);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [rightStickRef.current]);

	return (
		<div className='w-full h-1/3 flex justify-between gap-4 flex-col md:flex-row'>
			<InfoSection
				socket={socket}
				isConnected={isConnected}
				trackable={trackable}
				trackStatus={trackStatus}
				handleTrackStatus={handleTrackStatus}
				currentlyTrackingId={currentlyTrackingId}
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
							Joystick
						</Button>
					</div>
				) : (
					<div className='w-full flex flex-col items-center md:h-2/3 justify-between h-full gap-4 '>
						<JoystickWrapper
							socket={socket}
							isConnected={isConnected}
						/>
						<Button
							className='w-full'
							variant='contained'
							onClick={toggleInputMethod}
						>
							Keyboard
						</Button>
					</div>
				)}
				<Box className='flex flex-col gap-2 w-full h-full justify-end '>
					<Button
						variant='contained'
						color='secondary'
						onClick={() => {
							socket.emit('cancel_goals');
							setCurrentlyTrackingId(null);
						}}
					>
						Cancel Goals
					</Button>
					<Button
						variant='contained'
						color='secondary'
						className='whitespace-nowrap'
						onClick={() => {
							setCurrentlyTrackingId(null);
							socket.emit('return_to_base');
						}}
					>
						Return to Base
					</Button>
				</Box>
			</Box>
		</div>
	);
};

export default ControllerSection;
