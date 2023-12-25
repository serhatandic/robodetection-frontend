import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { IconButton } from '@mui/material';
import PropTypes from 'prop-types';

const UP = 'i';
const LEFT = 'j';
const DOWN = ',';
const RIGHT = 'l';

const KeyboardController = ({
	connectionStatus,
	handleRequest,
	upRef,
	downRef,
	leftRef,
	rightRef,
}) => {
	return (
		<div className='border-l-2 border-black w-1/3 h-full flex flex-col justify-center'>
			<div className='flex justify-center items-center text-xl'>
				<IconButton
					disabled={connectionStatus === 'failed'}
					ref={upRef}
					onClick={() => {
						handleRequest(UP);
					}}
				>
					<KeyboardArrowUpIcon />
				</IconButton>
			</div>
			<div className='flex justify-center items-center'>
				<IconButton
					disabled={connectionStatus === 'failed'}
					ref={leftRef}
					onClick={() => {
						handleRequest(LEFT);
					}}
				>
					<KeyboardArrowLeftIcon />
				</IconButton>
				<IconButton
					disabled={connectionStatus === 'failed'}
					ref={downRef}
					onClick={() => {
						handleRequest(DOWN);
					}}
				>
					<KeyboardArrowDownIcon />
				</IconButton>
				<IconButton
					disabled={connectionStatus === 'failed'}
					ref={rightRef}
					onClick={() => {
						handleRequest(RIGHT);
					}}
				>
					<KeyboardArrowRightIcon />
				</IconButton>
			</div>
		</div>
	);
};

KeyboardController.propTypes = {
	connectionStatus: PropTypes.string,
	handleRequest: PropTypes.func,
	upRef: PropTypes.object,
	downRef: PropTypes.object,
	leftRef: PropTypes.object,
	rightRef: PropTypes.object,
};

export default KeyboardController;
