import React from 'react'
import {NavLink} from 'react-router-dom'

const Link = (props) => {
    return <NavLink {...props} activeClassName="active"/>
}
export default Link
