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
	const [trackStatus, setTrackStatus] = useState(false);
	const [trackablesData, setTrackablesData] = useState([]);
	const [selectedIdFromTrackablesList, setSelectedIdFromTrackablesList] =
		useState(null);

	const handleTrackStatus = (status) => {
		setTrackStatus(status);
	};

	return (
		<ThemeProvider theme={theme}>
			<div className=' h-full w-full flex flex-col md:flex-row'>
				<div className='w-full h-full flex flex-col p-1 gap-2 justify-between'>
					<ImageStream
						handleTrackStatus={handleTrackStatus}
						trackStatus={trackStatus}
						setTrackablesData={setTrackablesData}
						selectedIdFromTrackablesList={
							selectedIdFromTrackablesList
						}
					/>
					<ControllerSection
						connectionStatus={connectionStatus}
						handleTrackStatus={handleTrackStatus}
						trackStatus={trackStatus}
					/>
				</div>
				<div className='w-full h-full flex flex-col p-1 gap-2'>
					<TrackablesList
						trackStatus={trackStatus}
						trackablesData={trackablesData}
						selectedIdFromTrackablesList={
							selectedIdFromTrackablesList
						}
						setSelectedIdFromTrackablesList={
							setSelectedIdFromTrackablesList
						}
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
