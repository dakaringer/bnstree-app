import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {Fade} from 'react-reveal'

import {StickyContainer, Sticky} from 'react-sticky'
import {Link, Element, animateScroll} from 'react-scroll'

import SkillListItem from './SkillListItem'

import {viewSelector} from '../../../selectors'
import {catagorizedSkillDataSelector} from '../selectors'

const mapStateToProps = state => {
    return {
        skillData: catagorizedSkillDataSelector(state),
        order: viewSelector(state).get('skillOrder', 'LEVEL')
    }
}

const SkillList = props => {
    const {t, skillData, order, characterViewer} = props

    let list = []
    let hotkeyBar = []
    skillData.forEach((section, k) => {
        let skills = []

        let key = order === 'LEVEL' || characterViewer ? k : t(k)
        let label = order === 'LEVEL' || characterViewer ? t('levelLabel', {level: k}) : t(k)

        section.forEach((skill, id) => {
            skills.push(<SkillListItem skillData={skill} skillId={id} key={id} />)
        })

        list.push(
            <Element className="skill-group" name={`group_${k}`} key={k}>
                <h3 className="group-label">{label}</h3>
                <div className="group-skills">{skills}</div>
            </Element>
        )

        hotkeyBar.push(
            <Link smooth={true} to={`group_${k}`} duration={500} key={k}>
                {key}
            </Link>
        )
    })

    hotkeyBar.push(
        <a key="top" className="top" onClick={() => animateScroll.scrollToTop({duration: 500})}>
            {t('top')}
        </a>
    )

    return (
        <StickyContainer className="skill-list">
            <Fade className="list">{list}</Fade>
            <div className="hotkey-bar-wrapper">
                <Sticky bottomOffset={400} disableCompensation>
                    {({style}) => (
                        <div className="hotkey-bar" style={style}>
                            {hotkeyBar}
                        </div>
                    )}
                </Sticky>
            </div>
        </StickyContainer>
    )
}

export default connect(mapStateToProps)(translate(['classes', 'tooltip'])(SkillList))
