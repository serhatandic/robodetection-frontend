class SignalConverter {
	signalRate = 100;
	joystickState = null;
	intervalId = null;

	constructor(rate) {
		if (rate) {
			this.signalRate = rate;
		}
	}

	onMove(joystickUpdate) {
		this.joystickState = joystickUpdate;
	}

	onStop() {
		this.joystickState = null;
	}

	streamUpdates(callback) {
		this.intervalId = setInterval(() => {
			callback(this.joystickState);
		}, this.signalRate);
	}

	stopStreaming() {
		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
	}
}

export default SignalConverter;
