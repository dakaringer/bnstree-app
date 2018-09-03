import React from 'react'
import {connect} from 'react-redux'
import ReactMarkdown from 'react-markdown'
import {withRouter} from 'react-router'
import {List} from 'immutable'

import moment from 'moment'

import './styles/article.scss'

import {userSelector, currentLanguageSelector, newsSelector} from '../../selector'

import { Button } from 'antd'

const mapStateToProps = (state) => {
    return {
        user: userSelector(state),
        locale: currentLanguageSelector(state),
        news: newsSelector(state).get('list', List())
    }
}

class Article extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            id: '',
            title: '',
            subtitle: '',
            content: '',
            thumb: ''
        }
    }

    componentWillMount() {
        let articleId = this.props.match.params.articleId

        let article = this.props.news.find(n => n.get('_id') === articleId)

        if (article) {
            this.setState({
                id: article.get('_id'),
                title: article.get('title'),
                subtitle: article.get('subtitle'),
                content: article.get('content'),
                date: article.get('datePosted'),
                thumb: article.get('thumb')
            })
            document.title = `${article.get('title')} | BnSTree`
        }
        else {
            fetch('/api/general/fetchArticle', {
                method: 'post',
                credentials: 'include',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                },
                body: JSON.stringify({articleId: articleId})
            }).then(response => response.json()).then(json => {
                if (json.article) {
                    this.setState({
                        id: json.article._id,
                        title: json.article.title,
                        subtitle: json.article.subtitle,
                        content: json.article.content,
                        date: json.article.datePosted,
                        thumb: json.article.thumb
                    })
                    document.title = `${json.article.title} | BnSTree`
                }
                else {
                    this.props.history.replace('/error')
                }
            })
        }
    }

    render() {
        moment.locale(this.props.locale)

        let thumb = null
        if (this.state.thumb != '') {
            thumb = <div className='thumbContainer'><img className='thumb' src={this.state.thumb}/></div>
        }

        let now = moment(new Date())
        let time = moment(this.state.date)

        let timeString = ''

        if (now.diff(time, 'days') < 1) {
            timeString = time.fromNow()
        }
        else {
            timeString = time.format('LL')
        }

        let adminButton = null
        if (this.props.user && this.props.user.get('admin', false)) {
            adminButton = <Button type="primary" className='sideButton'>
                <a href={`/edit?id=${this.props.match.params.articleId}`}>Edit article</a>
            </Button>
        }

        return (
            <div>
                <div className='article-bg'>
                    {thumb}
                    <div className='header'>
                        <h2>{this.state.title}</h2>
                        <p>{this.state.subtitle}</p>
                        <p>{timeString}</p>
                    </div>
                </div>
                <div className='sub-block'>
                    <div className='content'>
                        <ReactMarkdown source={this.state.content} skipHtml={true}/>
                    </div>
                    {adminButton}
                </div>
            </div>

        )
    }
}

export default withRouter(connect(mapStateToProps)(Article))
