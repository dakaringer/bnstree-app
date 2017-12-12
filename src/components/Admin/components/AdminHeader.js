import React from 'react'

import icon from '../images/GameUI_HeaderIcon_234.png'

const AdminHeader = props => {
    return (
        <div className="admin-header section-header">
            <div className="header-title">
                <img alt="admin" src={icon} />
                <span>Admin Panel</span>
            </div>
        </div>
    )
}

export default AdminHeader
