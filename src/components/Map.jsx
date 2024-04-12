import useSocket from '../hooks/useSocket';
import { useEffect, useState } from 'react';
const socketUrl = import.meta.env.VITE_SOCKET_URL;

const Map = () => {
	const [streamData, setStreamData] = useState({});
	const { socket, isConnected } = useSocket(socketUrl); // Custom hook to manage socket connection

	useEffect(() => {
		if (!isConnected) return;
		socket.emit('request_map');

		const handleMapStream = (data) => {
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
