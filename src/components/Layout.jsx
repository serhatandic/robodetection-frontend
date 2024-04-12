import { useState } from 'react';
import ImageStream from './ImageStream';
// import Map from './Map';
import ControllerSection from './ControllerSection';
import TrackablesList from './TrackablesList';
import PropTypes from 'prop-types';
// import GamepadController from './GamepadController';
import theme from '../Theme';
import { ThemeProvider } from '@mui/material/styles';
import Map from './Map';
const Layout = ({ connectionStatus }) => {
	const [trackable, setTrackable] = useState(null);
	const [trackStatus, setTrackStatus] = useState(false);

	const [videoProgress, setVideoProgress] = useState();
	const handleVideoProgress = (progress) => {
		setVideoProgress(progress);
	};

	const handleTrackStatus = (status) => {
		setTrackStatus(status);
		setTrackable(null);
	};

	const handleTrackableChange = (trackable) => {
		setTrackable(trackable);
	};

	return (
		<ThemeProvider theme={theme}>
			<div className=' h-full w-full flex flex-col md:flex-row'>
				<div className='w-full h-full flex flex-col p-1 gap-2'>
					<ImageStream
						handleVideoProgress={handleVideoProgress}
						handleTrackStatus={handleTrackStatus}
						trackStatus={trackStatus}
					/>
					<ControllerSection
						connectionStatus={connectionStatus}
						trackable={trackable}
						handleTrackStatus={handleTrackStatus}
						trackStatus={trackStatus}
					/>
				</div>
				<div className='w-full h-full flex flex-col p-1 gap-2'>
					<TrackablesList
						handleTrackableChange={handleTrackableChange}
						videoProgress={videoProgress}
						trackStatus={trackStatus}
					/>
					<Map />
					{/* <GamepadController
						controller={1}
						style={{ position: 'fixed', bottom: 100, right: 100 }}
					/> */}
				</div>
			</div>
		</ThemeProvider>
	);
};

export default Layout;

Layout.propTypes = {
	connectionStatus: PropTypes.string,
};
