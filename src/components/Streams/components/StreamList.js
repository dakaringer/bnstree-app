import React, {Component} from 'react'
import {connect} from 'react-redux'

import {Icon} from 'antd'

import {loadStreams} from '../actions'
import {listSelector} from '../selectors'

const mapStateToProps = state => {
    return {
        list: listSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadStreams: page => dispatch(loadStreams(page))
    }
}

class StreamList extends Component {
    componentWillMount() {
        this.props.loadStreams()
    }

    render() {
        let {list, limit} = this.props

        let streams = []
        let count = 0
        list.forEach((stream, i) => {
            if (stream.get('stream_type') === 'live') {
                if (limit && count > limit - 1) {
                    return false
                }
                count++

                let title = stream.getIn(['channel', 'status'])
                streams.push(
                    <a
                        className="stream-item"
                        href={stream.getIn(['channel', 'url'])}
                        target="_blank"
                        rel="noopener noreferrer"
                        key={i}>
                        <div className="preview-container">
                            <img alt={title} src={stream.getIn(['preview', 'medium'])} />
                            <div className="viewers preview-overlay">
                                <Icon type="eye-o" /> {stream.get('viewers')}
                            </div>
                            <div className="stream-stat preview-overlay">
                                {stream.get('video_height')}p @{' '}
                                {stream.get('average_fps').toFixed(0)}FPS
                            </div>
                        </div>
                        <p className="stream-title">
                            {title}
                        </p>
                        <p className="stream-name">
                            {stream.getIn(['channel', 'display_name'])}
                        </p>
                    </a>
                )
            }
        })

        return (
            <div className="stream-list">
                {streams}
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StreamList)
