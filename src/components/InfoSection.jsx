/* eslint-disable react/prop-types */
import { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
	DataGrid,
	GridFooterContainer,
	GridPagination,
} from '@mui/x-data-grid';
import useSocket from '../hooks/useSocket';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import { Box, IconButton } from '@mui/material';
TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US');

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
		renderCell: (params) => timeAgo.format(new Date(params.row.timestamp)),
	},
];

const socketUrl = import.meta.env.VITE_SOCKET_URL;
const InfoSection = ({ currentlyTrackingId }) => {
	const { socket, isConnected } = useSocket(socketUrl);
	const [activityLogId, setActivityLogId] = useState(-1);
	const [logStack, setLogStack] = useState([
		{
			id: 0,
			timestamp: new Date(),
			activitylog: 'Activity log initialized',
		},
	]);
	const [prev, setPrev] = useState(currentlyTrackingId);

	const memoizedSlots = useMemo(
		() => ({
			footer: (props) => (
				<GridFooterContainer>
					<GridPagination {...props} />

					<Box className='pr-2'>
						<IconButton onClick={() => setLogStack([])}>
							<NotInterestedIcon />
						</IconButton>
					</Box>
				</GridFooterContainer>
			),
		}),
		[setLogStack]
	);

	const logs = {
		0: `Released tracking of target ${
			currentlyTrackingId ? currentlyTrackingId : prev
		}`,
		1: `Stopped tracking target ${
			currentlyTrackingId ? currentlyTrackingId : prev
		}`,
		2: `Midway to target ${
			currentlyTrackingId ? currentlyTrackingId : prev
		}, recalculating route`,
		3: `Failed to recalculate route for target ${
			currentlyTrackingId ? currentlyTrackingId : prev
		}; using previous route`,
		4: `Continuing to follow target ${
			currentlyTrackingId ? currentlyTrackingId : prev
		}`,
		5: `Operation timed out; continuing toward target ${
			currentlyTrackingId ? currentlyTrackingId : prev
		}`,
		6: `Target ${
			currentlyTrackingId ? currentlyTrackingId : prev
		} is too close for tracking`,
		7: `Initiating tracking of target ${
			currentlyTrackingId ? currentlyTrackingId : prev
		}`,
		8: `Target reached; stopping tracking of target ${
			currentlyTrackingId ? currentlyTrackingId : prev
		}`,
	};

	useEffect(() => {
		if (!isConnected) return;
		if (currentlyTrackingId === null) return;
		setPrev(currentlyTrackingId);
	}, [socket, isConnected, prev, currentlyTrackingId]);

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

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activityLogId, isConnected]);

	return (
		<div className='md:w-2/3 h-full'>
			<DataGrid
				className=' mb-2'
				rows={prev ? logStack : []}
				columns={columns}
				slots={memoizedSlots}
			/>
		</div>
	);
};

InfoSection.propTypes = {
	trackable: PropTypes.string,
	trackStatus: PropTypes.bool,
	handleTrackStatus: PropTypes.func,
};

export default InfoSection;
