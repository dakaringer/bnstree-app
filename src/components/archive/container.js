import React from 'react'
import {connect} from 'react-redux'
import {List} from 'immutable'

import {Pagination} from 'antd'

import NavLink from '../shared/navLink'
import moment from 'moment'

import {loadNews} from './actions'
import {newsSelector, currentLanguageSelector} from '../../selector'

import './styles/archive.scss'

const mapStateToProps = (state) => {
    return {
        news: newsSelector(state),
        locale: currentLanguageSelector(state)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadNews: (page) => dispatch(loadNews(page))
    }
}

class Archive extends React.PureComponent {
    componentWillMount() {
        this.props.loadNews(1)
    }

    paginate(p) {
        this.props.loadNews(p)
    }

    componentDidMount() {
        document.title = 'News | BnSTree'
    }

    render() {
        moment.locale(this.props.locale)
        let dateObj = new Date()
        let now = moment(dateObj)
        let articles = []

        this.props.news.get('list', List()).forEach(article => {
            let n = null
            let time = moment(article.get('datePosted'))

            let timeString = ''

            if (now.diff(time, 'days') < 1) {
                n = <span className='new'>N</span>
                timeString = time.fromNow()
            }
            else {
                timeString = time.format('LLL')
            }

            articles.push(
                <tr key={article.get('_id')}>
                    <td>
                        <NavLink to={`/news/${article.get('_id')}`}>
                            <p>{article.get('title')} {n}</p>
                        </NavLink>
                    </td>
                    <td>
                        {timeString}
                    </td>
                </tr>
            )
        })

        return (
            <div>
                <div className='article-bg'>
                    <div className='header'>
                        <h2>News</h2>
                    </div>
                </div>
                <div className='sub-block'>
                    <div className='container'>
                        <table className='archive'>
                            <tbody>
                                {articles}
                            </tbody>
                        </table>
                        <Pagination current={this.props.news.get('page', 1)} defaultPageSize={this.props.news.get('limit', 15)} total={this.props.news.get('count', 0)} onChange={(p) => this.paginate(p)}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Archive)
