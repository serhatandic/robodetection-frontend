/* eslint-disable react/prop-types */
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';

const ImageQualitySelection = ({ imageQuality, handleImageQualityChange }) => {
	return (
		<FormControl
			sx={{
				width: 'fit-content',
			}}
		>
			<InputLabel id='select-label'>Img Quality</InputLabel>
			<Select
				labelId='select-label'
				id='select'
				value={imageQuality}
				label='Img Quality'
				onChange={handleImageQualityChange}
			>
				<MenuItem value={1}>Very Low</MenuItem>
				<MenuItem value={15}>Low</MenuItem>
				<MenuItem value={40}>Medium</MenuItem>
				<MenuItem value={70}>High</MenuItem>
				<MenuItem value={100}>Source</MenuItem>
			</Select>
		</FormControl>
	);
};

export default ImageQualitySelection;
