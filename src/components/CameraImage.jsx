import { useEffect, useState, useRef } from 'react';
import useSocket from '../hooks/useSocket';

const socketUrl = import.meta.env.VITE_SOCKET_URL;

const CameraImage = () => {
	const [fps, setFps] = useState(0);
	const [ping, setPing] = useState(0);
	const [health, setHealth] = useState(''); // green, yellow, red
	const [hoveredRectIndex, setHoveredRectIndex] = useState(null); // New state to track hovered rectangle
	const [selectedId, setSelectedId] = useState(null);
	const [streamData, setStreamData] = useState({
		imageUrl: null,
		rectangles: [
			{
				id: 1,
				x2: 200,
				x1: 100,
				y2: 200,
				y1: 100,
			},
			{
				id: 2,
				x2: 400,
				x1: 300,
				y2: 300,
				y1: 200,
			},
		],
		image_size: [640, 480], // width, height
	});
	const canvasRef = useRef(null);
	const { socket, isConnected } = useSocket(socketUrl); // Custom hook to manage socket connection
	const lastFrameTime = useRef(Date.now());

	useEffect(() => {
		if (!isConnected) return;
		socket.emit('request_stream');

		const handleImageStream = (data) => {
			const now = Date.now();
			const deltaTime = now - lastFrameTime.current;
			if (deltaTime < 80) {
				setHealth('green');
			} else if (deltaTime < 150) {
				setHealth('yellow');
			} else {
				setHealth('red');
			}
			setPing(deltaTime);
			// avoid division by zero with 1 microsecond
			const timeEpsilon = 0.000001;
			const fps = 1000 / (deltaTime + timeEpsilon); // Milliseconds to seconds conversion for FPS
			setFps(Math.round(fps)); // Update FPS state rounded to nearest whole number
			lastFrameTime.current = now; // Update the last frame time

			setStreamData({
				rectangles: Object.keys(data.coordinates).map((id) => ({
					id,
					x1: data.coordinates[id][0],
					y1: data.coordinates[id][1],
					x2: data.coordinates[id][2],
					y2: data.coordinates[id][3],
				})),

				imageUrl: `data:image/jpeg;base64,${data.image
					.split(';base64,')
					.pop()}`,
				image_size: data.image_size,
			});

			const boundingRect = data.coordinates[selectedId];
			const centerOfTheImage = data.image_size.map((size) => size / 2);
			socket.emit('follow', {
				bounding_box: boundingRect ?? [],
				center: centerOfTheImage,
				isReleased: selectedId === null,
			});
		};

		socket.on('image_stream', handleImageStream);

		return () => {
			socket.off('image_stream', handleImageStream);
		};
	}, [socket, isConnected, streamData, selectedId]);

	useEffect(() => {
		const canvas = canvasRef.current;
		const context = canvas.getContext('2d');

		context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

		streamData.rectangles.forEach((rect) => {
			context.beginPath();
			const width = rect.x2 - rect.x1;
			const height = rect.y2 - rect.y1;
			context.rect(rect.x1, rect.y1, width, height);

			context.fillStyle =
				rect.id === selectedId
					? 'rgba(100, 100, 100, 0.5)'
					: 'transparent';
			context.fill();
			context.strokeStyle =
				rect.id === hoveredRectIndex ? 'yellow' : 'red'; // Highlight on hover
			context.stroke();
		});
	}, [streamData, hoveredRectIndex, selectedId]); // Redraw when streamData changes

	useEffect(() => {
		const canvas = canvasRef.current;

		// Function to check if a point is inside a rectangle
		const isPointInRect = (x, y, rect) => {
			return x >= rect.x1 && x <= rect.x2 && y >= rect.y1 && y <= rect.y2;
		};

		const handleMouseMove = (event) => {
			const rect = canvas.getBoundingClientRect();
			const x = event.clientX - rect.left;
			const y = event.clientY - rect.top;
			const hoveredRect = streamData.rectangles.find((rect) =>
				isPointInRect(x, y, rect)
			);
			// Set hoveredRectIndex to the id of the hoveredRect, or null if no rect is hovered
			setHoveredRectIndex(hoveredRect ? hoveredRect.id : null);
		};

		const handleClick = (event) => {
			// compare with previous selected rectangle, deselect if same
			setSelectedId(() => {
				const rect = canvas.getBoundingClientRect();
				const x = event.clientX - rect.left;
				const y = event.clientY - rect.top;

				const clickedRect = streamData.rectangles.find((rect) =>
					isPointInRect(x, y, rect)
				);
				if (clickedRect?.id === selectedId) {
					return null;
				}
				// if selected then deselect, otherwise select
				return clickedRect ? clickedRect.id : null;
			});
		};

		canvas.addEventListener('mousemove', handleMouseMove);
		canvas.addEventListener('click', handleClick);
		return () => {
			canvas.removeEventListener('mousemove', handleMouseMove);
			canvas.removeEventListener('click', handleClick);
		};
	}, [streamData, selectedId]);

	return (
		<div className='relative'>
			<div className='absolute top-0 left-0 bg-black bg-opacity-50 text-white p-2'>
				<p>FPS: {fps}</p>
				<div className='flex flex-row gap-2 items-center'>
					<p>Ping: {ping}ms</p>
					<div
						style={{
							width: '20px',
							height: '20px',
							borderRadius: '50%',
							backgroundColor: health,
						}}
					></div>
				</div>
			</div>
			<canvas
				className='absolute top-0 left-0'
				width={streamData.image_size[0] || '640'}
				height={streamData.image_size[1] || '480'}
				ref={canvasRef}
			></canvas>
			<img
				src={streamData.imageUrl || '/assets/test.png'}
				alt='Live Stream'
				className={`max-h-[${streamData.image_size[1]}] max-w-[${streamData.image_size[0]}] min-h-[${streamData.image_size[1]}] min-w-[${streamData.image_size[0]}] h-[${streamData.image_size[1]}] w-[${streamData.image_size[0]}]`}
			/>
		</div>
	);
};

export default CameraImage;
