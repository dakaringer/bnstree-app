import React, {Component} from 'react'
import {translate} from 'react-i18next'
import {Dropdown, Menu} from 'antd'
import {Link} from 'react-router-dom'

import './styles/Home.scss'

import ClassLinks from './components/HomeClassLinks'

class Home extends Component {
    componentDidMount() {
        document.title = 'BnSTree'
    }

    render() {
        return (
            <div className='home'>
                <ClassLinks/>
            </div>
        )
    }
}

export default Home
