import React from 'react'


import './styles/ErrorMessage.scss'

const ErrorMessage = props => {
    let { error } = props

    let message = <h1>404 Not Found</h1>
    if (error) {
        message = (
            <h1>
                Something went wrong... <br />
                <small>Try refreshing the page. That's a good trick.</small>
            </h1>
        )
    }

    return <div className="error-message">{message}</div>
}

export default ErrorMessage
