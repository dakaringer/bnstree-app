import React, { useEffect } from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { Typography } from '@material-ui/core'

import T from '@components/T'
import SkillListElement from './SkillListElementLegacy'

import { RootState, ClassCodeLegacy } from '@store'
import { selectors as skillSelectors, actions as skillActions } from '@store/SkillsLegacy'

import { SkillListContainer, SkillListGroup } from './style'
import comparators from './comparators'

interface PropsFromStore {
	skillData: ReturnType<typeof skillSelectors.getFilteredSkills>
	element: ReturnType<typeof skillSelectors.getElement>
}

interface PropsFromDispatch {
	loadClass: typeof skillActions.loadData
}

interface Props extends PropsFromStore, PropsFromDispatch {
	classCode: ClassCodeLegacy
	buildData: { [id: string]: number } | undefined
	readonly?: boolean
}

const SkillList: React.FC<Props> = props => {
	const { classCode, skillData, element, buildData, readonly, loadClass } = props

	useEffect(() => {
		loadClass(classCode)
	}, [classCode])

	return (
		<SkillListContainer>
			{Object.keys(skillData)
				.sort(comparators.LEVEL)
				.map(group => {
					const groupData = skillData[group]
					if (!groupData) {
						return
					}
					return (
						<SkillListGroup key={group}>
							<Typography variant="subtitle1">
								<T id={['skill', 'group_label', 'level']} values={{ level: group }} />
							</Typography>
							<div>
								{groupData.map(skill => (
									<SkillListElement
										key={skill._id}
										skillData={skill}
										currentMove={(buildData && buildData[skill._id]) || 1}
										classCode={classCode}
										element={element}
										showHotkey
										readonly={!!readonly}
									/>
								))}
							</div>
						</SkillListGroup>
					)
				})}
		</SkillListContainer>
	)
}

const mapStateToProps = (state: RootState, props: { readonly?: boolean }) => ({
	skillData: skillSelectors.getFilteredSkills(state, props),
	element: skillSelectors.getElement(state)
})

const mapDispatchToProps = (dispatch: Dispatch) =>
	bindActionCreators(
		{
			loadClass: skillActions.loadData
		},
		dispatch
	)

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SkillList)
