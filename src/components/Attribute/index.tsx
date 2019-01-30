import React from 'react'
import { connect } from 'react-redux'
import { Typography } from '@material-ui/core'
import { ArrowRight } from '@material-ui/icons'
import { STATIC_SERVER } from '@utils/constants'
import { getNameData } from '@utils/helpers'

import T from '@components/T'
import ImageLoader from '@components/ImageLoader'
import SkillName from '@components/SkillName'

import { RootState } from '@store'
import { selectors, SkillAttribute } from '@store/Skills'

import { AttributeContainer } from './style'
import powerIcon from './images/skill_attack_power.png'

interface PropsFromStore {
	skillPreferences: ReturnType<typeof selectors.getSkillPreferences>
}

interface Props extends PropsFromStore {
	attribute: SkillAttribute
	moddedAttribute?: SkillAttribute
	flag?: 'add' | 'mod' | 'del'
	defaultIcon?: string
}

const join = (list: React.ReactNode[], sep: string = ', ') => {
	return list.reduce(
		(acc: React.ReactNode[], cur) => (acc.length === 0 ? acc.concat([cur]) : acc.concat([sep, cur])),
		[]
	)
}

const Attribute: React.FC<Props> = props => {
	const { attribute, moddedAttribute, flag, defaultIcon, skillPreferences } = props
	const values: { [key: string]: any } = attribute.values ? { ...attribute.values } : {}

	values.additional = values.additional && <T id="tooltip.general.additional" />
	values.element = null

	Object.keys(values).forEach(k => {
		const keys = k.split('-')
		const value = values[k]

		switch (keys[0]) {
			case 'scale': {
				const ap = values.pet ? skillPreferences.stats.apPet : skillPreferences.stats.ap
				const ad = skillPreferences.stats.ad
				const c = skillPreferences.stats.c
				const power = (values.powered && skillPreferences.stats.power) || 100
				const multiplyer = 1 * (power / 100)

				const scale = value
				const bottomScale = Array.isArray(scale) ? scale[0] : scale
				const topScale = Array.isArray(scale) ? scale[1] : scale

				const bottom = Math.round(Math.round((ap - c) * bottomScale) * multiplyer + ad)
				const top = Math.round(Math.round((ap + c) * topScale) * multiplyer + ad)

				let scaleTxt = Array.isArray(scale)
					? `${bottomScale.toFixed(2)} ~ ${topScale.toFixed(2)}`
					: scale.toFixed(2)
				if (multiplyer !== 1) {
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
					const list = value.map(v => {
						const nameData = getNameData(v, 'skill')
						return nameData && <SkillName key={v} name={nameData.name} icon={!noIcon && nameData.icon} />
					})
					values[k] = <>{join(list)}</>
				} else {
					const nameData = getNameData(value, 'skill')
					values[k] = nameData && <SkillName name={nameData.name} icon={!noIcon && nameData.icon} />
				}
				break
			}
			case 'effect': {
				if (Array.isArray(value)) {
					const list = value.map(v => <SkillName key={v} name={<T id={['tooltip', 'effect_type', v]} />} />)
					values[k] = <>{join(list)}</>
				} else {
					values[k] = <SkillName name={<T id={['tooltip', 'effect_type', value]} />} />
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
						values[k] = <>{join(list)}</>
					} else if (typeof value === 'string' && keys[0] !== 'value') {
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
			{values.powered && <ImageLoader src={powerIcon} />}
		</AttributeContainer>
	)
}

const mapStateToProps = (state: RootState) => {
	return {
		skillPreferences: selectors.getSkillPreferences(state)
	}
}

export default connect(mapStateToProps)(Attribute)
