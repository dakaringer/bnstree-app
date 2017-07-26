import React, {Component} from 'react'
import {translate} from 'react-i18next'
import {Link} from 'react-router-dom'

import classImages from '../../Skills/images/map_classImg'
import {classes} from '../../NavBar/NavBar'

class Home extends Component {
    render() {
        const {t} = this.props
        let links = []
        classes.forEach(c => {
            links.push(
                <Link to={`/skills/${c[1]}`} className='class-link' key={c[0]}>
                    <img alt={c[1]} src={classImages[c[0]]}/>
                    <p>{t(c[0])}</p>
                </Link>
            )
        })

        return (
            <div className='home-class-links'>
                {links}
            </div>
        )
    }
}

export default translate('general')(Home)
