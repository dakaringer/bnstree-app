import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {Map} from 'immutable'

import classImg from '../../Skills/images/map_classImg'
import rankImg from '../images/map_rankImg'

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
        character: characterSelector(state).get('general', Map())
    }
}

class CharacterProfile extends React.PureComponent {
    profileError(e) {
        e.target.style.display = 'none'
    }

    render() {
        const {t, character} = this.props

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

        return (
            <div className="character-profile">
                <div className="character-profile-image">
                    <p className="no-image">
                        {t('noImage')}
                    </p>
                    <img
                        alt={character.get('name')}
                        src={character.get('profileImg')}
                        onError={this.profileError}
                    />
                </div>
                <div className="character-profile-info">
                    <div className="main-info">
                        <img className="class-image" alt={classCode} src={classImg[classCode]} />
                        <div className="character-name-block">
                            <p className="character-name">
                                {character.get('name')}
                            </p>
                            <p className="character-class">
                                {t(classCode)}
                            </p>
                        </div>
                    </div>
                    <p>
                        {t('profileLevel', {level: character.getIn(['level', 0], 0)})}
                        {hmLevel ? ' • ' : ''}
                        {hmLevel}
                    </p>
                    <p>
                        {character.get('server')}
                    </p>
                    <p>
                        {character.get('faction')}
                    </p>
                    <p>
                        {character.get('clan')}
                    </p>
                </div>
                <hr />
                <div className="character-arena-info">
                    <h2>Arena</h2>
                    <p className="arena-stats">
                        {t('games', {count: character.getIn(['arena', 'stats', 0], 0)})}
                        {' • '}
                        {t('wins', {
                            count: character.getIn(['arena', 'stats', 1], 0)
                        })}{' '}
                        ({character.getIn(['arena', 'stats', 2], 0)}%)
                    </p>
                    <div className="arena-type solo">
                        <h5>
                            {t('solo')}
                        </h5>
                        <img alt={soloRating} src={rankImg[getRank(soloRating)]} />
                        <div className="arena-type-stats">
                            <p className="rating">
                                {soloRating}
                            </p>
                            <p>
                                {t('wins', {count: character.getIn(['arena', 'solo', 'wins'], 0)})}
                            </p>
                        </div>
                    </div>
                    <div className="arena-type tag">
                        <h5>
                            {t('tag')}
                        </h5>
                        <img alt={tagRating} src={rankImg[getRank(tagRating)]} />
                        <div className="arena-type-stats">
                            <p className="rating">
                                {tagRating}
                            </p>
                            <p>
                                {t('wins', {count: character.getIn(['arena', 'tag', 'wins'], 0)})}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(translate('character')(CharacterProfile))
