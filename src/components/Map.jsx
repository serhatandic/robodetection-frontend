import useSocket from '../hooks/useSocket';
import { useEffect, useState } from 'react';
const socketUrl = import.meta.env.VITE_SOCKET_URL;

const Map = () => {
	const [streamData, setStreamData] = useState({});
	const { socket, isConnected } = useSocket(socketUrl); // Custom hook to manage socket connection

	useEffect(() => {
		if (!isConnected) return;
		// request the initial map
		socket.emit('request_map');
	}, [socket, isConnected]);

	useEffect(() => {
		if (!isConnected) return;

		const handleMapStream = (data) => {
			socket.emit('request_map');
			setStreamData({
				imageUrl: `data:image/jpeg;base64,${data.image
					.split(';base64,')
					.pop()}`,
			});
		};

		socket.on('map_stream', handleMapStream);
		return () => {
			socket.off('map_stream', handleMapStream);
		};
	}, [socket, isConnected, streamData]);
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
