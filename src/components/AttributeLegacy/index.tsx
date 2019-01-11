import * as React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import T from '@src/components/T'
import ImageLoader from '@src/components/ImageLoader'
import { ArrowRight } from '@material-ui/icons'

import { RootState } from '@src/store/rootReducer'
import { SkillElement } from '@src/store/constants'
import { SkillAttribute } from '@src/store/SkillsLegacy/types'
import { getSkillPreferences } from '@src/store/SkillsLegacy/selectors'

import style from './styles/index.css'
import elementIcons from './images/elementIcons'
import { STATIC_SERVER } from '@src/constants'
import Skill from './Skill'
import Join from './Join'

interface PropsFromStore {
	skillPreferences: ReturnType<typeof getSkillPreferences>
}

export interface SelfProps {
	attribute: SkillAttribute
	moddedAttribute?: SkillAttribute
	flag?: 'add' | 'mod' | 'del'
	defaultElement: SkillElement
	defaultIcon?: string
}

interface Props extends SelfProps, PropsFromStore {}

const Attribute: React.SFC<Props> = props => {
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
					<span>
						{bottom} ~ {top}{' '}
						<span className={style.scale}>
							[<T id="tooltip.general.scale" values={{ scale: scaleTxt }} />]
						</span>
					</span>
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
					values[k] = <>{Join(list)}</>
				} else {
					values[k] = <Skill skillName={value} noIcon={noIcon} defaultElement={defaultElement || ''} />
				}
				break
			}
			case 'effect': {
				if (Array.isArray(value)) {
					const list = value.map(v => (
						<span className={style.skill} key={v}>
							<T id={['tooltip', 'effect_type', v]} />
						</span>
					))
					values[k] = <>{Join(list)}</>
				} else {
					values[k] = (
						<span className={style.skill}>
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
						values[k] = <>{Join(list)}</>
					} else if (typeof value === 'string') {
						values[k] = <T id={['tooltip', `${keys[0]}_type`, value]} />
					}
				}
			}
		}
	})

	return (
		<span className={classNames(style.attribute, flag && [style[flag]])}>
			{(attribute.icon || defaultIcon) && (
				<ImageLoader src={`${STATIC_SERVER}/images/skills/${attribute.icon || defaultIcon}`} />
			)}
			<T id={['tooltip', attribute.msg]} values={values} />
			{values.element && <ImageLoader src={elementIcons[element]} className={style.element} />}
		</span>
	)
}

const mapStateToProps = (state: RootState) => {
	return {
		skillPreferences: getSkillPreferences(state)
	}
}

export default connect(mapStateToProps)(React.memo(Attribute))
