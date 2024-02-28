import { useEffect, useState } from 'react';

const backendIP = import.meta.env.VITE_BACKEND_IP;
const backendPort = import.meta.env.VITE_BACKEND_PORT;

const CameraImage = () => {
	const [imageUrl, setImageUrl] = useState('');

	useEffect(() => {
		const sendRequest = async () => {
			fetch(`http://${backendIP}:${backendPort}/stream`)
				.then((response) => response.blob())
				.then((blob) => {
					const url = URL.createObjectURL(blob);
					setImageUrl(url);
				});
		};

		sendRequest();
	}, [imageUrl]);
	return <img src={imageUrl} alt='Live Stream' className='rotate-180' />;
};

export default CameraImage;
