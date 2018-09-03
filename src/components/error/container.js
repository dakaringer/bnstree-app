import React from 'react'

import ClassLinks from '../shared/components/classLinks/container2'

import {connect} from 'react-redux'

import './styles/error.scss'

const Main = () => {
    return (
        <div>
            <div className="main error">
                <div>
                    <h1>
                        <small>error</small>
                        404
                    </h1>
                    <h3>This isn't the page you're looking for.</h3>
                    <p>If you used an old build link, it doesn't work anymore. It's outdated anyway...<br/>Use the *new* tree links below.</p>
                </div>
            </div>
            <ClassLinks/>
            <div className='sub-block'>

            </div>
        </div>
    )
}

export default connect()(Main)
