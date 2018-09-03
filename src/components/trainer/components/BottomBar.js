import React from 'react'
import {connect} from 'react-redux'
import {Map} from 'immutable'

import {uiTextSelector, patchRefSelector, patchSelector} from '../selector'

import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar'
import DropdownButton from 'react-bootstrap/lib/DropdownButton'
import MenuItem from 'react-bootstrap/lib/MenuItem'

const mapStateToProps = (state) => {
    return {
        uiText: uiTextSelector(state).get('BOTTOM_BAR', Map()),
        patches: patchRefSelector(state),
        currentPatch: patchSelector(state)
    }
}

class BottomBar extends React.Component {
    render() {
        let buttonTitle = <span></span>
        // <MenuItem>Action</MenuItem>
        let patches = []
        this.props.patches.forEach((p, id) => {
            patches.push(
                <MenuItem key={id} active={p.get('date') == this.props.currentPatch || (this.props.currentPatch == 'BASE' && id == 0)}>{p.get('name')}
                    <small> {p.get('date')}</small>
                </MenuItem>
            )

            if (p.get('date') == this.props.currentPatch || (this.props.currentPatch == 'BASE' && id == 0)) {
                buttonTitle = <span className='patch'>
                    <span className='patchHeader'>{this.props.uiText.get('patchHeader', '')}: </span>
                    {p.get('name')}
                </span>
            }
        })

        return (
            <ButtonToolbar className='bottomBar'>
                <DropdownButton dropup noCaret title={buttonTitle} id="split-button-dropup">
                    {patches}
                </DropdownButton>
            </ButtonToolbar>
        )
    }
}

export default connect(mapStateToProps)(BottomBar)
