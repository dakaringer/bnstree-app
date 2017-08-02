import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'

import elementImages from '../images/map_elementImg'

//import {userSelector} from '../../../selector'
import {buildElementSelector, searchSelector, viewSelector} from '../selectors'
import {toggleElement, setSearch, updateView} from '../actions'

import SkillSettings from './SkillSettings'

import {Icon, Checkbox} from 'antd'

const mapStateToProps = state => {
    return {
        element: buildElementSelector(state),
        search: searchSelector(state),
        visibility: viewSelector(state).get('visibility', 'ALL')
    }
}

const mapDispatchToProps = dispatch => {
    return {
        toggleElement: () => dispatch(toggleElement()),
        setSearch: value => dispatch(setSearch(value)),
        toggleVisibility: e =>
            dispatch(updateView('visibility', e.target.checked ? 'TRAINABLE' : 'ALL'))
    }
}

const SkillSubMenu = props => {
    const {t, element, toggleElement, search, setSearch, visibility, toggleVisibility} = props

    let clear = search
        ? <Icon onClick={() => setSearch('')} className="clear" type="close" />
        : null

    return (
        <div className="skill-option-bar sub-menu">
            <div className="sub-menu-left">
                <div className="sub-menu-group">
                    <div className="elementToggle sub-menu-item">
                        <a onClick={() => toggleElement()}>
                            <img alt={element} src={elementImages[element]} />
                            <span>
                                {element ? t(`general:${element}`) : ''}{' '}
                                <small>
                                    <Icon type="swap" />
                                </small>
                            </span>
                        </a>
                    </div>
                    <div className="skillSearch sub-menu-item">
                        <input
                            placeholder={t('general:search')}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        {clear}
                    </div>
                </div>
                <div className="skillVisibility sub-menu-item">
                    <Checkbox
                        defaultChecked={false}
                        size="small"
                        onChange={toggleVisibility}
                        checked={visibility === 'TRAINABLE'}>
                        {t('showTrainable')}
                    </Checkbox>
                </div>
            </div>
            <div className="sub-menu-right">
                <SkillSettings />
                <div className="share sub-menu-item">
                    <a>
                        {t('general:share')} <Icon type="share-alt" />
                    </a>
                </div>
            </div>
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(
    translate(['skills', 'general'])(SkillSubMenu)
)
