import React, {Component} from 'react'

import './styles/Home.scss'

import CharacterSearch from '../Character/components/CharacterSearch'
import HomeClassLinks from './components/HomeClassLinks'
import HomeNewsList from './components/HomeNewsList'
import HomeCharacter from './components/HomeCharacter'

class Home extends Component {
    componentDidMount() {
        document.title = 'BnSTree'
    }

    render() {
        return (
            <div className="home">
                <div className="home-top">
                    <HomeClassLinks />
                    <CharacterSearch center />
                    <HomeCharacter />
                </div>
                <div className="home-bottom">
                    <HomeNewsList />
                </div>
            </div>
        )
    }
}

export default Home
