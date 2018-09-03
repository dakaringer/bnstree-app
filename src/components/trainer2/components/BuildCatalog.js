import React from 'react'
import {connect} from 'react-redux'
import {Map, List} from 'immutable'
import {animateScroll} from 'react-scroll'

import AdSense from '../../shared/adsense'

import moment from 'moment'

import elementImages from '../../shared/images/map_elementImg'

import {uiTextSelector, buildCatalogSelector, classSelector, constantSelector, classElementSelector} from '../selector'
import {currentLanguageSelector} from '../../../selector'
import {loadBuildCatalog} from '../actions'

import NavLink from '../../shared/navLink'
import {Pagination, Dropdown, Menu, Button, Icon} from 'antd'

const mapStateToProps = (state) => {
    return {
        classCode: classSelector(state),
        uiText: uiTextSelector(state).get('BUILD_LIST', Map()),
        buildCatalog: buildCatalogSelector(state),
        locale: currentLanguageSelector(state),
        constants: constantSelector(state),
        classElements: classElementSelector(state)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadBuildCatalog: (classCode, page, element, type) => dispatch(loadBuildCatalog(classCode, page, element, type))
    }
}

class BuildCatalog extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            element: 'all',
            type: 'all'
        }
    }

    componentWillMount() {
        this.props.loadBuildCatalog(this.props.classCode, 1)
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.classCode != this.props.classCode) {
            this.props.loadBuildCatalog(nextProps.classCode, 1)
        }
    }

    paginate(p) {
        this.props.loadBuildCatalog(this.props.classCode, p)
    }

    handleFilter(key, type) {
        let s = this.state
        s[type] = key
        this.setState(s)

        this.props.loadBuildCatalog(this.props.classCode, 1, s.element, s.type)
    }

    render() {
        let buildCatalog = this.props.buildCatalog
        let catalog = []

        moment.locale(this.props.locale)
        let dateObj = new Date()
        let now = moment(dateObj)

        buildCatalog.get('list', List()).forEach(item => {
            let n = null
            let time = moment(item.get('created'))

            let timeString = ''

            if (now.diff(time, 'days') < 1) {
                n = <span className='new'>N</span>
                timeString = time.fromNow()
            }
            else {
                timeString = time.format('LL')
            }

            catalog.push(
                <NavLink key={item.get('_id')} to={`/skill/${item.get('classCode')}/${item.get('_id')}`} onClick={() => animateScroll.scrollToTop()}>
                    <div className='card catalogItem'>
                        <h3 className='catalogTitle'>
                            <img className='buildElement' src={elementImages[item.get('element')]}/>
                            <small className='buildType'>
                                {item.get('type')}
                            </small>
                            {item.get('title')} <small>{n}</small>
                        </h3>
                        <p className='buildDetails'>{timeString}</p>
                    </div>
                </NavLink>
            )
        })

        let elements = [
            <Menu.Item key='all'>
                {this.props.uiText.get('all')}
            </Menu.Item>
        ]
        this.props.classElements.forEach(e => {
            let element = e.get('element')
            elements.push(
                <Menu.Item key={element}>
                    {this.props.constants.getIn(['ELEMENT', element])}
                </Menu.Item>
            )
        })

        let elementFilter = <Menu onClick={(e) => this.handleFilter(e.key, 'element')}>{elements}</Menu>

        let typeFilter = <Menu onClick={(e) => this.handleFilter(e.key, 'type')}>
            <Menu.Item key='all'>
                <a>{this.props.uiText.get('all')}</a>
            </Menu.Item>
            <Menu.Item key='PvE'>
                <a>PvE</a>
            </Menu.Item>
            <Menu.Item key='PvP'>
                <a>PvP</a>
            </Menu.Item>
            <Menu.Item key='6v6'>
                <a>6v6</a>
            </Menu.Item>
        </Menu>

        return (
            <div className='sub-block'>
                <div className='container'>
                    <AdSense client="ca-pub-2048637692232915" slot="2719129989" format='auto'/>
                    <h2>{this.props.uiText.get('header', '')}</h2>
                    <div className='buildFilter'>
                        <div className='buildFilterGroup'>
                            {this.props.uiText.get('element')}:
                            <Dropdown overlay={elementFilter} placement="bottomLeft">
                                <Button>
                                    {this.props.uiText.get(this.state.element, this.props.constants.getIn(['ELEMENT', this.state.element]))} <Icon type="down" />
                                </Button>
                            </Dropdown>
                        </div>
                        <div className='buildFilterGroup'>
                            {this.props.uiText.get('type')}:
                            <Dropdown overlay={typeFilter} placement="bottomLeft">
                                <Button>
                                    {this.props.uiText.get(this.state.type, this.state.type)} <Icon type="down" />
                                </Button>
                            </Dropdown>
                        </div>
                    </div>
                    <div className='buildCatalog'>
                        {catalog}
                    </div>
                    <Pagination current={buildCatalog.get('page', 1)} defaultPageSize={buildCatalog.get('limit', 15)} total={buildCatalog.get('count', 0)} onChange={(p) => this.paginate(p)}/>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BuildCatalog)
