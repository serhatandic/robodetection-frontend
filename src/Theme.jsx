// theme.js
import { createTheme } from '@mui/material';

const theme = createTheme({
	palette: {
		primary: {
			main: '#000',
			light: '#E9DB5D',
			dark: '#A29415',
			contrastText: '#fff',
		},
		// secondary is red for mission critical actions
		secondary: {
			main: '#f44336',
			light: '#ff7961',
			dark: '#ba000d',
			contrastText: '#fff',
		},
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					'&:hover': {
						backgroundColor: '#333',
						color: '#fff',
					},
				},
				// for secondary variant
				containedSecondary: {
					'&:hover': {
						backgroundColor: '#ba000d',
					},
				},
			},
		},
	},
});

export default theme;
