import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import CameraImage from './CameraImage';
import ImageQualitySelection from './ImageQualitySelection';

import { useState } from 'react';

const ImageStream = ({ trackStatus, handleTrackStatus }) => {
	const [imageQuality, setImageQuality] = useState(1);

	const handleImageQualityChange = (event) => {
		setImageQuality(event.target.value);
	};

	return (
		<div className='w-full   flex justify-center items-center '>
			{trackStatus ? (
				<div className='w-full h-full flex flex-col gap-2'>
					<div className='backdrop-blur-sm bg-gray-200 w-full h-full flex justify-center items-center'>
						<CameraImage imageQuality={imageQuality} />
					</div>
					<div className='flex gap-2 items-center w-full'>
						<Button
							className='h-full'
							variant='contained'
							onClick={() => {
								handleTrackStatus((prev) => !prev);
							}}
						>
							Stop Tracking
						</Button>
						<ImageQualitySelection
							imageQuality={imageQuality}
							handleImageQualityChange={handleImageQualityChange}
						/>
					</div>
				</div>
			) : (
				<Button
					variant='contained'
					onClick={() => {
						handleTrackStatus((prev) => !prev);
					}}
				>
					Start Tracking
				</Button>
			)}
		</div>
	);
};

ImageStream.propTypes = {
	handleVideoProgress: PropTypes.func.isRequired,
	trackStatus: PropTypes.bool.isRequired,
	handleTrackStatus: PropTypes.func.isRequired,
};

export default ImageStream;
