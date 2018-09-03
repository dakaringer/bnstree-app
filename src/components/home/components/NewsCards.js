import React from 'react'
import {connect} from 'react-redux'
import {List} from 'immutable'

import {newsSelector, currentLanguageSelector} from '../../../selector'
import {loadLatestNews} from '../actions'

import NavLink from '../../shared/navLink'
import moment from 'moment'

const mapStateToProps = (state) => {
    return {
        latestNews: newsSelector(state).get('list', List()),
        locale: currentLanguageSelector(state)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadNews: () => dispatch(loadLatestNews())
    }
}

class NewsCards extends React.PureComponent {
    componentWillMount() {
        this.props.loadNews()
    }

    render() {
        moment.locale(this.props.locale)
        let dateObj = new Date()
        let now = moment(dateObj)
        let articles = []

        this.props.latestNews.forEach((article) => {
            if (articles.length > 5) {
                return false
            }

            let bg = null
            if (article.get('thumb') == '') {
                let i = Math.floor((Math.random() * 12) + 1)
                bg = <img className='thumb' src={`/images/backgrounds/${i}_1.jpg`}/>
            }
            else {
                bg = <img className='thumb' src={article.get('thumb')}/>
            }

            let n = null
            let time = moment(article.get('datePosted'))

            let timeString = ''

            if (now.diff(time, 'days') < 1) {
                n = <span className='new'>N</span>
                timeString = time.fromNow()
            }
            else {
                timeString = time.format('LL')
            }

            articles.push(
                <NavLink key={article.get('_id')} to={`/news/${article.get('_id')}`}>
                    <div className='card article'>
                        {bg}
                        <div className='content'>
                            <h3 className='title'>{article.get('title')} {n}</h3>
                            <p className='subtitle'>{article.get('subtitle')}</p>
                            <p>{timeString}</p>
                        </div>
                    </div>
                </NavLink>
            )
        })

        return (
            <div className='home-articles-latest'>
                {articles}
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewsCards)
