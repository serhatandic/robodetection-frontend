import EastIcon from '@mui/icons-material/East';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import SouthEastIcon from '@mui/icons-material/SouthEast';
import NorthWestIcon from '@mui/icons-material/NorthWest';
import SouthWestIcon from '@mui/icons-material/SouthWest';
import WestIcon from '@mui/icons-material/West';
import SouthIcon from '@mui/icons-material/South';
import NorthIcon from '@mui/icons-material/North';
import { IconButton } from '@mui/material';
import PropTypes from 'prop-types';

const UP = 'i';
const UPLEFT = 'u';
const LEFT = 'j';
const DOWNLEFT = 'm';
const DOWN = ',';
const RIGHT = 'l';
const UPRIGHT = 'o';
const DOWNRIGHT = '.';

const CustomizedIconButton = ({
	connectionStatus,
	icon,
	direction,
	handleRequest,
	buttonRef,
}) => {
	return (
		<IconButton
			disabled={connectionStatus === 'failed'}
			onClick={() => {
				handleRequest(direction);
			}}
			ref={buttonRef}
		>
			{icon}
		</IconButton>
	);
};

const KeyboardController = ({
	connectionStatus,
	handleRequest,
	upRef,
	downRef,
	leftRef,
	rightRef,
	upRightRef,
	upLeftRef,
	downLeftRef,
	downRightRef,
}) => {
	return (
		<div className='flex'>
			<div className='flex flex-col justify-center items-center text-xl'>
				<CustomizedIconButton
					connectionStatus={connectionStatus}
					icon={<NorthWestIcon />}
					direction={UPLEFT}
					buttonRef={upLeftRef}
					handleRequest={handleRequest}
				/>
				<CustomizedIconButton
					connectionStatus={connectionStatus}
					icon={<WestIcon />}
					direction={LEFT}
					buttonRef={leftRef}
					handleRequest={handleRequest}
				/>
				<CustomizedIconButton
					connectionStatus={connectionStatus}
					icon={<SouthWestIcon />}
					direction={DOWNLEFT}
					buttonRef={downLeftRef}
					handleRequest={handleRequest}
				/>
			</div>
			<div className='flex flex-col justify-between'>
				<CustomizedIconButton
					connectionStatus={connectionStatus}
					icon={<NorthIcon />}
					direction={UP}
					buttonRef={upRef}
					handleRequest={handleRequest}
				/>
				<CustomizedIconButton
					connectionStatus={connectionStatus}
					icon={<SouthIcon />}
					direction={DOWN}
					buttonRef={downRef}
					handleRequest={handleRequest}
				/>
			</div>
			<div className='flex flex-col justify-center items-center'>
				<CustomizedIconButton
					connectionStatus={connectionStatus}
					icon={<NorthEastIcon />}
					direction={UPRIGHT}
					buttonRef={upRightRef}
					handleRequest={handleRequest}
				/>
				<CustomizedIconButton
					connectionStatus={connectionStatus}
					icon={<EastIcon />}
					direction={RIGHT}
					buttonRef={rightRef}
					handleRequest={handleRequest}
				/>
				<CustomizedIconButton
					connectionStatus={connectionStatus}
					icon={<SouthEastIcon />}
					direction={DOWNRIGHT}
					buttonRef={downRightRef}
					handleRequest={handleRequest}
				/>
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
	upRightRef: PropTypes.object,
	upLeftRef: PropTypes.object,
	downLeftRef: PropTypes.object,
	downRightRef: PropTypes.object,
};

CustomizedIconButton.propTypes = {
	connectionStatus: PropTypes.string,
	icon: PropTypes.element,
	direction: PropTypes.string,
	handleRequest: PropTypes.func,
	buttonRef: PropTypes.object,
};

export default KeyboardController;
