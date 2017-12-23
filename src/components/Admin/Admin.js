import React from 'react'
import {Helmet} from 'react-helmet'
import {Fade} from 'react-reveal'
import {animateScroll} from 'react-scroll'
import {Row, Col} from 'antd'

import './styles/Admin.scss'

import Header from './components/AdminHeader'
import AdminSideMenu from './components/AdminSideMenu'
import AdminMainMenu from './components/AdminMainMenu'

class Admin extends React.PureComponent {
    componentDidMount() {
        animateScroll.scrollToTop()
    }

    render() {
        return (
            <Fade className="admin container">
                <Helmet>
                    <title>Admin | BnSTree</title>
                </Helmet>
                <Header />
                <div className="main-container">
                    <Row gutter={16}>
                        <Col sm={6}>
                            <AdminSideMenu />
                        </Col>
                        <Col sm={18}>
                            <AdminMainMenu />
                        </Col>
                    </Row>
                </div>
            </Fade>
        )
    }
}

export default Admin
