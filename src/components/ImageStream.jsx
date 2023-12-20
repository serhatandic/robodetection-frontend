import VideoPlayer from './VideoPlayer';
import PropTypes from 'prop-types';

const ImageStream = ({ handleVideoProgress, trackStatus }) => {
	return (
		<div className='border-2 w-full h-full  border-black overflow-hidden flex justify-center items-center'>
			{/* <img
				className='w-full h-full object-cover'
				src='/assets/robot-dog-vision.png'
			/> */}

			{trackStatus && (
				<div className='w-full h-full'>
					<VideoPlayer
						videoUrl='https://www.youtube.com/watch?v=ruowuNZRoSg'
						handleVideoProgress={handleVideoProgress}
					/>
				</div>
			)}
		</div>
	);
};

ImageStream.propTypes = {
	handleVideoProgress: PropTypes.func.isRequired,
	trackStatus: PropTypes.bool.isRequired,
};

export default ImageStream;
