import { DataGrid } from '@mui/x-data-grid';
import PropTypes from 'prop-types';
import trackData from '/src/data/test_track.json';
import { useEffect, useState } from 'react';

const columns = [
	{ field: 'id', headerName: 'ID' },
	// { field: 'firstName', headerName: 'First name', width: 130 },
	// { field: 'lastName', headerName: 'Last name', width: 130 },
	// {
	// 	field: 'age',
	// 	headerName: 'Age',
	// 	type: 'number',
	// 	width: 90,
	// },
	// {
	// 	field: 'fullName',
	// 	headerName: 'Full name',
	// 	description: 'This column has a value getter and is not sortable.',
	// 	sortable: false,
	// 	width: 160,
	// 	valueGetter: (params) =>
	// 		`${params.row.firstName || ''} ${params.row.lastName || ''}`,
	// },
];

// const rows = [
// 	{ id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
// 	{ id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
// 	{ id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
// 	{ id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
// 	{ id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
// 	{ id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
// 	{ id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
// 	{ id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
// 	{ id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
// ];

function TrackablesList({ handleTrackableChange, videoProgress, trackStatus }) {
	const [rows, setRows] = useState([]);

	useEffect(() => {
		if (!videoProgress) return;
		handleVideoProgress(videoProgress);
	}, [videoProgress]);

	useEffect(() => {
		if (!trackStatus) {
			setRows([]);
			return;
		}
	}, [trackStatus]);

	const handleVideoProgress = (progress) => {
		if (!progress) return;
		const { playedSeconds } = progress;
		if (!playedSeconds) return;
		const playedSecondsFixed = playedSeconds.toFixed(0);
		if (!trackData[playedSecondsFixed]) return;
		setRows(() => {
			const temp = [];
			for (const id of trackData[playedSecondsFixed]) {
				temp.push({ id: id });
			}
			return temp;
		});
	};

	const handleCellClick = (params) => {
		handleTrackableChange(params.value);
	};
	return (
		<div className='h-full overflow-auto'>
			<DataGrid
				rows={rows}
				columns={columns}
				onCellClick={handleCellClick}
				rowHeight={20}
			/>
		</div>
	);
}

TrackablesList.propTypes = {
	handleTrackableChange: PropTypes.func.isRequired,
	videoProgress: PropTypes.object,
	trackStatus: PropTypes.bool,
};

export default TrackablesList;
