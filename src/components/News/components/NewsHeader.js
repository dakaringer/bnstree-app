import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {Link, withRouter} from 'react-router-dom'

import {Button} from 'antd'

import {userSelector} from '../../../selectors'

import icon from '../images/GameUI_HeaderIcon_230.png'

const mapStateToProps = state => {
    return {
        user: userSelector(state)
    }
}

const NewsHeader = props => {
    const {t, user, location} = props

    return (
        <div className="news-header section-header">
            <div className="header-title">
                <img alt="news" src={icon} />
                <span>
                    {t('news')}
                </span>
                {user && user.get('admin') && location.pathname !== '/news/new'
                    ? <div className="add-new">
                          <Link to={'/news/new'}>
                              <Button ghost type="danger">
                                  New Article
                              </Button>
                          </Link>
                      </div>
                    : null}
            </div>
        </div>
    )
}

export default withRouter(connect(mapStateToProps)(translate('general')(NewsHeader)))
