import React from 'react'
import {connect} from 'react-redux'

import {latestBuildsSelector} from '../selector'
import {loadLatestBuilds} from '../actions'
import {currentLanguageSelector} from '../../../selector'

import elementImages from '../../shared/images/map_elementImg'
import classImages from '../../shared/images/map_classImg'

import NavLink from '../../shared/navLink'
import moment from 'moment'

const mapStateToProps = (state) => {
    return {
        latestBuilds: latestBuildsSelector(state),
        locale: currentLanguageSelector(state)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadBuilds: () => dispatch(loadLatestBuilds())
    }
}

class BuildCards extends React.PureComponent {
    componentWillMount() {
        this.props.loadBuilds()
    }

    render() {
        moment.locale(this.props.locale)
        let dateObj = new Date()
        let now = moment(dateObj)
        let builds = []
        this.props.latestBuilds.forEach((item) => {
            let n = null
            let time = moment(item.get('created'))

            let timeString = ''

            if (now.diff(time, 'days') < 1) {
                n = <span className='new'>N</span>
                timeString = time.fromNow()
            }
            else {
                timeString = time.format('LL')
            }

            builds.push(
                <NavLink key={item.get('_id')} to={`/skill/${item.get('classCode')}/${item.get('_id')}`}>
                    <div className='card build'>
                        <h3 className='catalogTitle'>
                            <img className='buildClass' src={classImages[item.get('classCode')]}/>
                            <img className='buildElement' src={elementImages[item.get('element')]}/>
                            <small className='buildType'>
                                {item.get('type')}
                            </small>
                            {item.get('title')} <small>{n}</small>
                        </h3>
                        <p className='buildDetails'>{timeString}</p>
                    </div>
                </NavLink>
            )
        })

        return (
            <div className='home-builds-latest'>
                {builds}
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BuildCards)
