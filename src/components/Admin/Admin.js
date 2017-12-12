import React from 'react'
import {connect} from 'react-redux'
import {Helmet} from 'react-helmet'
import {Fade} from 'react-reveal'
import {animateScroll} from 'react-scroll'
import {Row, Col} from 'antd'

import {loadingSelector} from '../../selectors'

import './styles/Admin.scss'

import LoadingLyn from '../LoadingLyn/LoadingLyn'
import Header from './components/AdminHeader'
import AdminSideMenu from './components/AdminSideMenu'

const mapStateToProps = state => {
    return {
        loading: loadingSelector(state)
    }
}

class Admin extends React.PureComponent {
    componentDidMount() {
        animateScroll.scrollToTop()
    }

    render() {
        const {loading} = this.props

        let content = <LoadingLyn />
        if (!loading) {
            content = (
                <Row gutter={16}>
                    <Col sm={6}>
                        <AdminSideMenu />
                    </Col>
                    <Col sm={18}>
                        <span />
                    </Col>
                </Row>
            )
        }

        return (
            <Fade className="admin container">
                <Helmet>
                    <title>Admin | BnSTree</title>
                </Helmet>
                <Header />
                <div className="main-container">{content}</div>
            </Fade>
        )
    }
}

export default connect(mapStateToProps)(Admin)
