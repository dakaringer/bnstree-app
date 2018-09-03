import React from 'react'
import {Tooltip} from 'antd'

class TagList extends React.Component {
    render() {
        let tags = []
        this.props.tags.forEach(tag => {
            let noSpace = tag.get('name', '').replace(/\s+/g, '')
            tags.push(
                <span key={noSpace}>
                    <Tooltip id={noSpace} title={<span>{tag.get('desc', '')}</span>} placement='bottomMiddle' overlayClassName='tagDesc'>
                        <span className={`tag ${tag.get('flag', '')}`} data-tip data-for={noSpace}>{tag.get('name', '')}</span>
                    </Tooltip>
                </span>
            )
        })
        return (
            <div className='tagBlock'>
                {tags}
            </div>
        )
    }
}

export default TagList
