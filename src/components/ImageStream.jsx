import VideoPlayer from './VideoPlayer';
import PropTypes from 'prop-types';

const ImageStream = ({ handleVideoProgress }) => {
	return (
		<div className='border-2 w-full h-full  border-black overflow-hidden'>
			{/* <img
				className='w-full h-full object-cover'
				src='/assets/robot-dog-vision.png'
			/> */}
			<VideoPlayer
				videoUrl='https://www.youtube.com/watch?v=ruowuNZRoSg'
				handleVideoProgress={handleVideoProgress}
			/>
		</div>
	);
};

ImageStream.propTypes = {
	handleVideoProgress: PropTypes.func.isRequired,
};

export default ImageStream;
