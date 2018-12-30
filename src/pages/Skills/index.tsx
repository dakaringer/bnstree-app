import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import FadeContainer from '@src/components/FadeContainer'

import { RootState } from '@src/store/rootReducer'
import { ClassCode } from '@src/store/constants'
import { getSkillPreferences, getIsLoading } from '@src/store/Skills/selectors'

import PageContainer from '@src/components/PageContainer'
import SkillActionBar from '@src/components/SkillActionBar'
import SkillList from '@src/components/SkillList'
import { classes } from '@src/components/Navigation/links'

interface PropsFromStore {
	skillPreferences: ReturnType<typeof getSkillPreferences>
	isLoading: ReturnType<typeof getIsLoading>
}

interface Props extends PropsFromStore, RouteComponentProps<{ className: string }> {}

const SkillPage: React.SFC<Props> = props => {
	const { match, skillPreferences, isLoading } = props

	const classLink = classes.find(c => c.link === match.params.className)
	const classCode = classLink && (classLink.classCode as ClassCode)

	if (!classCode) return null

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
