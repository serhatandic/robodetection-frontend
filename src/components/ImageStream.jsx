import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import CameraImage from './CameraImage';

const ImageStream = ({ trackStatus, handleTrackStatus }) => {
	return (
		<div className='w-full h-full  flex justify-center items-center '>
			{/* <img
				className='w-full h-full object-cover'
				src='/assets/robot-dog-vision.png'
			/> */}

			{trackStatus ? (
				<div className='w-full h-full flex flex-col gap-2'>
					{/* <VideoPlayer
						videoUrl='https://www.youtube.com/watch?v=KyXvr5SV2zw'
						handleVideoProgress={handleVideoProgress}
					/> */}
					<div className='backdrop-blur-sm bg-gray-200 w-full h-full flex justify-center items-center'>
						<CameraImage />
					</div>
					<div className='flex gap-2 items-center'>
						<Button
							variant='contained'
							onClick={() => {
								handleTrackStatus((prev) => !prev);
							}}
						>
							Stop Tracking
						</Button>
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
