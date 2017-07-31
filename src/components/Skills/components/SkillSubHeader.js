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
            dispatch(
                updateView('visibility', e.target.checked ? 'TRAINABLE' : 'ALL')
            )
    }
}

const SkillSubHeader = props => {
    const {
        t,
        element,
        toggleElement,
        search,
        setSearch,
        visibility,
        toggleVisibility
    } = props

    return (
        <div className="skill-sub-header sub-header">
            <div className="sub-header-left">
                <div className="sub-header-group">
                    <div className="elementToggle sub-header-item">
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
                    <div className="skillSearch sub-header-item">
                        <input
                            placeholder={t('general:search')}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        <Icon
                            onClick={() => setSearch('')}
                            className={`clear ${search.length > 0
                                ? 'active'
                                : ''}`}
                            type="close"
                        />
                    </div>
                </div>
                <div className="skillVisibility sub-header-item">
                    <Checkbox
                        defaultChecked={false}
                        size="small"
                        onChange={toggleVisibility}
                        checked={visibility === 'TRAINABLE'}>
                        {t('showTrainable')}
                    </Checkbox>
                </div>
            </div>

            <SkillSettings />
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(
    translate('skills', 'general')(SkillSubHeader)
)
