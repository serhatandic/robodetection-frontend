import ReactPlayer from 'react-player';
import PropTypes from 'prop-types';

const VideoPlayer = ({ videoUrl, handleVideoProgress }) => {
	return (
		<ReactPlayer
			url={videoUrl}
			controls={true}
			width='auto'
			height='100%'
			progressInterval={10}
			onProgress={handleVideoProgress}
		/>
	);
};

VideoPlayer.propTypes = {
	videoUrl: PropTypes.string.isRequired,
	handleVideoProgress: PropTypes.func.isRequired,
};

export default VideoPlayer;
