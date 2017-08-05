import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'

import {Icon, Modal} from 'antd'

import {buildElementSelector, buildSelector, elementDataSelector} from '../selectors'

function generateLink(element, build, elementData) {
    let elementIndex = elementData.findIndex(a => a.get('element') === element)
    let buildString = ''
    elementData.getIn([elementIndex, 'buildFormat']).forEach(id => {
        let trait = build.get(id, '1')
        buildString += parseInt(trait, 10)
    })
    return `${window.location.protocol}//${window.location.host +
        window.location.pathname}?b=${elementIndex + buildString}`
}

const mapStateToProps = state => {
    return {
        element: buildElementSelector(state),
        buildData: buildSelector(state),
        elementData: elementDataSelector(state)
    }
}

class SkillShareMenu extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            show: false
        }
    }

    toggleModal() {
        this.setState({
            show: !this.state.show
        })
    }

    render() {
        const {t, element, buildData, elementData} = this.props
        const {show} = this.state

        return (
            <div className="share sub-menu-item">
                <a onClick={() => this.toggleModal()}>
                    {t('general:share')} <Icon type="share-alt" />
                </a>
                <Modal
                    title={t('general:share')}
                    visible={show}
                    onCancel={() => this.toggleModal()}
                    footer={null}
                    wrapClassName="skill-share-menu">
                    <input
                        className="share-link"
                        readOnly
                        value={generateLink(element, buildData, elementData)}
                        onClick={e => e.target.select()}
                    />
                </Modal>
            </div>
        )
    }
}

export default connect(mapStateToProps)(translate(['skills', 'general'])(SkillShareMenu))
