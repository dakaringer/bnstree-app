import React, {Component} from 'react'

import './styles/Home.scss'

import ClassLinks from './components/HomeClassLinks'
import CharacterSearch from '../Character/components/CharacterSearch'

class Home extends Component {
    componentDidMount() {
        document.title = 'BnSTree'
    }

    render() {
        return (
            <div className="home">
                <ClassLinks />
                <CharacterSearch center />
            </div>
        )
    }
}

export default Home
