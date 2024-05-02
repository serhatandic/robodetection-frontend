import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';
import useSocket from '../hooks/useSocket';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US');

const logs = {
	0: 'Target released from tracking',
	1: 'Stopped tracking target',
	2: 'Midway update: recalculating route',
	3: 'Route recalculation failed; reverting to previous route',
	4: 'Continuing to follow target',
	5: 'Operation timed out; proceeding with current action',
	6: 'Target proximity too close for tracking',
	7: 'Initiating target tracking',
};

const socketUrl = import.meta.env.VITE_SOCKET_URL;

const InfoSection = () => {
	const { socket, isConnected } = useSocket(socketUrl);
	const [activityLogId, setActivityLogId] = useState(-1);
	const [logStack, setLogStack] = useState([]);

	const columns = [
		// full width
		{
			field: 'activitylog',
			headerName: 'Activity Log',
			flex: 1,
		},
		{
			field: 'timestamp',
			headerName: 'Timestamp',
			renderCell: (params) =>
				timeAgo.format(new Date(params.row.timestamp)),
		},
	];

	useEffect(() => {
		if (!isConnected) return;
		socket.on('activity_log_id', (data) => {
			setActivityLogId(data);
		});
	}, [socket, isConnected]);

	useEffect(() => {
		if (!isConnected) return;
		setLogStack((prev) => {
			if (activityLogId === -1) return prev;
			// top of the stack is not the same as the new log
			if (prev?.length > 0 && prev[0].id !== activityLogId) {
				return [
					{
						id: Math.random() * 1000,
						timestamp: new Date(),
						activitylog: logs[activityLogId],
					},
					...prev,
				];
			} else if (prev?.length === 0) {
				return [
					{
						id: Math.random() * 1000,
						timestamp: new Date(),
						activitylog: logs[activityLogId],
					},
				];
			}
			return [];
		});
	}, [activityLogId, isConnected]);
	return (
		<div className=' w-full max-h-[40vh]'>
			<DataGrid className=' mb-2' rows={logStack} columns={columns} />
		</div>
	);
};

InfoSection.propTypes = {
	trackable: PropTypes.string,
	trackStatus: PropTypes.bool,
	handleTrackStatus: PropTypes.func,
};

export default InfoSection;
