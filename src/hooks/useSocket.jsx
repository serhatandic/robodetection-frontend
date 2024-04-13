import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

const useSocket = (url) => {
	const [isConnected, setIsConnected] = useState(false);
	const socketRef = useRef(null);

	useEffect(() => {
		// Initialize socket connection
		socketRef.current = io(url);

		const socket = socketRef.current;

		socket.on('connect', () => {
			console.log('Socket connected');
			setIsConnected(true);
		});

		socket.on('disconnect', () => {
			console.log('Socket disconnected');
			setIsConnected(false);
		});

		// Cleanup on component unmount
		return () => {
			socket.disconnect();
		};
	}, [url]); // Re-run the effect only if the URL changes

	// Expose the socket instance and the connection state
	return { socket: socketRef.current, isConnected };
};

export default useSocket;
