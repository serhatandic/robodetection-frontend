/* eslint-disable react/prop-types */
import {
	DataGrid,
	GridFooterContainer,
	GridPagination,
} from '@mui/x-data-grid';
import { useEffect, useState, useMemo } from 'react';
import Button from '@mui/material/Button';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { Box, IconButton } from '@mui/material';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US');

function TrackablesList({
	trackStatus,
	trackablesData,
	setSelectedIdFromTrackablesList,
	selectedIdFromTrackablesList,
	currentlyTrackingId,
}) {
	const [rows, setRows] = useState([]);

	const memoizedSlots = useMemo(
		() => ({
			footer: (props) => (
				<GridFooterContainer>
					<GridPagination {...props} />

					<Box className='pr-2'>
						<IconButton
							onClick={() => {
								setRows([]);
							}}
						>
							<NotInterestedIcon />
						</IconButton>
					</Box>
				</GridFooterContainer>
			),
		}),
		[setRows]
	);
	const columns = [
		{ field: 'id', headerName: 'ID' },
		{ field: 'status', headerName: 'Status' },
		{
			field: 'trackorstop',
			headerName: 'Track/Stop',
			width: 130,
			sortable: false,
			renderCell: (params) => (
				<Button
					sx={{
						width: '100%',
					}}
					variant='contained'
					disabled={params.row.status !== 'Visible'}
					onClick={() => {
						handleCellClick(params);
					}}
				>
					{selectedIdFromTrackablesList === params.row.id
						? 'Stop'
						: 'Track'}
				</Button>
			),
		},
		{
			field: 'lastSeen',
			headerName: 'Last Seen',
			width: 130,
			renderCell: (params) => {
				if (params.row.lastSeen) {
					return timeAgo.format(new Date(params.row.lastSeen));
				}
			},
		},
	];

	useEffect(() => {
		if (!trackablesData) {
			setRows([]);
			return;
		}
		const newRows = trackablesData?.rectangles?.map((trackable) => {
			return {
				id: trackable.id,
				status: 'Visible', // "Visible" or "Not Visible
				lastSeen: trackable.lastSeen,
				trackorstop: trackable.trackorstop,
			};
		});

		// find the new rows that are not in the old rows, add them.
		// For the old rows that are not in the new rows, update their status to "Not Visible" and
		// update their lastSeen to the current time

		setRows((prevRows) => {
			const newRowsIds = newRows ? newRows.map((row) => row.id) : [];
			const oldRowsIds = prevRows.map((row) => row.id);

			const updatedRows = prevRows.map((row) => {
				if (!newRowsIds.includes(row.id)) {
					return {
						...row,
						status: 'Not Visible',
						lastSeen: row.lastSeen ? row.lastSeen : new Date(),
					};
				} else {
					return {
						...row,
						status: 'Visible',
						lastSeen: '',
					};
				}
			});

			const newRowsToAdd = newRows
				? newRows.filter((row) => !oldRowsIds.includes(row.id))
				: [];
			return [...newRowsToAdd, ...updatedRows];
		});
	}, [trackablesData]);

	useEffect(() => {
		if (!trackStatus) {
			setRows([]);
			return;
		}
	}, [trackStatus]);

	useEffect(() => {
		setSelectedIdFromTrackablesList(currentlyTrackingId);
	}, [currentlyTrackingId, setSelectedIdFromTrackablesList]);

	const handleCellClick = (params) => {
		// handle trackorstop clicks only
		if (params.field !== 'trackorstop') return;
		// if already selected, deselect
		if (selectedIdFromTrackablesList === params.row.id) {
			setSelectedIdFromTrackablesList(null);
			return;
		}
		setSelectedIdFromTrackablesList(params.row.id);
	};

	return (
		<div className='h-full overflow-scroll'>
			<DataGrid rows={rows} columns={columns} slots={memoizedSlots} />
		</div>
	);
}

export default TrackablesList;
