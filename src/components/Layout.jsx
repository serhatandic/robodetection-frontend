import { useState } from 'react';
import ImageStream from './ImageStream';
import Map from './Map';
import Controller from './Controller';
import TrackablesList from './TrackablesList';
import PropTypes from 'prop-types';

const Layout = ({ connectionStatus }) => {
	const [trackable, setTrackable] = useState(null);
	const [videoProgress, setVideoProgress] = useState();
	const [trackStatus, setTrackStatus] = useState(false);
	const handleVideoProgress = (progress) => {
		setVideoProgress(progress);
	};

	const handleTrackStatus = (value) => {
		setTrackStatus(value);
	};
	return (
		<div className=' h-full w-full flex flex-col md:flex-row'>
			<div className='w-full h-full flex flex-col p-1 gap-2'>
				<ImageStream
					handleVideoProgress={handleVideoProgress}
					trackStatus={trackStatus}
				/>
				<Controller
					connectionStatus={connectionStatus}
					trackable={trackable}
					handleTrackStatus={handleTrackStatus}
					trackStatus={trackStatus}
				/>
			</div>
			<div className='w-full h-full flex flex-col p-1 gap-2'>
				<TrackablesList
					setTrackable={setTrackable}
					videoProgress={videoProgress}
				/>
				<Map />
			</div>
		</div>
	);
};

export default Layout;

Layout.propTypes = {
	connectionStatus: PropTypes.string,
};
