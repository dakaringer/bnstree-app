import React from 'react'
import { Tooltip, Paper, Typography, ButtonBase } from '@material-ui/core'
import { IS_DEV } from '@utils/constants'

import ImageLoader from '@components/ImageLoader'

import {
	Target,
	TooltipContent,
	TooltipTitle,
	TooltipMainSection,
	TooltipSection,
	ExtraContainer,
	TooltipStyle
} from './style'

interface Props {
	icon?: string | React.ReactNode
	title: React.ReactNode
	m1?: React.ReactNode | React.ReactNode[]
	m2?: React.ReactNode | React.ReactNode[]
	sub?: React.ReactNode | React.ReactNode[]
	extra?: React.ReactNode | React.ReactNode[]
	target: React.ReactElement<any>
	className?: string
	button?: boolean
}

const HoverTooltip: React.FC<Props> = props => {
	const { icon, title, m1, m2, sub, extra, target, className, button } = props

	const tooltip = (
		<TooltipContent
			className={className}
			onContextMenu={event => {
				if (!IS_DEV) {
					event.preventDefault()
					event.stopPropagation()
				}
			}}>
			<TooltipTitle>{title}</TooltipTitle>
			{(m1 || m2 || icon) && (
				<TooltipMainSection>
					{icon && (
						<span className="icon">{typeof icon === 'string' ? <ImageLoader src={icon} /> : icon}</span>
					)}
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
		</TooltipContent>
	)

	return (
		<>
			<TooltipStyle />
			<Tooltip
				title={<Paper>{tooltip}</Paper>}
				placement="right-start"
				classes={{ tooltip: 'hover-tooltip' }}
				enterDelay={200}
				leaveDelay={200}
				enterTouchDelay={500}
				leaveTouchDelay={99999}
				PopperProps={{
					modifiers: {
						preventOverflow: {
							boundariesElement: 'viewport'
						}
					}
				}}
				interactive>
				<Target
					onContextMenu={event => {
						event.preventDefault()
						event.stopPropagation()
					}}>
					{button ? <ButtonBase>{target}</ButtonBase> : target}
				</Target>
			</Tooltip>
		</>
	)
}

export default HoverTooltip
