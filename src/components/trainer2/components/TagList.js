import React from 'react'

const TagList = (props) => {
    let tags = []
    props.tags.forEach(tag => {
        let noSpace = tag.get('name', '').replace(/\s+/g, '')
        tags.push(
            <span key={noSpace}>
                <span className={`tag ${tag.get('flag', '')}`}>{tag.get('name', '')}</span>
            </span>
        )
    })
    return (
        <div className='tagBlock'>
            {tags}
        </div>
    )
}

export default TagList
