import * as React from 'react'
import { Dialog, Popper, Paper, Fade, Typography, ButtonBase } from '@material-ui/core'

import ImageLoader from '@components/ImageLoader'

import { Target, Tooltip, TooltipTitle, TooltipMainSection, TooltipSection, ExtraContainer } from './style'

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
	touchTimeout: NodeJS.Timeout | null
}

class HoverTooltip extends React.PureComponent<Props, State> {
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

		const tooltip = (
			<Tooltip className={className}>
				<TooltipTitle>{title}</TooltipTitle>
				{(m1 || m2 || icon) && (
					<TooltipMainSection>
						{icon && <ImageLoader src={icon} />}
						<div>
							<Typography variant="body2" color="inherit">
								{m1}
							</Typography>
							<Typography variant="caption" color="inherit">
								{m2}
							</Typography>
						</div>
					</TooltipMainSection>
				)}
				{sub && (
					<TooltipSection>
						<Typography variant="caption" color="inherit">
							{sub}
						</Typography>
					</TooltipSection>
				)}
				<ExtraContainer>{extra}</ExtraContainer>
			</Tooltip>
		)

		return (
			<>
				<Target
					ref={this.ref}
					onTouchEnd={this.openModal}
					onPointerEnter={this.openTooltip}
					onPointerLeave={() => this.setState({ tooltipOpen: false })}
					onContextMenu={event => {
						event.preventDefault()
						event.stopPropagation()
					}}>
					<ButtonBase>{target}</ButtonBase>
				</Target>
				<Popper
					open={tooltipOpen}
					anchorEl={this.ref.current}
					placement="bottom-start"
					onPointerEnter={this.openTooltip}
					onPointerLeave={() => this.setState({ tooltipOpen: false })}
					modifiers={{
						offset: { offset: offset || 0 },
						computeStyle: { gpuAcceleration: false }
					}}>
					{() => (
						<Fade in={tooltipOpen} unmountOnExit>
							<Paper>{tooltip}</Paper>
						</Fade>
					)}
				</Popper>
				<Dialog open={dialogOpen} onClose={() => this.setState({ dialogOpen: false })}>
					{tooltip}
				</Dialog>
			</>
		)
	}
}

export default HoverTooltip
