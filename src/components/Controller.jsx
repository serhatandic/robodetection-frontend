import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { IconButton } from '@mui/material';

const Controller = ({ trackable }) => {
	// create a ref (reference) for each button
	// ref.current is the corresponding button
	const upRef = useRef(null);
	const leftRef = useRef(null);
	const downRef = useRef(null);
	const rightRef = useRef(null);

	const [currentPressedButton, setCurrentPressedButton] = useState(null);

	const sendRequest = async (key) => {
		const resp = await fetch('https://144.122.71.16:8080/command', {
			method:'POST',
			body: JSON.stringify({'key':key}), 
			headers: {
				"Content-Type": "application/json",
			},
		})
		console.log(await resp.json())
	}

	const handleRequest = async (key) => {
		setTimeout(() => {
			for (let i = 0; i < 3; i++){
				sendRequest(key)
			}
		}, 100);
	}
	
	const handleKeyDown = (event) => {
		// handles key presses
		switch (event.key) {
			// focus on the button that corresponds to the key pressed
			case 'ArrowUp':
				handleRequest('i')
				upRef.current?.focus();
				setCurrentPressedButton('ArrowUp');
				break;
			case 'ArrowLeft':
				handleRequest('j')
				leftRef.current?.focus();
				setCurrentPressedButton('ArrowLeft');
				break;
			case 'ArrowDown':
				handleRequest('m')
				downRef.current?.focus();
				setCurrentPressedButton('ArrowDown');
				break;
			case 'ArrowRight':
				handleRequest('l')
				rightRef.current?.focus();
				setCurrentPressedButton('ArrowRight');
				break;
			default:
				break;
		}
	};

	const handleKeyUp = (e) => {
		// handles key releases
		switch (e.key) {
			// remove focus from the button that corresponds to the key released
			case 'ArrowUp':
				upRef.current?.blur();
				setCurrentPressedButton(null);
				break;
			case 'ArrowLeft':
				leftRef.current?.blur();
				setCurrentPressedButton(null);
				break;
			case 'ArrowDown':
				downRef.current?.blur();
				setCurrentPressedButton(null);
				break;
			case 'ArrowRight':
				rightRef.current?.blur();
				setCurrentPressedButton(null);
				break;
			default:
				break;
		}
	};

	useEffect(() => {
		// everything in this effect will fire when component mounts, only once.

		window.addEventListener('keydown', handleKeyDown); // fire handlekeydown when key is pressed
		window.addEventListener('keyup', handleKeyUp); // fire handlekeyup when key is released

		// when component unmounts this anonymous function will fire
		return () => {
			// handlekeydown will be removed from the event listener
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	useEffect(() => {
		// everything in this effect will fire when currentPressedButton changes

		// if currentPressedButton is null, then no button is pressed
		if (currentPressedButton === null) {
			return;
		}

		// if currentPressedButton is not null, then a button is pressed
		// TODO: pressed key will be send to the server here
		console.log(currentPressedButton);
	}, [currentPressedButton]);

		console.log(currentPressedButton)
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
								<td className='p-2'>{trackable}</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div className='overflow-auto'>
					{/*activity log*/}
					<h2 className='ml-4 mt-2 font-bold'>Activity Log:</h2>
					<div className='ml-4'>
						<p>Dog started to walk {Math.random() * 1000000}</p>
						<p>Direction changed {Math.random() * 1000000}</p>
						<p>Other log {Math.random() * 1000000}</p>
						<p>Some other log {Math.random() * 1000000}</p>
						<p>Loglog {Math.random() * 1000000}</p>
						<p>Logologoglgogolg {Math.random() * 1000000}</p>
					</div>
				</div>
			</div>
			<div className='border-l-2 border-black w-1/3 h-full flex flex-col justify-center'>
				<div className='flex justify-center items-center text-xl'>
					<IconButton ref={upRef}>
						<KeyboardArrowUpIcon />
					</IconButton>
				</div>
				<div className='flex justify-center items-center'>
					<IconButton ref={leftRef}>
						<KeyboardArrowLeftIcon />
					</IconButton>
					<IconButton ref={downRef}>
						<KeyboardArrowDownIcon />
					</IconButton>
					<IconButton ref={rightRef}>
						<KeyboardArrowRightIcon />
					</IconButton>
				</div>
			</div>
		</div>
	);
};

Controller.propTypes = {
	trackable: PropTypes.string,
};

export default Controller;
