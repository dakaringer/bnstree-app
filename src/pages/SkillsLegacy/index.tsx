import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'

import FadeContainer from '@components/FadeContainer'
import PageContainer from '@components/PageContainer'
import SkillActionBar from '@components/SkillActionBarLegacy'
import SkillList from '@components/SkillListLegacy'

import { RootState, ClassCodeLegacy as ClassCode } from '@store'
import { selectors as skillSelectors } from '@store/SkillsLegacy'

import { classes } from '@utils/constants'

interface PropsFromStore {
	skillPreferences: ReturnType<typeof skillSelectors.getSkillPreferences>
	isLoading: ReturnType<typeof skillSelectors.getIsLoading>
}

interface Props extends PropsFromStore, RouteComponentProps<{ className: string }> {}

const SkillPage: React.FC<Props> = props => {
	const { match, skillPreferences, isLoading } = props

	const classLink = classes.find(c => c.link === match.params.className)
	const classCode = classLink && (classLink.classCode as ClassCode)

	if (!classCode) {
		return null
	}

	const element = skillPreferences.element[classCode]

	return (
		<PageContainer isLoading={isLoading} topNav={<SkillActionBar classCode={classCode} element={element} />}>
			<FadeContainer currentKey={`${classCode}-${element}`}>
				<SkillList classCode={classCode} buildData={skillPreferences.build[classCode][element]} />
			</FadeContainer>
		</PageContainer>
	)
}

const mapStateToProps = (state: RootState) => ({
	skillPreferences: skillSelectors.getSkillPreferences(state),
	isLoading: skillSelectors.getIsLoading(state)
})

export default connect(mapStateToProps)(SkillPage)
