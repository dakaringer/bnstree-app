import React from 'react'
import {Map} from 'immutable'
import MarkdownIt from 'markdown-it'
import moment from 'moment'

const md = new MarkdownIt('default', {
    linkify: true
})

const HomeTwitterItem = props => {
    let {tweet} = props

    let id = tweet.get('id_str')
    let timeString = ''
    let time = moment(new Date(parseInt(tweet.get('timestamp_ms', 0), 10)))
    let now = moment(new Date())
    if (now.diff(time, 'days') < 1) {
        timeString = time.fromNow()
    } else {
        timeString = time.format('MMM D')
    }
    let user = tweet.get('user', Map())
    tweet = tweet.get('extended_tweet', tweet)

    let text = tweet.get('full_text', tweet.get('text'))
    if (tweet.hasIn(['display_text_range', 1])) {
        text = text.substr(0, tweet.getIn(['display_text_range', 1], 0))
    }
    let image = null
    if (tweet.hasIn(['entities', 'media', 0, 'media_url_https'])) {
        image = (
            <img
                className="tweet-background"
                alt="tweet"
                src={tweet.getIn(['entities', 'media', 0, 'media_url_https'])}
            />
        )
    }

    return (
        <div className="tweet">
            <div className="tweet-user">
                <a href={`https://twitter.com/${user.get('screen_name')}`} target="_blank">
                    <img alt={user.get('name')} src={user.get('profile_image_url_https')} />
                    <span className="tweet-user-name">
                        {user.get('name')}
                        <br />
                        <small>@{user.get('screen_name')}</small>
                    </span>
                </a>
            </div>
            {image}
            <div className="tweet-text">
                <p dangerouslySetInnerHTML={{__html: md.render(text)}} />
                <small>
                    <span className="tweet-timestamp">{timeString} • </span>
                    <a
                        alt={id}
                        href={`https://twitter.com/${user.get('screen_name')}/status/${id}`}
                        target="_blank">
                        View original Tweet
                    </a>
                </small>
            </div>
        </div>
    )
}

export default HomeTwitterItem
