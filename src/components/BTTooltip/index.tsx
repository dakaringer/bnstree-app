import * as React from 'react'
import { Popper, Paper, Fade, Typography, ClickAwayListener, withWidth } from '@material-ui/core'
import { WithWidth, isWidthDown } from '@material-ui/core/withWidth'
import * as classNames from 'classnames'
import ImageLoader from '@src/components/ImageLoader'

import * as style from './styles/index.css'

interface Props extends WithWidth {
	icon: any
	title: React.ReactNode
	m1?: React.ReactNode | React.ReactNode[]
	m2?: React.ReactNode | React.ReactNode[]
	sub?: React.ReactNode | React.ReactNode[]
	extra?: React.ReactNode | React.ReactNode[]
	target: React.ReactElement<any>
	className?: string
}

interface State {
	isOpen: boolean
	anchor: HTMLDivElement | undefined
}

interface BTTooltip {
	ref: React.RefObject<HTMLDivElement>
}

class BTTooltip extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props)
		this.ref = React.createRef()
		this.state = {
			isOpen: false,
			anchor: undefined
		}
	}

	componentDidMount() {
		if (this.ref.current) {
			this.setState({ anchor: this.ref.current })
		}
	}

	open = () => {
		this.setState({
			isOpen: true
		})
	}

	close = () => {
		this.setState({
			isOpen: false
		})
	}

	render() {
		const { icon, title, m1, m2, sub, extra, target, className, width } = this.props
		const { isOpen, anchor } = this.state

		return (
			<ClickAwayListener onClickAway={isOpen ? () => this.close() : () => null} mouseEvent={false}>
				<>
					<div
						ref={this.ref}
						onPointerDown={this.open}
						onPointerEnter={this.open}
						onPointerLeave={this.close}
						onContextMenu={event => event.preventDefault()}
						style={{ userSelect: 'none', touchAction: 'none' }}>
						{target}
					</div>
					<Popper
						open={isOpen}
						anchorEl={anchor}
						placement="bottom-start"
						popperOptions={{ preventOverflow: { padding: isWidthDown('xs', width) ? 10 : 23 } }}
						className={style.popper}
						onPointerEnter={this.open}
						onPointerLeave={this.close}>
						{() => (
							<Fade in={isOpen}>
								<Paper className={classNames(style.tooltip, className)}>
									<div className={style.title}>{title}</div>
									<div className={style.main}>
										<ImageLoader src={icon} className={style.icon} />
										<div className={style.mainText}>
											<Typography
												variant={isWidthDown('xs', width) ? 'body1' : 'subheading'}
												color="inherit">
												{m1}
											</Typography>
											<Typography variant="caption" color="inherit">
												{m2}
											</Typography>
										</div>
									</div>
									<Typography variant="caption" color="inherit" className={style.sub}>
										{sub}
									</Typography>
									{extra}
								</Paper>
							</Fade>
						)}
					</Popper>
				</>
			</ClickAwayListener>
		)
	}
}

export default withWidth()(BTTooltip)
