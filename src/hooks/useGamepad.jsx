import { useState, useEffect } from 'react';

const useGamepad = () => {
	const [leftStick, setLeftStick] = useState({
		angle: null,
		xVelocity: 0,
		yVelocity: 0,
		magnitude: 0,
	});
	const [rightStick, setRightStick] = useState({
		angle: null,
		xVelocity: 0,
		yVelocity: 0,
		magnitude: 0,
	});
	const [pad, setPad] = useState(null); // 4 directions, up (12), down (13), left (14) right (15)
	const [button, setButton] = useState(null); // x, a, b, y (0, 1, 2, 3)

	useEffect(() => {
		const interval = setInterval(() => {
			const gamepad = navigator.getGamepads()[0];
			if (!gamepad) {
				return;
			}

			const axes = gamepad.axes.map((axis) =>
				parseFloat(axis.toFixed(2))
			);
			setLeftStick(calculateStickVelocities(axes[0], axes[1]));
			setRightStick(calculateStickVelocities(axes[2], axes[3]));

			if (gamepad.buttons[12].pressed) {
				setPad('up');
			} else if (gamepad.buttons[13].pressed) {
				setPad('down');
			} else if (gamepad.buttons[14].pressed) {
				setPad('left');
			} else if (gamepad.buttons[15].pressed) {
				setPad('right');
			}

			// reset pad if not pressed
			if (
				!gamepad.buttons[12].pressed &&
				!gamepad.buttons[13].pressed &&
				!gamepad.buttons[14].pressed &&
				!gamepad.buttons[15].pressed
			) {
				setPad(null);
			}

			if (gamepad.buttons[0].pressed) {
				setButton('a');
			} else if (gamepad.buttons[1].pressed) {
				setButton('b');
			} else if (gamepad.buttons[2].pressed) {
				setButton('x');
			} else if (gamepad.buttons[3].pressed) {
				setButton('y');
			}

			// reset button if not pressed
			if (
				!gamepad.buttons[0].pressed &&
				!gamepad.buttons[1].pressed &&
				!gamepad.buttons[2].pressed &&
				!gamepad.buttons[3].pressed
			) {
				setButton(null);
			}
		}, 100);

		return () => {
			clearInterval(interval);
		};
	}, []);

	const calculateStickVelocities = (x, y) => {
		const magnitude = Math.sqrt(x * x + y * y);
		const angle = Math.atan2(y, x) * (180 / Math.PI); // Convert to degrees
		const xVelocity = magnitude * Math.sin(angle * (Math.PI / 180));
		const yVelocity = magnitude * Math.cos(angle * (Math.PI / 180));
		// drop the fractions for each
		return {
			angle: parseFloat(angle).toFixed(1),
			xVelocity: -1 * parseFloat(xVelocity).toFixed(1),
			yVelocity: -1 * parseFloat(yVelocity).toFixed(1),
			magnitude: parseFloat(magnitude).toFixed(1),
		};
	};

	return { button, pad, leftStick, rightStick };
};

export default useGamepad;
