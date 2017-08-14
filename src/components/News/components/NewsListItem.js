import React, {PureComponent} from 'react'
import moment from 'moment'
import {Link} from 'react-router-dom'

class NewsListItem extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            image: ''
        }
    }

    componentWillMount() {
        let {article} = this.props
        if (article.get('thumb', '') === '') {
            let i = Math.floor(Math.random() * 17 + 1)
            this.setState({
                image: `https://static.bnstree.com/images/backgrounds/${i}_1.jpg`
            })
        } else {
            this.setState({
                image: `https://static.bnstree.com/images/thumbnails/${article.get('thumb')}`
            })
        }
    }

    render() {
        let {article, selected} = this.props

        let id = article.get('_id')

        let now = moment(new Date())
        let time = moment(article.get('datePosted'))
        let n = null
        let timeString = ''
        if (now.diff(time, 'days') < 1) {
            n = <span className="new">N</span>
            timeString = time.fromNow()
        } else {
            timeString = time.format('ll')
        }

        let thumb = null
        if (article.get('thumb', '') === '') {
            let i = Math.floor(Math.random() * 17 + 1)
            thumb = (
                <img
                    alt="thumb"
                    className="thumb"
                    src={`https://static.bnstree.com/images/backgrounds/${i}_1.jpg`}
                />
            )
        } else {
            thumb = (
                <img
                    alt="thumb"
                    className="thumb"
                    src={`https://static.bnstree.com/images/thumbnails/${article.get('thumb')}`}
                />
            )
        }

        return (
            <Link to={`/news/${id}/${article.get('title', '').replace(' ', '-').toLowerCase()}`}>
                <div className={`news-item list-item ${selected ? 'selected' : ''}`}>
                    <div className="thumb-wrapper">
                        {thumb}
                    </div>
                    <div className="news-item-content">
                        <div className="news-title">
                            <h3 className="list-item-title">
                                {article.get('title')}
                                <small>
                                    {n}
                                </small>
                            </h3>
                            <h5 className="news-subtitle">
                                {article.get('content', '').split('\n\n')[0]}
                            </h5>
                        </div>
                        <div className="list-item-timestamp">
                            {timeString}
                        </div>
                    </div>
                </div>
            </Link>
        )
    }
}

export default NewsListItem
