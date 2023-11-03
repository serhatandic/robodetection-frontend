import { useState } from 'react';
import ImageStream from './ImageStream';
import Map from './Map';
import Controller from './Controller';
import TrackablesList from './TrackablesList';

const Layout = () => {
	const [trackable, setTrackable] = useState(null);

	return (
		<div className=' h-full w-full flex flex-col md:flex-row'>
			<div className='w-full h-full flex flex-col p-1 gap-2'>
				<ImageStream />
				<Controller trackable={trackable} />
			</div>
			<div className='w-full h-full flex flex-col p-1 gap-2'>
				<TrackablesList setTrackable={setTrackable} />
				<Map />
			</div>
		</div>
	);
};

export default Layout;
