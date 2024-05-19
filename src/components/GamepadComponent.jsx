import { useState, useEffect } from 'react';

const GamepadComponent = () => {
	const [gamepad, setGamepad] = useState(null);
	const [leftStick, setLeftStick] = useState(null); // 8 directions, up down left right, up-left, up-right, down-left, down-right
	const [rightStick, setRightStick] = useState(null); // 8 directions, up down left right, up-left, up-right, down-left, down-right
	
	useEffect(() => {
		const gamepadHandler = () => {
			setGamepad(navigator.getGamepads()[0]);
		};

		window.addEventListener('gamepadconnected', gamepadHandler);
		window.addEventListener('gamepaddisconnected', gamepadHandler);

		const interval = setInterval(() => {
			const gamepad = navigator.getGamepads()[0];
			if (!gamepad) {
				return;
			}

			const axes = gamepad.axes.map((axis) => axis.toFixed(2));
			setLeftStick(classifyStick(axes[0], axes[1]));
			setRightStick(classifyStick(axes[2], axes[3]));
		}, 100);

		return () => {
			window.removeEventListener('gamepadconnected', gamepadHandler);
			window.removeEventListener('gamepaddisconnected', gamepadHandler);
			clearInterval(interval);
		};
	}, []);

	useEffect(() => {
		console.log('Left stick:', leftStick);
	}, [leftStick]);

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

	if (!gamepad) {
		return <div>No gamepad connected</div>;
	}

	return <div></div>;
};

export default GamepadComponent;
