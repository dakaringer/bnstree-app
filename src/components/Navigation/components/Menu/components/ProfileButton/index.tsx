import * as React from 'react'
import { connect } from 'react-redux'

import { LinkObject } from '@components/Navigation/links'
import UserButton from './components/UserButton'
import LoginButton from './components/LoginButton'

import { RootState } from '@store/rootReducer'
import { getData } from '@store/User/selectors'

interface PropsFromStore {
	userData: ReturnType<typeof getData>
}

interface Props extends PropsFromStore {
	onSelect: (linkObject: LinkObject) => void
}

const ProfileButton: React.SFC<Props> = props => {
	const { userData, onSelect } = props
	return (
		<>{userData ? <UserButton userData={userData} onSelect={onSelect} /> : <LoginButton onSelect={onSelect} />}</>
	)
}

const mapStateToProps = (state: RootState) => {
	return {
		userData: getData(state)
	}
}

export default connect(mapStateToProps)(React.memo(ProfileButton))
