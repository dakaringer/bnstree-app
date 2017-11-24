import React from 'react'
import {Fade} from 'react-reveal'

import './styles/NotFound.scss'

const NotFound = () => {
    return (
        <Fade className="notFound">
            <h1>404 Not Found</h1>
            <p>{window.location.href}</p>
        </Fade>
    )
}

export default NotFound
