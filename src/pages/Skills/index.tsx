import * as React from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import { Button } from '@material-ui/core'
import FadeContainer from '@src/components/FadeContainer'
import T from '@src/components/T'

import { RootState } from '@src/store/rootReducer'
import { ClassCode } from '@src/store/constants'
import SkillActions from '@src/store/Skills/actions'
import { getSkillPreferences, getIsLoading } from '@src/store/Skills/selectors'
import UserActions from '@src/store/User/actions'

import { classes } from '@src/constants'
import PageContainer from '@src/components/PageContainer'
import SkillActionBar from '@src/components/SkillActionBar'
import SkillList from '@src/components/SkillList'
import TraitList from '@src/components/TraitList'

import style from './styles/index.css'

interface PropsFromStore {
	skillPreferences: ReturnType<typeof getSkillPreferences>
	isLoading: ReturnType<typeof getIsLoading>
}

interface PropsFromDispatch {
	loadClass: typeof SkillActions.loadData
	updatePreferences: typeof UserActions.updatePreferences
}

interface Props extends PropsFromStore, PropsFromDispatch, RouteComponentProps<{ className: string }> {}

class SkillPage extends React.PureComponent<Props> {
	constructor(props: Props) {
		super(props)
		const { match, loadClass } = props

		const classLink = classes.find(c => c.link === match.params.className)
		const classCode = classLink && (classLink.classCode as ClassCode)

		if (classCode) loadClass(classCode)
	}

	componentDidUpdate = (prevProps: Props) => {
		const { match, loadClass } = this.props

		const classLink = classes.find(c => c.link === match.params.className)
		const prevClassLink = classes.find(c => c.link === prevProps.match.params.className)
		const classCode = classLink && (classLink.classCode as ClassCode)
		const prevClassCode = prevClassLink && (prevClassLink.classCode as ClassCode)

		if (classCode && classCode !== prevClassCode) {
			loadClass(classCode)
		}
	}

	render = () => {
		const { match, skillPreferences, isLoading, updatePreferences } = this.props

		const classLink = classes.find(c => c.link === match.params.className)
		const classCode = classLink && (classLink.classCode as ClassCode)

		if (!classCode) return null

		const specialization = skillPreferences.specialization[classCode]
		const mode = skillPreferences.mode

		return (
			<PageContainer isLoading={isLoading} topNav={<SkillActionBar />} className={style.skill}>
				<div className={style.modes}>
					<Button
						variant="outlined"
						size="small"
						color={mode === 'TRAITS' ? 'primary' : 'default'}
						onClick={() => updatePreferences({ skills: { mode: 'TRAITS' } })}>
						<T id="skill.navigation.traits" />
					</Button>
					<Button
						variant="outlined"
						size="small"
						color={mode === 'LIST' ? 'primary' : 'default'}
						onClick={() => updatePreferences({ skills: { mode: 'LIST' } })}>
						<T id="skill.navigation.skills" />
					</Button>
				</div>
				<FadeContainer currentKey={`${classCode}-${specialization}-${mode}`}>
					{mode === 'TRAITS' && <TraitList />}
					{mode === 'LIST' && <SkillList />}
				</FadeContainer>
			</PageContainer>
		)
	}
}

const mapStateToProps = (state: RootState) => {
	return {
		skillPreferences: getSkillPreferences(state),
		isLoading: getIsLoading(state)
	}
}

const mapDispatchToProps = (dispatch: Dispatch) =>
	bindActionCreators(
		{
			loadClass: SkillActions.loadData,
			updatePreferences: UserActions.updatePreferences
		},
		dispatch
	)

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SkillPage)
