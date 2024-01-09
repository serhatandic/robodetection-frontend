import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import KeyboardController from './KeyboardController';
import InfoSection from './InfoSection';
import { Joystick } from 'react-joystick-component';
import { handleStart, handleMove, handleStop } from './Joystick';


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
}) => {
	// create a ref (reference) for each button
	// ref.current is the corresponding button
	const upRef = useRef(null);
	const leftRef = useRef(null);
	const downRef = useRef(null);
	const rightRef = useRef(null);

	const [pressedKeys, setPressedKeys] = useState(new Set());
	const [inputMethod, setInputMethod] = useState('keyboard'); // Default to keyboard

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

	const handleKeyDown = (event) => {
		setPressedKeys((prev) => new Set(prev).add(event.key));
	};

	const handleKeyUp = (event) => {
		setPressedKeys((prev) => {
			const newSet = new Set(prev);
			newSet.delete(event.key);
			return newSet;
		});

		switch (event.key) {
			// remove focus from the button that corresponds to the key released
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
		} else if (pressedKeys.has('ArrowUp') && pressedKeys.has('ArrowLeft')) {
			handleRequest(UPLEFT);
		} else if (
			pressedKeys.has('ArrowDown') &&
			pressedKeys.has('ArrowLeft')
		) {
			handleRequest(DOWNLEFT);
		} else if (
			pressedKeys.has('ArrowDown') &&
			pressedKeys.has('ArrowRight')
		) {
			handleRequest(DOWNRIGHT);
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
			<div className='border-2 w-full h-2/5 border-black flex justify-between'>
				<InfoSection
					trackable={trackable}
					trackStatus={trackStatus}
					handleTrackStatus={handleTrackStatus}
				/>
				{inputMethod === 'keyboard' ? (
					<KeyboardController
						connectionStatus={connectionStatus}
						handleRequest={handleRequest}
						upRef={upRef}
						leftRef={leftRef}
						downRef={downRef}
						rightRef={rightRef}
					/>
				) : (
					<div className='border-l-2 border-black w-1/3 h-full flex flex-col justify-center items-center'>
						<Joystick
							size={150}
							sticky={false}
							baseColor='#87CEFA'
							stickColor='#FF7F50'
							start={handleStart}
							move={handleMove}
							stop={handleStop}
						/>
					</div>
				)}
			</div>
			<button
				onClick={toggleInputMethod}
				style={{
					backgroundColor: '#f0f0f0', // Soft light gray
					color: '#333', // Darker text for contrast
					border: 'none',
					borderRadius: '15px', // Rounded corners
					padding: '10px 20px', // Comfortable padding
					cursor: 'pointer',
					boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
					fontSize: '1rem', // Reasonable font size
					transition: 'all 0.3s ease', // Smooth transition for interactions
				}}
			>
				Switch to {inputMethod === 'keyboard' ? 'Joystick' : 'Keyboard'}{' '}
				(Ctrl+S)
			</button>
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
