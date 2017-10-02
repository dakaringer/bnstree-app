import React from 'react'
import {connect} from 'react-redux'

import {referenceDataSelector} from '../selectors'

const mapStateToProps = state => {
    return {
        referenceData: referenceDataSelector(state)
    }
}

const TranslatorNamespaceSelector = props => {
    let {referenceData} = props

    return (
        <div className="translator-list">
            <div />
        </div>
    )
}

export default connect(mapStateToProps)(TranslatorNamespaceSelector)
