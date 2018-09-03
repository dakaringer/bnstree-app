import React from 'react'
import {connect} from 'react-redux'

import SSItem from './SSListItem'

import {Col} from 'antd'

import {
    filteredListSelector
} from '../selector'

const mapStateToProps = (state) => {
    return {
        ssList: filteredListSelector(state)
    }
}

const SSList = (props) => {
    let list = []

    props.ssList.forEach((data, id) => {
        list.push(
            <SSItem key={id} id={id} data={data}/>
        )
    })

    return (
        <Col lg={{span: 14, pull: 10}} className='ssList'>
            <div className='list'>
                {list}
            </div>
        </Col>
    )
}

export default connect(mapStateToProps)(SSList)
