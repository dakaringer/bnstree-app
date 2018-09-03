import React from 'react'
import {connect} from 'react-redux'
import {Map, List} from 'immutable'

import classImages from '../images/map_classImg'
import rankImages from '../images/map_rankImg'

import {Pagination, Icon, Dropdown, Menu, Button} from 'antd'

import NavLink from '../../shared/navLink'

import {regionSelector, classSelector, rankingDataSelector, modeSelector, uiTextSelector} from '../selector'
import {loadRankings} from '../actions'

const mapStateToProps = (state) => {
    return {
        uiText: uiTextSelector(state).get('RANKINGS', Map()),
        currentRegion: regionSelector(state),
        currentClass: classSelector(state),
        rankingData: rankingDataSelector(state),
        currentMode: modeSelector(state),
        classNames: uiTextSelector(state).get('CLASS_NAMES', Map())
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadRankings: (mode, region, classCode, page) => dispatch(loadRankings(mode, region, classCode, page))
    }
}

const classCodes = [
    'all',
    'BM',
    'KF',
    'DE',
    'FM',
    'AS',
    'SU',
    'BD',
    'WL',
    'SF'
]

class RankingList extends React.PureComponent {
    paginate(p) {
        this.props.loadRankings(this.props.currentMode, this.props.currentRegion, this.props.currentClass, p)
    }

    handleClass(classCode) {
        this.props.loadRankings(this.props.currentMode, this.props.currentRegion, classCode, 1)
    }

    handleRegion(region) {
        this.props.loadRankings(this.props.currentMode, region, this.props.currentClass, 1)
    }

    render () {
        let list = []
        let rank = this.props.rankingData.getIn(['list', 0, 'initialRank'], 1)
        let previousScore = this.props.rankingData.getIn(['list', 0, this.props.currentMode])
        this.props.rankingData.get('list', List()).forEach((character, i) => {
            if (previousScore > character.get(this.props.currentMode)) {
                previousScore = character.get(this.props.currentMode)
                rank = i + 1 + ((this.props.rankingData.get('page') - 1) * 50)
            }

            let rankColor = ''
            if (rank <= 5) {
                rankColor = 'grade_7'
            }
            else if (rank <= 30) {
                rankColor = 'grade_5'
            }
            else if (rank <= 150) {
                rankColor = 'grade_4'
            }
            else if (rank <= 300) {
                rankColor = 'grade_3'
            }

            let diff = 0
            let str = `daily${this.props.currentClass == 'all' ? '' : 'Class'}Rank${this.props.currentMode == 'solo' ? 'Solo' : 'Tag'}`
            if (character.has(str)) {
                diff = character.get(str) - rank
            }
            else {
                diff = <span className='new'>N</span>
            }

            let arrow = null
            if (!isNaN(diff)) {
                if (diff > 0) {
                    arrow = 'up'
                }
                else if (diff < 0) {
                    arrow = 'down'
                }
                diff = diff == 0 ? '-' : Math.abs(diff)
            }

            list.push(
                <tr className='rankCharacter' key={character.get('_id')}>
                    <td className={`rank ${rankColor}`}>
                        {rank}
                    </td>
                    <td>
                        <NavLink to={`/character/${character.get('region')}/${character.get('character')}`}>
                            <div>{character.get('character')} [{character.get('account')}]</div>
                        </NavLink>
                    </td>
                    <td className='score'>
                        <img src={rankImages[getRank(previousScore)]}/>
                        <span>{previousScore}</span>
                    </td>
                    <td className='class'>
                        <img src={classImages[character.get('classCode')]}/>
                        <span>{this.props.classNames.get(character.get('classCode'))}</span>
                    </td>
                    <td className={`diff ${arrow}`}>
                        {arrow ? <Icon type={arrow} /> : null}{diff}
                    </td>
                </tr>
            )
        })

        let regionFilter = <Menu onClick={(e) => this.handleRegion(e.key)}>
            <Menu.Item key='na'>
                <a>NA</a>
            </Menu.Item>
            <Menu.Item key='eu'>
                <a>EU</a>
            </Menu.Item>
        </Menu>

        let classes = []
        classCodes.forEach(c => {
            classes.push(
                <Menu.Item key={c}>
                    <a>{this.props.classNames.get(c, this.props.uiText.get('all'))}</a>
                </Menu.Item>
            )
        })

        let classFilter = <Menu onClick={(e) => this.handleClass(e.key)}>
            {classes}
        </Menu>

        let pagination = 
            <Pagination 
                current={this.props.rankingData.get('page', 1)} 
                defaultPageSize={this.props.rankingData.get('limit', 50)} 
                total={this.props.rankingData.get('count', 0)} 
                onChange={(p) => this.paginate(p)}
                size='small'
            />

        return (
            <div className='rankingList'>
                <div className='container'>
                    <div className='filters'>
                        <h2>{this.props.uiText.get(this.props.currentMode)}</h2>
                        <span className='filter'>
                            {this.props.uiText.get('region')}: 
                            <Dropdown overlay={regionFilter} placement="bottomLeft">
                                <Button size='small' ghost>
                                    {this.props.currentRegion.toUpperCase()} <Icon type="down" />
                                </Button>
                            </Dropdown>
                        </span>
                        <span className='filter'>
                            {this.props.uiText.get('class')}: 
                            <Dropdown overlay={classFilter} placement="bottomLeft">
                                <Button size='small' ghost>
                                    {this.props.classNames.get(this.props.currentClass, this.props.uiText.get('all'))} <Icon type="down" />
                                </Button>
                            </Dropdown>
                        </span>
                    </div>
                    {pagination}
                    <table>
                        <tbody>
                            {list}
                        </tbody>
                    </table>
                    {pagination}
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

export default connect(mapStateToProps, mapDispatchToProps)(RankingList)
