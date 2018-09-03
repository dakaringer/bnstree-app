import React from 'react'
import {connect} from 'react-redux'
import ReactMarkdown from 'react-markdown'
import {Button} from 'antd'

import './styles/editor.scss'

import {userSelector} from '../../selector'

const mapStateToProps = (state) => {
    return {user: userSelector(state)}
}

class Editor extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            id: '',
            title: '',
            subtitle: '',
            content: '',
            thumb: '',
            saved: false
        }
    }

    componentWillMount() {
        let params = new URLSearchParams(this.props.location.search)
        let articleId = params.get('id')
        fetch('/verify', {
            method: 'post',
            credentials: 'include',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({articleId: articleId})
        }).then(response => response.json()).then(json => {
            if (json.admin != 1) {
                window.location.href = '/'
            }
            else if (json.article) {
                this.setState({
                    id: json.article._id,
                    title: json.article.title,
                    subtitle: json.article.subtitle,
                    content: json.article.content,
                    thumb: json.article.thumb
                })
            }
        })
    }

    save() {
        fetch('/post', {
            method: 'post',
            credentials: 'include',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({
                id: this.state.id,
                title: this.state.title,
                subtitle: this.state.subtitle,
                content: this.state.content,
                thumb: this.state.thumb
            })
        }).then(response => response.json()).then((json) => {
            if (json.success != 1) {
                window.location.href = '/'
            }
            else {
                this.setState({saved: true, id: json.id})
            }
        })
    }

    delete() {
        fetch('/delete', {
            method: 'post',
            credentials: 'include',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({
                id: this.state.id
            })
        }).then(response => response.json()).then((json) => {
            if (json.success != 1) {
                window.location.href = '/'
            }
            else {
                this.setState({saved: true, id: ''})
            }
        })
    }

    onChange(e, target) {
        this.state[target] = e.target.value
        this.state.saved = false
        this.setState(this.state)
    }

    render() {
        let successMsg = null
        if (this.state.saved) {
            successMsg = <p>Saved</p>
        }

        let deleteBtn = null
        if (this.state.id != '') {
            deleteBtn = <Button type="danger" onClick={() => this.delete()}>Delete</Button>
        }

        return (
            <div>
                <div className='article-bg'>
                    <h1>Edit</h1>
                </div>
                <div className='sub-block'>
                    <div className='editor'>
                        <input className='title' value={this.state.title} placeholder='Title' onChange={(e) => this.onChange(e, 'title')}/>
                        <input className='subtitle' value={this.state.subtitle} placeholder='Subtitle' onChange={(e) => this.onChange(e, 'subtitle')}/>
                        <textarea className='content' value={this.state.content} placeholder='Content' onChange={(e) => this.onChange(e, 'content')}></textarea>
                        <input className='thumb' value={this.state.thumb} placeholder='Thumbmail (optional)' onChange={(e) => this.onChange(e, 'thumb')}/>
                        <div className='buttons'>
                            {deleteBtn}
                            <Button type="primary" onClick={() => this.save()}>Save</Button>
                        </div>
                        {successMsg}
                    </div>
                    <div className='preview'>
                        <h3>Preview</h3>
                        <ReactMarkdown source={this.state.content} skipHtml={true}/>
                    </div>
                </div>
            </div>

        )
    }
}

export default connect(mapStateToProps)(Editor)
