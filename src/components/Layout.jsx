/* eslint-disable react/prop-types */
import { useState } from 'react';
import ImageStream from './ImageStream';
// import Map from './Map';
import ControllerSection from './ControllerSection';
import TrackablesList from './TrackablesList';
import PropTypes from 'prop-types';
// import GamepadController from './GamepadController';

import Map from './Map';

const Layout = ({ connectionStatus, socket, isConnected }) => {
	const [trackStatus, setTrackStatus] = useState(false);
	const [trackablesData, setTrackablesData] = useState([]);
	const [selectedIdFromTrackablesList, setSelectedIdFromTrackablesList] =
		useState(null);
	const [currentlyTrackingId, setCurrentlyTrackingId] = useState(null);

	const handleTrackStatus = (status) => {
		setTrackStatus(status);
	};

	return (
		<div className=' h-[200vh] md:h-[98vh] w-full flex flex-col md:flex-row'>
			<div className='w-full h-[100vh] md:h-full flex flex-col p-1 gap-2 justify-between '>
				<ImageStream
					socket={socket}
					isConnected={isConnected}
					handleTrackStatus={handleTrackStatus}
					trackStatus={trackStatus}
					setTrackablesData={setTrackablesData}
					selectedIdFromTrackablesList={selectedIdFromTrackablesList}
					setCurrentlyTrackingId={setCurrentlyTrackingId}
				/>
				<ControllerSection
					socket={socket}
					isConnected={isConnected}
					connectionStatus={connectionStatus}
					handleTrackStatus={handleTrackStatus}
					trackStatus={trackStatus}
					currentlyTrackingId={currentlyTrackingId}
					setCurrentlyTrackingId={setCurrentlyTrackingId}
				/>
			</div>
			<div className='w-full h-[100vh] md:h-full flex flex-col p-1 gap-2'>
				<TrackablesList
					trackStatus={trackStatus}
					trackablesData={trackablesData}
					selectedIdFromTrackablesList={selectedIdFromTrackablesList}
					setSelectedIdFromTrackablesList={
						setSelectedIdFromTrackablesList
					}
					currentlyTrackingId={currentlyTrackingId}
				/>
				<Map socket={socket} isConnected={isConnected} />
				{/* <GamepadController
						controller={1}
						style={{ position: 'fixed', bottom: 100, right: 100 }}
					/> */}
			</div>
		</div>
	);
};

export default Layout;

Layout.propTypes = {
	connectionStatus: PropTypes.string,
};
