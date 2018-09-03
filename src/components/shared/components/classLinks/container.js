import React from 'react'
import {connect} from 'react-redux'
import {Map} from 'immutable'

import NavLink from '../../navLink'
import classImages from './classImg'

import './styles/classLinks.scss'

import {
    jobTextSelector,
    uiTextSelector
} from './selector'

const mapStateToProps = (state) => {
    return {
        classNames: jobTextSelector(state),
        uiText: uiTextSelector(state).get('GENERAL_NAV', Map())
    }
}

class ClassLinks extends React.Component {
    render() {
        let classLinks = []
        this.props.classNames.forEach(val => classLinks.push(<NavLink key={val.id} to={`/tree/${val.id}`}><img src={classImages[val.id]}/>{val.name}</NavLink>))

        return (
            <div className='classLinks'>
                <div className='classLinksContainer'>
                    {classLinks}
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, null, null, {
    pure: false
})(ClassLinks)
