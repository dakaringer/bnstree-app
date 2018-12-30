import * as React from 'react'
import { Dialog, Popper, Paper, Fade, Typography, withWidth } from '@material-ui/core'
import { WithWidth, isWidthDown } from '@material-ui/core/withWidth'
import classNames from 'classnames'
import compose from '@src/utils/compose'
import ImageLoader from '@src/components/ImageLoader'

import * as style from './styles/index.css'

interface SelfProps {
	icon: any
	title: React.ReactNode
	m1?: React.ReactNode | React.ReactNode[]
	m2?: React.ReactNode | React.ReactNode[]
	sub?: React.ReactNode | React.ReactNode[]
	extra?: React.ReactNode | React.ReactNode[]
	target: React.ReactElement<any>
	className?: string
}

interface Props extends SelfProps, WithWidth {}

interface State {
	tooltipOpen: boolean
	dialogOpen: boolean
	anchor: HTMLDivElement | undefined
	touchTimeout: NodeJS.Timer | null
}

interface BTTooltip {
	ref: React.RefObject<HTMLDivElement>
}

class BTTooltip extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props)
		this.ref = React.createRef()
		this.state = {
			tooltipOpen: false,
			dialogOpen: false,
			anchor: undefined,
			touchTimeout: null
		}
	}

	openTooltip = (event: React.PointerEvent) => {
		if (event.pointerType === 'mouse') {
			this.setState({ tooltipOpen: true })
		}
	}

	openModal = () => {
		this.setState({ touchTimeout: setTimeout(() => this.setState({ dialogOpen: true }), 200) })
	}

	render() {
		const { icon, title, m1, m2, sub, extra, target, className, width } = this.props
		const { tooltipOpen, dialogOpen } = this.state

		const tooltipContent = (
			<>
				<div className={style.title}>{title}</div>
				<div className={style.main}>
					<ImageLoader src={icon} className={style.icon} />
					<div className={style.mainText}>
						<Typography variant={isWidthDown('xs', width) ? 'body2' : 'subtitle1'} color="inherit">
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
			</>
		)

		return (
			<>
				<div
					ref={this.ref}
					onTouchEnd={this.openModal}
					onPointerEnter={this.openTooltip}
					onPointerLeave={() => this.setState({ tooltipOpen: false })}
					onContextMenu={event => {
						event.preventDefault()
						event.stopPropagation()
					}}
					className={style.target}>
					{target}
				</div>
				<Dialog
					open={dialogOpen}
					onClose={() => this.setState({ dialogOpen: false })}
					classes={{ paper: classNames(style.tooltip, className) }}>
					<div>{tooltipContent}</div>
				</Dialog>
				<Popper
					open={tooltipOpen}
					anchorEl={this.ref.current}
					placement="bottom-start"
					popperOptions={{ preventOverflow: { padding: isWidthDown('xs', width) ? 10 : 23 } }}
					className={style.popper}
					onPointerEnter={this.openTooltip}
					onPointerLeave={() => this.setState({ tooltipOpen: false })}>
					{() => (
						<Fade in={tooltipOpen} unmountOnExit>
							<Paper className={classNames(style.tooltip, className)}>{tooltipContent}</Paper>
						</Fade>
					)}
				</Popper>
			</>
		)
	}
}

export default compose<Props, SelfProps>(withWidth())(BTTooltip)
