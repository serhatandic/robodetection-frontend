import { useEffect, useState, useRef } from 'react';

const backendIP = import.meta.env.VITE_BACKEND_IP;
const backendPort = import.meta.env.VITE_BACKEND_PORT;

const CameraImage = () => {
	const [hoveredRectIndex, setHoveredRectIndex] = useState(null); // New state to track hovered rectangle
	const [selectedId, setSelectedId] = useState(null);
	const [streamData, setStreamData] = useState({
		imageUrl: null,
		rectangles: [
			{
				id: null,
				x2: 200,
				x1: 100,
				y2: 200,
				y1: 100,
			},
		],
	});

	const canvasRef = useRef(null);

	useEffect(() => {
		const sendRequest = async () => {
			try {
				const response = await fetch(
					`http://${backendIP}:${backendPort}/stream`
				);
				const data = await response.json();
				const image_size = data.image_size;
				const coordinates = data.coordinates;
				console.log(image_size, coordinates);

				// Assuming data.image is a base64 encoded string
				const base64Response = data.image.split(';base64,').pop(); // Extract base64 data
				const blob = await fetch(
					`data:image/jpeg;base64,${base64Response}`
				).then((res) => res.blob()); // Convert base64 string to blob
				const url = URL.createObjectURL(blob); // Create a URL for the blob
				setStreamData(() => ({
					rectangles: Object.keys(coordinates).map((id) => ({
						id: id,
						x1: coordinates[id][0],
						y1: coordinates[id][1],
						x2: coordinates[id][2],
						y2: coordinates[id][3],
					})),
					imageUrl: url,
				}));
			} catch (error) {
				console.error('Failed to fetch the image stream', error);
			}
		};

		sendRequest();
	}, [streamData]);

	useEffect(() => {
		const canvas = canvasRef.current;
		const context = canvas.getContext('2d');

		context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

		streamData.rectangles.forEach((rect, index) => {
			context.beginPath();
			const width = rect.x2 - rect.x1;
			const height = rect.y2 - rect.y1;
			context.rect(rect.x1, rect.y1, width, height);
			context.fillStyle =
				rect.id === selectedId
					? 'rgba(100, 100, 100, 0.5)'
					: 'transparent';
			context.fill();
			context.strokeStyle = index === hoveredRectIndex ? 'yellow' : 'red'; // Highlight on hover
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
			const hoveredIndex = streamData.rectangles.findIndex((rect) =>
				isPointInRect(x, y, rect)
			);

			setHoveredRectIndex(hoveredIndex >= 0 ? hoveredIndex : null);
		};

		const handleClick = (event) => {
			setSelectedId(() => {
				const rect = canvas.getBoundingClientRect();
				const x = event.clientX - rect.left;
				const y = event.clientY - rect.top;
				const clickedIndex = streamData.rectangles.findIndex((rect) =>
					isPointInRect(x, y, rect)
				);

				// if selected then deselect, otherwise select
				return clickedIndex >= 0
					? streamData.rectangles[clickedIndex].id
					: null;
			});
		};

		canvas.addEventListener('mousemove', handleMouseMove);
		canvas.addEventListener('click', handleClick);

		return () => {
			canvas.removeEventListener('mousemove', handleMouseMove);
			canvas.removeEventListener('click', handleClick);
		};
	}, [streamData]);

	return (
		<div className='relative'>
			<canvas
				className='absolute top-0 left-0'
				width='640'
				height='480'
				ref={canvasRef}
			></canvas>
			{streamData.imageUrl ? (
				<img
					src={streamData.imageUrl}
					alt='Live Stream'
					className='max-h-[480px] max-w-[640px] min-h-[480px] min-w-[640px] h-[480px] w-[640px] '
				/>
			) : (
				<img
					src={'/assets/test.png'}
					className='max-h-[480px] max-w-[640px] min-h-[480px] min-w-[640px] h-[480px] w-[640px] '
				/>
			)}
		</div>
	);
};

export default CameraImage;
