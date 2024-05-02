/* eslint-disable react/prop-types */
import Button from '@mui/material/Button';
import CameraImage from './CameraImage';
import ImageQualitySelection from './ImageQualitySelection';
import Box from '@mui/material/Box';
import { useState } from 'react';

const ImageStream = ({
	trackStatus,
	handleTrackStatus,
	setTrackablesData,
	selectedIdFromTrackablesList,
	setCurrentlyTrackingId,
}) => {
	const [imageQuality, setImageQuality] = useState(40);

	const handleImageQualityChange = (event) => {
		setImageQuality(event.target.value);
	};

	return (
		<div className='w-full h-full flex justify-center items-center '>
			{trackStatus ? (
				<div className='w-full h-full flex flex-col gap-2'>
					<div className='backdrop-blur-sm bg-gray-200 w-full h-full flex justify-center items-center'>
						<CameraImage
							imageQuality={imageQuality}
							setTrackablesData={setTrackablesData}
							selectedIdFromTrackablesList={
								selectedIdFromTrackablesList
							}
							setCurrentlyTrackingId={setCurrentlyTrackingId}
						/>
					</div>
					<div className='flex gap-2 items-center w-[74%]'>
						<Box className='flex gap-2 items-center w-full h-full'>
							<Button
								className='h-full'
								variant='contained'
								onClick={() => {
									handleTrackStatus((prev) => !prev);
								}}
							>
								Stop Stream
							</Button>
							<ImageQualitySelection
								imageQuality={imageQuality}
								handleImageQualityChange={
									handleImageQualityChange
								}
							/>
						</Box>
						{/* <Button className='h-full' variant='contained'>
							Cancel all goals
						</Button> */}
					</div>
				</div>
			) : (
				<Button
					variant='contained'
					onClick={() => {
						handleTrackStatus((prev) => !prev);
					}}
				>
					Start Stream
				</Button>
			)}
		</div>
	);
};
export default ImageStream;
