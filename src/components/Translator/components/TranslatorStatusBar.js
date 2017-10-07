import React from 'react'
import {connect} from 'react-redux'

import {
    languageSelector,
    languageStatusSelector,
    loadingSelector,
    errorSelector
} from '../selectors'
import {setLanguageName, setLanguageStatus, saveTranslation} from '../actions'

import {Checkbox, Icon, Tooltip, Button} from 'antd'

const mapStateToProps = state => {
    return {
        language: languageSelector(state),
        languageStatus: languageStatusSelector(state),
        loading: loadingSelector(state),
        error: errorSelector(state)
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
    let {language, languageStatus, setName, setStatus, save, loading, error} = props

    let loadingText = ''
    if (loading.size !== 0) {
        let loadingStatus = false
        loading.forEach(l => {
            loadingStatus = l || loadingStatus
        })

        loadingText = loadingStatus ? 'Saving' : `Saved ${new Date().toTimeString()}`
    }

    if (error) {
        loadingText = 'Error'
    }

    return (
        <div className="translator-status-bar sub-menu">
            <div className="sub-menu-left">
                <h3 className="language-code sub-menu-item">{language.toUpperCase()}</h3>
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
                        title="Only enable when the translations are ready for public viewing. When it's disabled only you (and other translators of the same language) can view the changes on site. Using incongnito mode to disable caching (and refreshing two times) is recommended while testing.">
                        <Icon type="info-circle-o" />
                    </Tooltip>
                </div>
            </div>
            <div className="sub-menu-right">
                <p className="language-loading">{loadingText}</p>
                <Button type="primary" onClick={save}>
                    Save
                </Button>
            </div>
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(TranslatorStatusBar)
