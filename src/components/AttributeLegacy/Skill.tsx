import * as React from 'react'
import { connect } from 'react-redux'
import { STATIC_SERVER } from '@src/utils/constants'

import ImageLoader from '@components/ImageLoader'
import T from '@components/T'

import { RootState } from '@store'
import { selectors as intlSelectors } from '@store/Intl'
import { selectors as resourceSelectors } from '@store/Resources'

import style from './styles/Skill.css'
import Join from './Join'

interface PropsFromStore {
	resource: ReturnType<typeof resourceSelectors.getResource>['skill']
	locale: ReturnType<typeof intlSelectors.getLocale>
}

interface Props extends PropsFromStore {
	skillName: string
	noIcon?: boolean
	defaultElement: string
}

const Skill: React.SFC<Props> = props => {
	const { skillName, noIcon, resource, locale, defaultElement } = props

	const skillQuery = skillName.split(/ +/)
	const element = skillQuery[1] && isNaN(parseInt(skillQuery[1], 10)) && (
		<T id={['general', 'element_types', skillQuery[1].toUpperCase()]} />
	)
	const moves = skillQuery
		.slice(element ? 2 : 1)
		.map((move, i) => (
			<T key={i} id={['skill', 'general', parseInt(move, 10) > 3 ? 'move_hm' : 'move']} values={{ move }} />
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
		resource: resourceSelectors.getResource(state).skill,
		locale: intlSelectors.getLocale(state)
	}
}

export default connect(mapStateToProps)(React.memo(Skill))
