import React from 'react'
import {connect} from 'react-redux'
import {Map} from 'immutable'

import {uiTextSelector, characterSelector} from '../selector'

import classImages from '../../shared/images/map_classImg'
import rankImages from '../images/map_rankImg'

const mapStateToProps = (state) => {
    return {
        character: characterSelector(state).get('general', Map()),
        uiText: uiTextSelector(state).get('CHARACTER_PROFILE', Map()),
        classNames: uiTextSelector(state).get('CLASS_NAMES', Map()),
    }
}

class CharacterProfile extends React.PureComponent {
    profileError(e) {
        e.target.style.visibility = 'hidden'
    }

    render() {
        let hm = null
        if (this.props.character.hasIn(['level', 1])) {
            hm = <span> • <span className='hmLevel'>{this.props.uiText.get('hLevel')} {this.props.character.getIn(['level', 1])}{this.props.uiText.get('hLevelSuffix')}</span></span>
        }

        let classCode = this.props.character.get('classCode')

        let soloRating = this.props.character.getIn(['arena', 'solo', 'rating'])
        let tagRating = this.props.character.getIn(['arena', 'tag', 'rating'])
        let soloRank = getRank(soloRating)
        let tagRank = getRank(tagRating)

        return (
            <div className='characterProfile'>
                <div className='profileImgContainer'>
                    <p className='noImage'>{this.props.uiText.get('noImage')}</p>
                    <img className='profileImg' src={this.props.character.get('profileImg')} onError={this.profileError}/>
                </div>
                <div className='details'>
                    <div className='nameBlock'>
                        <img className='classIcon' src={classImages[classCode]}/>
                        <div>
                            <h3>{this.props.character.get('name')}</h3>
                            <h5>{this.props.classNames.get(classCode)}</h5>
                        </div>
                    </div>
                    <p>{this.props.uiText.get('level')} {this.props.character.getIn(['level', 0])}{hm}</p>
                    <p>{this.props.character.get('server')}</p>
                    <p>{this.props.character.get('faction')}</p>
                    <p>{this.props.character.get('clan')}</p>
                    <hr/>
                    <div className='arena'>
                        <h4>
                            {this.props.uiText.get('arena')}<br/>
                            <small>{this.props.character.getIn(['arena', 'stats'], '').replace('Total ', `${this.props.uiText.get('total')} - `).replace('Wins', `${this.props.uiText.get('wins')} `)}</small>
                        </h4>
                        <div className='matchType'>
                            <h6>{this.props.uiText.get('solo')}</h6>
                            <table className='rating'>
                                <tbody>
                                    <tr>
                                        <td className='imgWrap'>
                                            <img src={rankImages[soloRank]}/>
                                        </td>
                                        <td>
                                            <p>{soloRating} • {this.props.uiText.get(soloRank)}</p>
                                            <p className='wins'>{this.props.character.getIn(['arena', 'solo', 'wins'], '').replace('Victories ', '')}{this.props.uiText.get('wins')}</p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className='matchType'>
                            <h6>{this.props.uiText.get('tag')}</h6>
                            <table className='rating'>
                                <tbody>
                                    <tr>
                                        <td className='imgWrap'>
                                            <img src={rankImages[tagRank]}/>
                                        </td>
                                        <td>
                                            <p>{tagRating} • {this.props.uiText.get(tagRank)}</p>
                                            <p className='wins'>{this.props.character.getIn(['arena', 'tag', 'wins'], '').replace('Victories ', '')}{this.props.uiText.get('wins')}</p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function getRank(rating) {
    let rank = 'bronze'

    if (rating >= 2100) {
        rank = 'diamond'
    }
    else if (rating >= 1900) {
        rank = 'platinum'
    }
    else if (rating >= 1600) {
        rank = 'gold'
    }
    else if (rating >= 1350) {
        rank = 'silver'
    }
    return rank
}

export default connect(mapStateToProps)(CharacterProfile)
