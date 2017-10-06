import React from 'react'
import {connect} from 'react-redux'
import {translate, Interpolate} from 'react-i18next'
import {Map, List} from 'immutable'
import {Link} from 'react-router-dom'

import {Icon, Popover} from 'antd'

import classImg from '../../Classes/images/map_classImg'
import rankImg from '../images/map_rankImg'
import noImg from '../images/noImg.png'

import {characterSelector} from '../selectors'

function getRank(rating) {
    let rank = 'bronze'

    if (rating >= 2100) {
        rank = 'diamond'
    } else if (rating >= 1900) {
        rank = 'platinum'
    } else if (rating >= 1600) {
        rank = 'gold'
    } else if (rating >= 1350) {
        rank = 'silver'
    }
    return rank
}

const mapStateToProps = state => {
    return {
        character: characterSelector(state).get('general', Map()),
        otherCharacters: characterSelector(state).get('otherCharacters', Map())
    }
}

class CharacterProfile extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            noImg: false
        }
    }

    profileError(e) {
        e.target.src = noImg
        this.setState({
            noImg: true
        })
    }

    render() {
        const {t, character, otherCharacters} = this.props

        let classCode = character.get('classCode', 'BM')
        let hmLevel = null
        if (character.hasIn(['level', 1])) {
            hmLevel = (
                <span className="hmLevel">
                    {t('profileLevelHm', {
                        level: character.getIn(['level', 1], 0)
                    })}
                </span>
            )
        }

        let soloRating = character.getIn(['arena', 'solo', 'rating'], 1300)
        let tagRating = character.getIn(['arena', 'tag', 'rating'], 1300)

        let others = []
        if (character.get('account') === otherCharacters.get('account')) {
            otherCharacters.get('list', List()).forEach(c => {
                others.push(
                    <Link to={`/character/${character.get('region', 'na')}/${c}`} key={c}>
                        {c}
                    </Link>
                )
            })
        }

        let re = /http:\/\/.*\/images\/(.*)/
        let profileImg = re.exec(character.get('profileImg', ''))[1]

        return (
            <div className="character-profile">
                <div className="character-profile-image">
                    {this.state.noImg ? <p className="no-image">{t('noImage')}</p> : null}
                    <img
                        alt={character.get('name')}
                        src={`https://api.bnstree.com/character/${character.get(
                            'region',
                            'na'
                        )}/profileImg/${profileImg}`}
                        onError={e => this.profileError(e)}
                    />
                </div>
                <div className="character-profile-container">
                    <div className="character-profile-info">
                        <div className="main-info">
                            <img
                                className="class-image"
                                alt={classCode}
                                src={classImg[classCode]}
                            />
                            <div className="character-name-block">
                                <p className="character-name">{character.get('name')}</p>
                                <p className="character-account">
                                    <Popover
                                        placement="bottomLeft"
                                        title={
                                            <Interpolate
                                                i18nKey="character:otherCharacters"
                                                account={
                                                    <strong>{character.get('account')}</strong>
                                                }
                                            />
                                        }
                                        content={others}
                                        trigger="click"
                                        overlayClassName="other-characters">
                                        {character.get('account')}{' '}
                                        <small>
                                            <Icon type="down" />
                                        </small>
                                    </Popover>
                                </p>
                            </div>
                        </div>
                        <p>
                            {t('profileLevel', {level: character.getIn(['level', 0], 0)})}
                            {hmLevel ? ' • ' : ''}
                            {hmLevel}
                        </p>
                        <p>{character.get('server')}</p>
                        <p>{character.get('faction')}</p>
                        <p>{character.get('clan')}</p>
                    </div>
                    <hr />
                    <div className="character-arena-info">
                        <h3>{t('arena')}</h3>
                        <p className="arena-stats">
                            {t('games', {count: character.getIn(['arena', 'stats', 0], 0)})}
                            {' • '}
                            {t('wins', {
                                count: character.getIn(['arena', 'stats', 1], 0)
                            })}{' '}
                            ({character.getIn(['arena', 'stats', 2], 0)}%)
                        </p>
                        <div className="arena-type solo">
                            <h5>{t('solo')}</h5>
                            <img alt={soloRating} src={rankImg[getRank(soloRating)]} />
                            <div className="arena-type-stats">
                                <p className="rating">{soloRating}</p>
                                <p>
                                    {t('wins', {
                                        count: character.getIn(['arena', 'solo', 'wins'], 0)
                                    })}
                                </p>
                            </div>
                        </div>
                        <div className="arena-type tag">
                            <h5>{t('tag')}</h5>
                            <img alt={tagRating} src={rankImg[getRank(tagRating)]} />
                            <div className="arena-type-stats">
                                <p className="rating">{tagRating}</p>
                                <p>
                                    {t('wins', {
                                        count: character.getIn(['arena', 'tag', 'wins'], 0)
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(translate('character')(CharacterProfile))
