import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {Map, List} from 'immutable'

import {Popover, Tooltip} from 'antd'

import {viewSelector} from '../../../selectors'
import {characterSelector} from '../selectors'

import blank from '../images/blank.gif'
import bg_gem from '../images/bg_gem.png'

const mapStateToProps = state => {
    return {
        equipData: characterSelector(state).get('equipData', Map()),
        region: viewSelector(state).get('characterRegion', 'na')
    }
}

class CharacterEquips extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            hover: null
        }
    }

    hover(piece) {
        this.setState({hover: piece})
    }

    render() {
        const {t, equipData, region} = this.props

        let gems = []
        equipData.getIn(['weapon', 'gems'], List()).forEach((gem, i) => {
            gems.push(
                <Tooltip
                    overlayClassName="gem-tooltip"
                    title={gem.get('name')}
                    placement="bottomLeft"
                    key={i}>
                    <img alt={gem.get('name')} src={parseIcon(gem.get('icon', blank), region)} />
                </Tooltip>
            )
        })

        let accessories = []
        equipData.get('accessories', List()).forEach((accessory, i) => {
            accessories.push(
                <div className="equip-item" key={i}>
                    <div className="img-container">
                        <img
                            alt={accessory.get('name')}
                            src={parseIcon(accessory.get('icon', blank), region)}
                        />
                    </div>
                    <p className={accessory.get('grade')}>{accessory.get('name')}</p>
                </div>
            )
        })

        let ssPieces = []
        equipData.getIn(['soulshield', 'pieces'], List()).forEach((piece, i) => {
            if (piece) {
                ssPieces.push(
                    <img
                        alt={i}
                        className={`soulshield-piece soulshield_${i + 1}`}
                        src={parseIcon(piece, region)}
                        key={i}
                    />
                )
            }
        })

        let ssStats = []
        equipData.getIn(['soulshield', 'stats'], List()).forEach((stat, i) => {
            ssStats.push(
                <tr key={i}>
                    <td>{stat.get('stat')}</td>
                    <td className="total">{stat.get('total')}</td>
                    <td>
                        ({stat.get('base')} + <span className="add">{stat.get('fuse')}</span> +{' '}
                        <span className="add">{stat.get('set')}</span>)
                    </td>
                </tr>
            )
        })

        let ssEffects = []
        equipData.getIn(['soulshield', 'effects'], List()).forEach((set, i) => {
            let effects = []
            set.get('effects').forEach((effect, j) => {
                let txt = document.createElement('textarea')
                txt.innerHTML = effect
                effects.push(
                    <p className="effect-description" key={j}>
                        {txt.value.replace(/,/g, ', ')}
                    </p>
                )
            })

            ssEffects.push(
                <div className="soulshield-effect" key={i}>
                    <p className="soulshield-effect-name">{set.get('name')}</p>
                    {effects}
                </div>
            )
        })

        let ssTooltip = (
            <div>
                <h3>
                    {t('ssAttributes')}
                    <small>
                        {t('ssStatBase')} + <span>{t('ssStatFuse')}</span> +{' '}
                        <span>{t('ssStatSet')}</span>
                    </small>
                </h3>
                <table>
                    <tbody>{ssStats}</tbody>
                </table>
                <div>{ssEffects}</div>
            </div>
        )

        return (
            <div className="character-equips">
                <div className="weapon equip-item">
                    <div className="img-container">
                        <img
                            alt={equipData.getIn(['weapon', 'name'])}
                            src={parseIcon(equipData.getIn(['weapon', 'icon'], blank), region)}
                        />
                    </div>
                    <div>
                        <p className={equipData.getIn(['weapon', 'grade'])}>
                            {equipData.getIn(['weapon', 'name'])}
                        </p>
                        <div className="gems">{gems}</div>
                    </div>
                </div>
                <div className="accessories">{accessories}</div>
                <div className="soulshield">
                    <div className="imagePreview">
                        <img
                            alt="blank"
                            className="blankImg"
                            src={blank}
                            useMap="#map"
                            width="240"
                            height="240"
                        />
                        <map name="map">
                            <area
                                alt="1"
                                shape="poly"
                                coords="120,120,70,0,170,0"
                                onMouseOver={() => this.hover('soulshield_1')}
                                onMouseOut={() => this.hover(null)}
                            />
                            <area
                                alt="2"
                                shape="poly"
                                coords="120,120,170,0,240,70"
                                onMouseOver={() => this.hover('soulshield_2')}
                                onMouseOut={() => this.hover(null)}
                            />
                            <area
                                alt="3"
                                shape="poly"
                                coords="120,120,240,70,240,170"
                                onMouseOver={() => this.hover('soulshield_3')}
                                onMouseOut={() => this.hover(null)}
                            />
                            <area
                                alt="4"
                                shape="poly"
                                coords="120,120,240,170,170,240"
                                onMouseOver={() => this.hover('soulshield_4')}
                                onMouseOut={() => this.hover(null)}
                            />
                            <area
                                alt="5"
                                shape="poly"
                                coords="120,120,170,240,70,240"
                                onMouseOver={() => this.hover('soulshield_5')}
                                onMouseOut={() => this.hover(null)}
                            />
                            <area
                                alt="6"
                                shape="poly"
                                coords="120,120,70,240,0,170"
                                onMouseOver={() => this.hover('soulshield_6')}
                                onMouseOut={() => this.hover(null)}
                            />
                            <area
                                alt="7"
                                shape="poly"
                                coords="120,120,0,170,0,70"
                                onMouseOver={() => this.hover('soulshield_7')}
                                onMouseOut={() => this.hover(null)}
                            />
                            <area
                                alt="8"
                                shape="poly"
                                coords="120,120,0,70,70,0"
                                onMouseOver={() => this.hover('soulshield_8')}
                                onMouseOut={() => this.hover(null)}
                            />
                        </map>
                        {ssPieces}
                        <img alt="ss_bg" className="setBackground" src={bg_gem} />
                    </div>
                    <Popover
                        placement="topRight"
                        content={ssTooltip}
                        trigger="click"
                        overlayClassName="soulshield-attributes">
                        <a className="soulshield-attribute-button">{t('ssShowAttributes')}</a>
                    </Popover>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(translate('character')(CharacterEquips))

function parseIcon(icon, region) {
    if (icon === blank) {
        return blank
    }
    if (region === 'kr' && icon) {
        const krRe = /http:\/\/.*\/ui_resource\/(.*)/
        return `https://api.bnstree.com/character/krImg/${krRe.exec(icon)[1]}`
    } else {
        return icon.replace(/^http:/, 'https:')
    }
}
