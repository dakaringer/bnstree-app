import React, {Component} from 'react'

import './styles/Home.scss'

import CharacterSearch from '../Character/components/CharacterSearch'
import HomeClassLinks from './components/HomeClassLinks'
import HomeNewsList from './components/HomeNewsList'

class Home extends Component {
    componentDidMount() {
        document.title = 'BnSTree'
    }

    render() {
        return (
            <div className="home">
                <HomeClassLinks />
                <CharacterSearch center />
                <div className="home-bottom">
                    <HomeNewsList />
                </div>
            </div>
        )
    }
}

export default Home
