import useSocket from '../hooks/useSocket';
import { useEffect, useState } from 'react';
const socketUrl = import.meta.env.VITE_SOCKET_URL;

const Map = () => {
	const [streamData, setStreamData] = useState({});
	const { socket, isConnected } = useSocket(socketUrl); // Custom hook to manage socket connection

	useEffect(() => {
		if (!isConnected) return;
		// request the initial map

		const handleMapStream = (data) => {
			console.log('map requested');
			setStreamData({
				imageUrl: `data:image/jpeg;base64,${data.image
					.split(';base64,')
					.pop()}`,
			});
		};

		const interval = setInterval(() => {
			socket.emit('request_map');
		}, 1000);

		socket.on('map_stream', handleMapStream);
		return () => {
			socket.off('map_stream', handleMapStream);
			clearInterval(interval);
		};
	}, [socket, isConnected]);
	return (
		<div className='w-full h-full overflow-hidden'>
			<img
				className='w-full h-full object-cover'
				src={streamData.imageUrl}
			/>
		</div>
	);
};

export default Map;
