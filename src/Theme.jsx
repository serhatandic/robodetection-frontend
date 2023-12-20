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
			},
		},
	},
});

export default theme;
