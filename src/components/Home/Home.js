import React, {Component} from 'react'

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
