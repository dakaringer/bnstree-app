import React from 'react'
import { connect } from 'react-redux'
import { Typography } from '@material-ui/core'
import { ArrowRight } from '@material-ui/icons'
import { STATIC_SERVER } from '@utils/constants'

import Skill from './Skill'

import T from '@components/T'
import ImageLoader from '@components/ImageLoader'

import { RootState, SkillElement } from '@store'
import { selectors as skillSelectors, SkillAttribute } from '@store/SkillsLegacy'

import { AttributeContainer } from './style'
import elementIcons from './images/elementIcons'

const joinList = (list: React.ReactNode[], sep: string = ', ') => {
	return list.reduce((acc: any[], cur) => (acc.length === 0 ? acc.concat([cur]) : acc.concat([sep, cur])), [])
}

interface PropsFromStore {
	skillPreferences: ReturnType<typeof skillSelectors.getSkillPreferences>
}

interface SelfProps {
	attribute: SkillAttribute
	moddedAttribute?: SkillAttribute
	flag?: 'add' | 'mod' | 'del'
	defaultElement: SkillElement
	defaultIcon?: string
}

interface Props extends SelfProps, PropsFromStore {}

const Attribute: React.FC<Props> = props => {
	const { attribute, moddedAttribute, flag, defaultElement, defaultIcon, skillPreferences } = props
	const values: { [key: string]: any } = attribute.values ? { ...attribute.values } : {}
	const element: SkillElement = values.element && (values.element !== 'default' ? values.element : defaultElement)

	values.additional = values.additional && <T id="tooltip.general.additional" />
	values.element = values.element && <T id={['general', 'element_types', element]} />

	Object.keys(values).forEach(k => {
		const keys = k.split('-')
		const value = values[k]

		switch (keys[0]) {
			case 'scale': {
				const ap = skillPreferences.stats.ap
				const ad = skillPreferences.stats.ad
				const c = skillPreferences.stats.c
				const elementDamage = skillPreferences.stats.elementDamage[element] || 1
				const multiplyer = 1 * elementDamage

				const scale = value
				const bottomScale = Array.isArray(scale) ? scale[0] : scale
				const topScale = Array.isArray(scale) ? scale[1] : scale

				const bottom = Math.round(Math.round((ap - c) * bottomScale) * multiplyer + ad)
				const top = Math.round(Math.round((ap + c) * topScale) * multiplyer + ad)

				let scaleTxt = Array.isArray(scale)
					? `${bottomScale.toFixed(2)} ~ ${topScale.toFixed(2)}`
					: scale.toFixed(2)
				if (multiplyer > 1) {
					scaleTxt += ` × ${multiplyer.toFixed(2)}`
				}

				values[k] = (
					<>
						<Typography variant="inherit" color={multiplyer !== 1 ? 'primary' : 'default'} inline>
							{bottom} ~ {top}{' '}
						</Typography>
						<Typography variant="inherit" color="secondary" inline>
							[
							<T
								id={values.pet ? 'tooltip.general.scalePet' : 'tooltip.general.scale'}
								values={{ scale: scaleTxt }}
							/>
							]
						</Typography>
					</>
				)

				break
			}
			case 'skill':
			case 'skillName': {
				const noIcon = keys[0] === 'skillName'
				if (Array.isArray(value)) {
					const list = value.map(v => (
						<Skill key={v} skillName={v} noIcon={noIcon} defaultElement={defaultElement || ''} />
					))
					values[k] = <>{joinList(list)}</>
				} else {
					values[k] = <Skill skillName={value} noIcon={noIcon} defaultElement={defaultElement || ''} />
				}
				break
			}
			case 'effect': {
				if (Array.isArray(value)) {
					const list = value.map(v => (
						<span className="skill" key={v}>
							<T id={['tooltip', 'effect_type', v]} />
						</span>
					))
					values[k] = <>{joinList(list)}</>
				} else {
					values[k] = (
						<span className="skill">
							<T id={['tooltip', 'effect_type', value]} />
						</span>
					)
				}
				break
			}
			case 'stage': {
				break
			}
			default: {
				if (typeof value === 'number') {
					if (moddedAttribute && moddedAttribute.values) {
						const moddedValue = moddedAttribute.values[keys[0]]
						if (moddedValue !== value) {
							values[k] = (
								<>
									{moddedValue} <ArrowRight /> {value}
								</>
							)
						}
					}
				} else {
					if (Array.isArray(value)) {
						const list = value.map(v => <T key={v} id={['tooltip', `${keys[0]}_type`, v]} />)
						values[k] = <>{joinList(list)}</>
					} else if (typeof value === 'string') {
						values[k] = <T id={['tooltip', `${keys[0]}_type`, value]} />
					}
				}
			}
		}
	})

	return (
		<AttributeContainer flag={flag}>
			{(attribute.icon || defaultIcon) && (
				<ImageLoader src={`${STATIC_SERVER}/images/skills/${attribute.icon || defaultIcon}`} />
			)}
			<T id={['tooltip', attribute.msg]} values={values} />
			{values.element && <ImageLoader src={elementIcons[element]} />}
		</AttributeContainer>
	)
}

const mapStateToProps = (state: RootState) => {
	return {
		skillPreferences: skillSelectors.getSkillPreferences(state)
	}
}

export default connect(mapStateToProps)(Attribute)
