import { createMuiTheme } from '@material-ui/core/styles'
import { blue, amber } from '@material-ui/core/colors'
import * as styles from '@material-ui/styles'

export const useTheme = () => styles.useTheme<typeof muiTheme>()

export const muiTheme = createMuiTheme({
	breakpoints: {
		values: {
			xs: 0,
			sm: 650,
			md: 960,
			lg: 1280,
			xl: 1600
		}
	},
	palette: {
		type: 'dark',
		primary: blue,
		secondary: amber,
		background: {
			paper: 'rgba(3, 3, 3, 0.9)'
		}
	},
	typography: {
		useNextVariants: true,
		htmlFontSize: 10,
		fontFamily: "'Open Sans', sans-serif",
		fontWeightLight: 400,
		allVariants: {
			textTransform: 'initial'
		},
		button: {
			fontWeight: 'normal',
			textTransform: 'uppercase'
		},
		overline: {
			textTransform: 'uppercase'
		}
	},
	props: {
		MuiSelect: {
			MenuProps: {
				PaperProps: {
					square: true
				}
			}
		},
		MuiMenu: {
			anchorOrigin: {
				vertical: 'bottom',
				horizontal: 'left'
			},
			transformOrigin: {
				vertical: 'top',
				horizontal: 'left'
			},
			getContentAnchorEl: undefined,
			disableAutoFocusItem: true
		},
		MuiDialog: {
			fullWidth: true
		}
	},
	overrides: {
		MuiPaper: {
			rounded: {
				borderRadius: '0.5rem',
				overflow: 'hidden'
			}
		},
		MuiList: {
			padding: {
				paddingTop: 0,
				paddingBottom: 0
			}
		},
		MuiDivider: {
			root: {
				margin: '2rem 0'
			}
		},
		MuiDialog: {
			paper: {
				margin: '1rem'
			}
		},
		MuiTooltip: {
			popperInteractive: {
				['& > div']: {
					padding: 0,
					maxWidth: 'none'
				}
			},
			tooltip: {
				backgroundColor: '#000000'
			}
		},
		MuiIconButton: {
			root: {
				padding: '0.5rem'
			}
		}
	}
})

export const styledTheme = {
	palette: {
		primary: muiTheme.palette.primary.main,
		secondary: muiTheme.palette.secondary.main,
		grey: muiTheme.palette.grey[900],
		disabled: muiTheme.palette.text.disabled,
		textPrimary: muiTheme.palette.text.primary,
		textSecondary: muiTheme.palette.text.secondary,
		blackGlass: 'rgba(3, 3, 3, 0.9)',
		greyGlass: 'rgba(15, 15, 15, 0.9)'
	},
	navbarHeight: '7rem'
}
