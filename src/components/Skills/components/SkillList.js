import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'

import {Affix} from 'antd'
import {Link, Element, animateScroll} from 'react-scroll'

import SkillListItem from './SkillListItem'

import {catagorizedSkillDataSelector, viewSelector} from '../selectors'

const mapStateToProps = state => {
    return {
        skillData: catagorizedSkillDataSelector(state),
        order: viewSelector(state).get('order', 'LEVEL')
    }
}

const SkillList = props => {
    const {t, skillData, order} = props

    let list = []
    let hotkeyBar = []
    skillData.forEach((section, k) => {
        let skills = []

        let key = order === 'LEVEL' ? k : t(k)
        let label = order === 'LEVEL' ? t('levelLabel', {level: k}) : t(k)

        section.forEach((skill, id) => {
            skills.push(<SkillListItem skillData={skill} skillId={id} key={id} />)
        })

        list.push(
            <Element className="skill-group" name={`group_${k}`} key={k}>
                <h3 className="group-label">
                    {label}
                </h3>
                <div className="group-skills">
                    {skills}
                </div>
            </Element>
        )

        hotkeyBar.push(
            <Link smooth={true} to={`group_${k}`} duration={1000} key={k}>
                {key}
            </Link>
        )
    })

    hotkeyBar.push(
        <a key="top" className="top" onClick={() => animateScroll.scrollToTop({duration: 1000})}>
            {t('top')}
        </a>
    )

    return (
        <div className="skill-list">
            <div className="list">
                {list}
            </div>
            <Affix offsetTop={30}>
                <div className="hotkeyBar">
                    {hotkeyBar}
                </div>
            </Affix>
        </div>
    )
}

export default connect(mapStateToProps)(translate(['skills', 'tooltip'])(SkillList))
