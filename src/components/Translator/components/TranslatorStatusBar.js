import React from 'react'
import {connect} from 'react-redux'

import {languageStatusSelector} from '../selectors'
import {setLanguageName, setLanguageStatus, saveTranslation} from '../actions'

import {Checkbox, Icon, Tooltip, Button} from 'antd'

const mapStateToProps = state => {
    return {
        languageStatus: languageStatusSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setName: name => dispatch(setLanguageName(name)),
        setStatus: status => dispatch(setLanguageStatus(status)),
        save: () => dispatch(saveTranslation())
    }
}

const TranslatorStatusBar = props => {
    let {languageStatus, setName, setStatus, save} = props

    return (
        <div className="translator-status-bar sub-menu">
            <div className="sub-menu-left">
                <h3 className="language-code sub-menu-item">
                    {languageStatus.get('_id', '').toUpperCase()}
                </h3>
                <div className="language-name sub-menu-item">
                    <input
                        value={languageStatus.get('name', '')}
                        placeholder="Language Name"
                        onChange={e => setName(e.target.value)}
                    />
                </div>
                <div className="language-toggle sub-menu-item">
                    <Checkbox
                        defaultChecked={false}
                        size="small"
                        onChange={e => setStatus(e.target.checked)}
                        checked={languageStatus.get('enabled')}>
                        Enable
                    </Checkbox>
                    <Tooltip
                        placement="bottomLeft"
                        title="Only you can view your changes on BnSTree when disabled">
                        <Icon type="info-circle-o" />
                    </Tooltip>
                </div>
            </div>
            <div className="sub-menu-right">
                <Button type="primary" onClick={save}>
                    Save
                </Button>
            </div>
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(TranslatorStatusBar)
