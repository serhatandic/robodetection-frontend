import { useState } from 'react';
import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';

const InfoSection = () => {
	const [rows] = useState([]);
	const columns = [{ field: 'Activity Log', headerName: 'Activity Log' }];
	return (
		<div className=' w-full '>
			<DataGrid className=' mb-2' rows={rows} columns={columns} />
		</div>
	);
};

InfoSection.propTypes = {
	trackable: PropTypes.string,
	trackStatus: PropTypes.bool,
	handleTrackStatus: PropTypes.func,
};

export default InfoSection;
