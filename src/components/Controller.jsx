import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import LocationDisabledIcon from '@mui/icons-material/LocationDisabled';
import { IconButton } from '@mui/material';

const UP = 'i';
const LEFT = 'j';
const DOWN = ',';
const RIGHT = 'l';
const UPRIGHT = 'o';
const UPLEFT = 'u';
const DOWNLEFT = 'm';
const DOWNRIGHT = '.';

const Controller = ({
	trackable,
	connectionStatus,
	handleTrackStatus,
	trackStatus,
}) => {
	// create a ref (reference) for each button
	// ref.current is the corresponding button
	const upRef = useRef(null);
	const leftRef = useRef(null);
	const downRef = useRef(null);
	const rightRef = useRef(null);

	const [pressedKeys, setPressedKeys] = useState(new Set());

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

	return (
		<div className='border-2 w-full h-1/4 border-black flex justify-between'>
			<div className='overflow-auto h-full w-full'>
				<div>
					<table className='ml-2 mt-2'>
						<thead>
							<tr>
								<th className='p-2'>Speed</th>
								<th className='p-2'>Direction</th>
								<th className='p-2'>Tracking</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td className='p-2'>0.0</td>
								<td className='p-2'>0.0</td>
								<td className='p-2 flex justify-center'>
									{trackable ? (
										trackable
									) : (
										<>
											{!trackStatus ? (
												<IconButton
													onClick={() => {
														handleTrackStatus(true);
													}}
												>
													<LocationSearchingIcon />
												</IconButton>
											) : (
												<IconButton
													onClick={() => {
														handleTrackStatus(
															false
														);
													}}
												>
													<LocationDisabledIcon />
												</IconButton>
											)}
										</>
									)}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div className='overflow-auto'>
					{/*activity log*/}
					<h2 className='ml-4 mt-2 font-bold'>Activity Log:</h2>
					<div className='ml-4'>
						{/* <p>Dog started to walk {Math.random() * 1000000}</p>
						<p>Direction changed {Math.random() * 1000000}</p>
						<p>Other log {Math.random() * 1000000}</p>
						<p>Some other log {Math.random() * 1000000}</p>
						<p>Loglog {Math.random() * 1000000}</p>
						<p>Logologoglgogolg {Math.random() * 1000000}</p> */}
					</div>
				</div>
			</div>
			<div className='border-l-2 border-black w-1/3 h-full flex flex-col justify-center'>
				<div className='flex justify-center items-center text-xl'>
					<IconButton
						disabled={connectionStatus === 'failed'}
						ref={upRef}
						onClick={() => {
							handleRequest(UP);
						}}
					>
						<KeyboardArrowUpIcon />
					</IconButton>
				</div>
				<div className='flex justify-center items-center'>
					<IconButton
						disabled={connectionStatus === 'failed'}
						ref={leftRef}
						onClick={() => {
							handleRequest(LEFT);
						}}
					>
						<KeyboardArrowLeftIcon />
					</IconButton>
					<IconButton
						disabled={connectionStatus === 'failed'}
						ref={downRef}
						onClick={() => {
							handleRequest(DOWN);
						}}
					>
						<KeyboardArrowDownIcon />
					</IconButton>
					<IconButton
						disabled={connectionStatus === 'failed'}
						ref={rightRef}
						onClick={() => {
							handleRequest(RIGHT);
						}}
					>
						<KeyboardArrowRightIcon />
					</IconButton>
				</div>
			</div>
		</div>
	);
};

Controller.propTypes = {
	trackable: PropTypes.string,
	connectionStatus: PropTypes.string,
	handleTrackStatus: PropTypes.func.isRequired,
	trackStatus: PropTypes.bool.isRequired,
};

export default Controller;
