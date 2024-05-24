import { useEffect, useState } from 'react';
import io from 'socket.io-client';

let socket;

const useSocket = (url) => {
	const [isConnected, setIsConnected] = useState(false);

	useEffect(() => {
		if (!url) return;
		// Check if the socket already exists
		if (!socket) {
			// Initialize socket connection
			socket = io(url);

			socket.on('connect', () => {
				console.log('Socket connected');
				setIsConnected(true);
			});

			socket.on('disconnect', () => {
				console.log('Socket disconnected');
				setIsConnected(false);
			});
		}

		// Clean up on component unmount
		return () => {
			console.log('unmount');
			if (socket) {
				socket.disconnect();
				socket = null;
			}
		};
	}, [url]);

	// Expose the socket instance and the connection state
	return { socket, isConnected };
};

export default useSocket;
