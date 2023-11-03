import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const TrackablesList = () => {
	function createData(id, name, calories, fat, carbs, protein) {
		return { id, name, calories, fat, carbs, protein };
	}
	const rows = [
		createData(1, 'Barış Sarper TEZCAN', 2200, 6.0, 24, 5000),
		createData(2, 'Barış PC', 0, 0, 0, 0),
		createData(3, 'Hikmet Rasih Türkan', 2300, 16.0, 24, 2500),
		createData(4, 'Hikmet PC', 0, 0, 0, 0),
		createData(5, 'Gingerbread', 356, 16.0, 49, 3.9),
		createData(6, 'Cupcake', 305, 3.7, 67, 4.3),
		createData(7, 'Cupcake', 305, 3.7, 67, 4.3),
		createData(8, 'Cupcake', 305, 3.7, 67, 4.3),
		createData(9, 'Cupcake', 305, 3.7, 67, 4.3),
	];
	return (
		<div className='border-2 w-full h-full border-black overflow-auto'>
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 650 }} aria-label='simple table'>
					<TableHead>
						<TableRow>
							<TableCell>Dessert (100g serving)</TableCell>
							<TableCell align='right'>Calories</TableCell>
							<TableCell align='right'>Fat&nbsp;(g)</TableCell>
							<TableCell align='right'>Carbs&nbsp;(g)</TableCell>
							<TableCell align='right'>
								Protein&nbsp;(g)
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.map((row) => (
							<TableRow
								key={row.id}
								sx={{
									'&:last-child td, &:last-child th': {
										border: 0,
									},
								}}
							>
								<TableCell component='th' scope='row'>
									{row.name}
								</TableCell>
								<TableCell align='right'>
									{row.calories}
								</TableCell>
								<TableCell align='right'>{row.fat}</TableCell>
								<TableCell align='right'>{row.carbs}</TableCell>
								<TableCell align='right'>
									{row.protein}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
};

export default TrackablesList;
