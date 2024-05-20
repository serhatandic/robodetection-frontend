import { useState, useEffect } from 'react';

const useGamepad = () => {
	const [leftStick, setLeftStick] = useState(null); // 8 directions, up down left right, up-left, up-right, down-left, down-right
	const [rightStick, setRightStick] = useState(null); // 8 directions, up down left right, up-left, up-right, down-left, down-right
	const [pad, setPad] = useState(null); // 4 directions, up (12), down (13), left (14) right (15)
	const [button, setButton] = useState(null); // x, a, b, y (0, 1, 2, 3)
	useEffect(() => {
		const interval = setInterval(() => {
			const gamepad = navigator.getGamepads()[0];
			if (!gamepad) {
				return;
			}

			const axes = gamepad.axes.map((axis) => axis.toFixed(2));
			setLeftStick(classifyStick(axes[0], axes[1]));
			setRightStick(classifyStick(axes[2], axes[3]));

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

	const classifyStick = (x, y) => {
		const threshold = 0.5;
		if (Math.abs(x) < threshold && Math.abs(y) < threshold) {
			return 'center';
		} else if (Math.abs(x) < threshold && y > threshold) {
			return 'down';
		} else if (Math.abs(x) < threshold && y < -threshold) {
			return 'up';
		} else if (x > threshold && Math.abs(y) < threshold) {
			return 'right';
		} else if (x < -threshold && Math.abs(y) < threshold) {
			return 'left';
		} else if (x > threshold && y > threshold) {
			return 'down-right';
		} else if (x > threshold && y < -threshold) {
			return 'up-right';
		} else if (x < -threshold && y > threshold) {
			return 'down-left';
		} else if (x < -threshold && y < -threshold) {
			return 'up-left';
		} else {
			return 'center';
		}
	};

	return { button, pad, leftStick, rightStick };
};

export default useGamepad;
