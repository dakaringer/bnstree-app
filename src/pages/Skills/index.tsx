import React, { useEffect } from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import { Button } from '@material-ui/core'
import { useCallback } from '@utils/hooks'
import { IS_DEV, classes } from '@utils/constants'

import T from '@components/T'
import FadeContainer from '@components/FadeContainer'
import PageContainer from '@components/PageContainer'
import SkillActionBar from '@components/SkillActionBar'
import SkillList from '@components/SkillList'
import TraitList from '@components/TraitList'

import { actions as rootActions, RootState, ClassCode } from '@store'
import { selectors as skillSelectors, actions as skillActions } from '@store/Skills'
import { actions as userActions } from '@store/User'

import { ModeSelector } from './style'

interface PropsFromStore {
	skillPreferences: ReturnType<typeof skillSelectors.getSkillPreferences>
	isLoading: ReturnType<typeof skillSelectors.getIsLoading>
}

interface PropsFromDispatch {
	loadClass: typeof skillActions.loadData
	reloadClass: typeof skillActions.reloadData
	reloadData: typeof rootActions.reloadData
	updatePreferences: typeof userActions.updatePreferences
}

interface Props extends PropsFromStore, PropsFromDispatch, RouteComponentProps<{ className: string }> {}

const SkillsPage: React.FC<Props> = props => {
	const { match, skillPreferences, isLoading, updatePreferences, loadClass, reloadClass, reloadData } = props
	const classLink = classes.find(c => c.link === match.params.className)
	const classCode = classLink && (classLink.classCode as ClassCode)

	if (!classCode) {
		return null
	}

	useEffect(() => {
		loadClass(classCode)
	}, [classCode])

	const specialization = skillPreferences.specialization[classCode]
	const mode = skillPreferences.mode

	return (
		<PageContainer isLoading={isLoading} topNav={<SkillActionBar />}>
			<ModeSelector>
				{IS_DEV && (
					<Button
						variant="outlined"
						size="small"
						color="secondary"
						onClick={useCallback(() => {
							reloadData()
							reloadClass()
						})}>
						Refresh
					</Button>
				)}
				<Button
					variant="outlined"
					size="small"
					color={mode === 'TRAITS' ? 'primary' : 'default'}
					onClick={useCallback(() => updatePreferences({ skills: { mode: 'TRAITS' } }))}>
					<T id="skill.navigation.traits" />
				</Button>
				<Button
					variant="outlined"
					size="small"
					color={mode === 'LIST' ? 'primary' : 'default'}
					onClick={useCallback(() => updatePreferences({ skills: { mode: 'LIST' } }))}>
					<T id="skill.navigation.skills" />
				</Button>
			</ModeSelector>
			<FadeContainer currentKey={`${classCode}-${specialization}-${mode}`}>
				{mode === 'TRAITS' && <TraitList />}
				{mode === 'LIST' && <SkillList />}
			</FadeContainer>
		</PageContainer>
	)
}

const mapStateToProps = (state: RootState) => {
	return {
		skillPreferences: skillSelectors.getSkillPreferences(state),
		isLoading: skillSelectors.getIsLoading(state)
	}
}

const mapDispatchToProps = (dispatch: Dispatch) =>
	bindActionCreators(
		{
			loadClass: skillActions.loadData,
			reloadClass: skillActions.reloadData,
			reloadData: rootActions.reloadData,
			updatePreferences: userActions.updatePreferences
		},
		dispatch
	)

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SkillsPage)
