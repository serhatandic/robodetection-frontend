import { useEffect, useRef } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { IconButton } from '@mui/material';

const Controller = () => {
	// create a ref (reference) for each button
	const upRef = useRef(null);
	const leftRef = useRef(null);
	const downRef = useRef(null);
	const rightRef = useRef(null);

	// ref.current is the corresponding button

	const handleKeyDown = (event) => {
		// handles key presses
		switch (event.key) {
			// focus on the button that corresponds to the key pressed
			case 'ArrowUp':
				upRef.current?.focus();
				break;
			case 'ArrowLeft':
				leftRef.current?.focus();
				break;
			case 'ArrowDown':
				downRef.current?.focus();
				break;
			case 'ArrowRight':
				rightRef.current?.focus();
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
	return (
		<div className='border-2 w-full h-1/2 border-black flex flex-col justify-center'>
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
	);
};

export default Controller;
