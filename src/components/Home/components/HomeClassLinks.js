import React from 'react'
import { translate } from 'react-i18next'
import { Link } from 'react-router-dom'
import Fade from 'react-reveal/Fade'

import classImages from '../../Skills/images/map_classImg'
import classes from '../../NavBar/linkmap_skills'

const HomeClassLinks = props => {
    const { t } = props
    let links = []
    classes.forEach(c => {
        links.push(
            <Link to={`/skills/${c[1]}`} className="class-link" key={c[0]}>
                <img alt={c[1]} src={classImages[c[0]]} />
                <p>{t(c[0])}</p>
            </Link>
        )
    })

    return (
        <Fade cascade>
            <div className="home-class-links">
                {links}
            </div>
        </Fade>
    )
}

export default translate('general')(HomeClassLinks)
