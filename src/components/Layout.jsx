import ImageStream from './ImageStream';
import Map from './Map';
import Controller from './Controller';
import TrackablesList from './TrackablesList';

const Layout = () => {
	return (
		<div className=' h-full w-full flex flex-col md:flex-row'>
			<div className='w-full h-full flex flex-col p-1 gap-2'>
				<ImageStream />
				<Controller />
			</div>
			<div className='w-full h-full flex flex-col p-1 gap-2'>
				<TrackablesList />
				<Map />
			</div>
		</div>
	);
};

export default Layout;
