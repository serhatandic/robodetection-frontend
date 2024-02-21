import Layout from './components/Layout';
import { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

const backendIP = import.meta.env.VITE_BACKEND_IP;
const backendPort = import.meta.env.VITE_BACKEND_PORT;

function App() {
	const [connectionStatus, setConnectionStatus] = useState('connecting'); // connected, connecting, failed
	const [modalStatus, setModalStatus] = useState(true);
	useEffect(() => {
		const handleConnection = async () => {
			try {
				const resp = await fetch(
					`http://${backendIP}:${backendPort}/`,
					{
						method: 'GET',
					}
				);
				if (resp.status === 200) {
					setConnectionStatus('connected');
					setModalStatus(false);
				} else {
					setConnectionStatus('failed');
					setModalStatus(true);
				}
			} catch (error) {
				setConnectionStatus('failed');
				setModalStatus(true);
			}
		};
		handleConnection();
	}, []);
	return (
		<div className='h-screen w-screen p-4 flex justify-center'>
			{connectionStatus === 'connecting' ? (
				<CircularProgress className='m-auto' />
			) : (
				<>
					<Layout connectionStatus={connectionStatus} />
					<Modal
						open={modalStatus}
						onClose={() => {}}
						className='flex justify-center items-center'
					>
						<Box className='h-20 bg-white rounded-md p-5 flex flex-col justify-center items-center'>
							<Typography variant='h6' component='h2'>
								Connection could not be established, you will
								not be able to use the controllers
							</Typography>
							<Button
								variant='contained'
								className='w-1/4'
								onClick={() => {
									setModalStatus(false);
								}}
							>
								Continue
							</Button>
						</Box>
					</Modal>
				</>
			)}
		</div>
	);
}

export default App;
