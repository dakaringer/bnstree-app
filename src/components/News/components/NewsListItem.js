import React from 'react'
import moment from 'moment'
import {Link} from 'react-router-dom'

const MAX_BG = 33

class NewsListItem extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            image: ''
        }
    }

    componentWillMount() {
        let {article} = this.props
        if (article.get('thumb', '') === '') {
            let i = Math.floor(Math.random() * MAX_BG + 1)
            this.setState({
                image: `https://static.bnstree.com/images/backgrounds/${i}_1.jpg`
            })
        } else {
            this.setState({
                image: `https://static.bnstree.com/images/thumbnails/${article.get('thumb')}.jpg`
            })
        }
    }

    render() {
        let {article, selected, icon} = this.props

        let id = article.get('_id')

        let now = moment(new Date())
        let time = moment(new Date(article.get('datePosted')))
        let n = null
        let timeString = ''
        if (now.diff(time, 'days') < 1) {
            n = <span className="new">N</span>
            timeString = time.fromNow()
        } else {
            timeString = time.format('ll')
        }

        let thumb = <img alt="thumb" className="thumb" src={this.state.image} />

        return (
            <Link
                to={`/news/${id}/${article
                    .get('title', '')
                    .replace(/ /g, '-')
                    .toLowerCase()}`}
                className={`news-item list-item ${selected ? 'selected' : ''} ${icon
                    ? 'icon'
                    : ''}`}>
                <div className="thumb-wrapper">{thumb}</div>
                <div className="news-item-content">
                    <div className="news-title">
                        <h3 className="list-item-title">
                            {article.get('title')}
                            <small>{n}</small>
                        </h3>
                        <h5 className="news-subtitle">
                            {article.get('content', '').split('\n\n')[0]}
                        </h5>
                    </div>
                    <div className="list-item-timestamp">{timeString}</div>
                </div>
            </Link>
        )
    }
}

export default NewsListItem
