import * as React from 'react'
import { Dialog, Popper, Paper, Fade, Typography } from '@material-ui/core'
import classNames from 'classnames'
import ImageLoader from '@src/components/ImageLoader'

import * as style from './styles/index.css'

interface Props {
	icon?: any
	title: React.ReactNode
	m1?: React.ReactNode | React.ReactNode[]
	m2?: React.ReactNode | React.ReactNode[]
	sub?: React.ReactNode | React.ReactNode[]
	extra?: React.ReactNode | React.ReactNode[]
	target: React.ReactElement<any>
	className?: string
	offset?: number | string
}

interface State {
	tooltipOpen: boolean
	dialogOpen: boolean
	anchor: HTMLDivElement | undefined
	touchTimeout: number | null
}

class BTTooltip extends React.PureComponent<Props, State> {
	state: State = {
		tooltipOpen: false,
		dialogOpen: false,
		anchor: undefined,
		touchTimeout: null
	}
	ref: React.RefObject<HTMLDivElement> = React.createRef()

	openTooltip = (event: React.PointerEvent) => {
		if (event.pointerType === 'mouse') {
			this.setState({ tooltipOpen: true })
		}
	}

	openModal = () => {
		this.setState({ touchTimeout: setTimeout(() => this.setState({ dialogOpen: true }), 200) })
	}

	render = () => {
		const { icon, title, m1, m2, sub, extra, target, className, offset } = this.props
		const { tooltipOpen, dialogOpen } = this.state

		const tooltipContent = (
			<>
				<div className={style.title}>{title}</div>
				{(m1 || m2 || icon) && (
					<div className={style.main}>
						{icon && <ImageLoader src={icon} className={style.icon} />}
						<div className={style.mainText}>
							<Typography variant="body2" color="inherit">
								{m1}
							</Typography>
							<Typography variant="caption" color="inherit">
								{m2}
							</Typography>
						</div>
					</div>
				)}
				{sub && (
					<Typography variant="caption" color="inherit" className={style.sub}>
						{sub}
					</Typography>
				)}
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
					className={style.popper}
					onPointerEnter={this.openTooltip}
					onPointerLeave={() => this.setState({ tooltipOpen: false })}
					modifiers={{
						offset: { offset: offset || 0 },
						computeStyle: { gpuAcceleration: false },
						preventOverflow: { padding: 0 }
					}}>
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

export default BTTooltip
