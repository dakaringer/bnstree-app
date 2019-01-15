import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'

import FadeContainer from '@components/FadeContainer'
import PageContainer from '@components/PageContainer'
import SkillActionBar from '@components/SkillActionBarLegacy'
import SkillList from '@components/SkillListLegacy'

import { RootState } from '@store/rootReducer'
import { ClassCodeLegacy as ClassCode } from '@store/constants'
import { getSkillPreferences, getIsLoading } from '@store/SkillsLegacy/selectors'

import { classes } from '@src/utils/constants'

interface PropsFromStore {
	skillPreferences: ReturnType<typeof getSkillPreferences>
	isLoading: ReturnType<typeof getIsLoading>
}

interface Props extends PropsFromStore, RouteComponentProps<{ className: string }> {}

const SkillPage: React.SFC<Props> = props => {
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
				<SkillList
					classCode={classCode}
					element={element}
					buildData={skillPreferences.build[classCode][element]}
				/>
			</FadeContainer>
		</PageContainer>
	)
}

const mapStateToProps = (state: RootState) => {
	return {
		skillPreferences: getSkillPreferences(state),
		isLoading: getIsLoading(state)
	}
}

export default connect(mapStateToProps)(React.memo(SkillPage))
