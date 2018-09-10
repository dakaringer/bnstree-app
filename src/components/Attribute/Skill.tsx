import * as React from 'react'
import { connect } from 'react-redux'
import ImageLoader from '@src/components/ImageLoader'
import T from '@src/components/T'

import { RootState } from '@src/store/rootReducer'
import { getLocale } from '@src/store/Intl/selectors'
import { getResource } from '@src/store/Resources/selectors'

import * as style from './styles/Skill.css'
import { STATIC_SERVER } from '@src/constants'
import Join from './Join'

interface PropsFromStore {
	resource: ReturnType<typeof getResource>['skill']
	locale: ReturnType<typeof getLocale>
}

interface Props extends PropsFromStore {
	skillName: string
	noIcon?: boolean
	defaultElement: string
}

const Skill: React.SFC<Props> = props => {
	const { skillName, noIcon, resource, locale, defaultElement } = props

	const skillQuery = skillName.split(/ +/)
	const element = skillQuery[1] &&
		isNaN(parseInt(skillQuery[1])) && <T id={['general', 'element_types', skillQuery[1].toUpperCase()]} />
	const moves = skillQuery
		.slice(element ? 2 : 1)
		.map((move, i) => (
			<T key={i} id={['skill', 'general', parseInt(move) > 3 ? 'move_hm' : 'move']} values={{ move }} />
		))
	const suffix =
		element || moves.length > 0 ? (
			<>
				{' '}
				({element}
				{element && moves.length > 0 && ' '}
				{Join(moves)})
			</>
		) : null

	const nameData = resource[skillQuery[0]] || resource[`${skillQuery[0]}-${defaultElement.toLocaleLowerCase()}`]
	if (!nameData) {
		console.error(`[BnSTree] Missing skill name data: "${skillQuery[0]}"`)
		return null
	}

	return (
		<span>
			<span className={style.skill}>
				{!noIcon && <ImageLoader src={`${STATIC_SERVER}/images/skills/${nameData.icon}`} />}
				{nameData.name[locale]}
			</span>
			{suffix}
		</span>
	)
}

const mapStateToProps = (state: RootState) => {
	return {
		resource: getResource(state).skill,
		locale: getLocale(state)
	}
}

export default connect(mapStateToProps)(Skill)
