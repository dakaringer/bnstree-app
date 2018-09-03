import { createMuiTheme } from '@material-ui/core/styles'
import { blue, amber } from '@material-ui/core/colors'

export default createMuiTheme({
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
			paper: 'rgba(3, 3, 3, 0.85)'
		}
	},
	typography: {
		htmlFontSize: 10,
		fontFamily: "'Open Sans', sans-serif",
		fontWeightMedium: 600,
		title: {
			fontWeight: 'normal'
		},
		body1: {
			color: 'rgba(255, 255, 255, 0.9)'
		},
		button: {
			fontWeight: 'normal'
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
			getContentAnchorEl: undefined
		},
		MuiPopover: {
			anchorOrigin: {
				vertical: 'bottom',
				horizontal: 'left'
			},
			transformOrigin: {
				vertical: 'top',
				horizontal: 'left'
			},
			marginThreshold: 5
		},
		MuiButtonBase: {
			onContextMenu: event => event.preventDefault()
		}
	},
	overrides: {
		MuiPaper: {
			rounded: {
				borderRadius: '0.5rem'
			}
		},
		MuiPopover: {
			paper: {
				background: 'rgba(8, 8, 8, 0.9)',
				marginTop: '0.3rem'
			}
		},
		MuiDialog: {
			paper: {
				background: 'rgba(8, 8, 8, 0.9)'
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
		MuiExpansionPanelSummary: {
			root: {
				minHeight: '4rem'
			}
		},
		MuiDialogTitle: {
			root: {
				display: 'flex',
				alignItems: 'baseline',
				paddingRight: '8rem'
			}
		},
		MuiFormControlLabel: {
			root: {
				marginLeft: 0
			}
		}
	}
})
