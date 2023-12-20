import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import theme from '../Theme';
import { ThemeProvider } from '@mui/material/styles';

const InfoSection = ({ trackable, trackStatus, handleTrackStatus }) => {
	return (
		<ThemeProvider theme={theme}>
			<div className='h-full w-full overflow-auto'>
				<div>
					<table className='ml-2 mt-2'>
						<thead>
							<tr>
								<th className='p-2'>Speed</th>
								<th className='p-2'>Direction</th>
								<th className='p-2'>Start/Stop Tracking</th>
								<th className='p-2'>Currently Tracking</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td className='p-2'>0.0</td>
								<td className='p-2'>0.0</td>
								<td className='p-2'>
									{
										<Button
											variant='contained'
											className='w-full'
											onClick={() => {
												handleTrackStatus(
													(prev) => !prev
												);
											}}
										>
											{trackStatus ? 'Stop' : 'Start'}
										</Button>
									}
								</td>
								<td className='p-2 flex justify-center'>
									{trackable ? trackable : <></>}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div className='overflow-auto'>
					{/*activity log*/}
					<h2 className='ml-4 mt-2 font-bold'>Activity Log:</h2>
					<div className='ml-4'>
						{/* <p>Dog started to walk {Math.random() * 1000000}</p>
						<p>Direction changed {Math.random() * 1000000}</p>
						<p>Other log {Math.random() * 1000000}</p>
						<p>Some other log {Math.random() * 1000000}</p>
						<p>Loglog {Math.random() * 1000000}</p>
						<p>Logologoglgogolg {Math.random() * 1000000}</p> */}
					</div>
				</div>
			</div>
		</ThemeProvider>
	);
};

InfoSection.propTypes = {
	trackable: PropTypes.string,
	trackStatus: PropTypes.bool,
	handleTrackStatus: PropTypes.func,
};

export default InfoSection;
