/* import React, { createElement, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { CircularProgress } from 'material-ui/Progress';

import {
    AdminRoutes,
    AppBar,
    Menu,
    Notification,
    Sidebar,
    setSidebarVisibility,
} from 'admin-on-rest';

const styles = {
    wrapper: {
        // Avoid IE bug with Flexbox, see #467
        display: 'flex',
        flexDirection: 'column',
    },
    main: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
    },
    body: {
        backgroundColor: '#f49842',
        display: 'flex',
        flex: 1,
        overflowY: 'hidden',
        overflowX: 'scroll',
    },
    content: {
        flex: 1,
        padding: '2em',
    },
    loader: {
        position: 'absolute',
        top: 0,
        right: 0,
        margin: 16,
        zIndex: 1200,
    },
};

class Layout extends Component {
    componentWillMount() {
        this.props.setSidebarVisibility(true);
    }
    
    render() {
        const {
            children,
            customRoutes,
            dashboard,
            isLoading,
            logout,
            menu,
            title,
        } = this.props;
        return (
            <MuiThemeProvider>
                <div style={styles.wrapper}>
                    <div style={styles.main}>
                        <AppBar title={title} />
                        <div className="body" style={styles.body}>
                            <div style={styles.content}>
                                {children}
                            </div>
                            <Sidebar>
                                {createElement(menu || Menu, {
                                    logout,
                                    hasDashboard: !!dashboard,
                                })}
                            </Sidebar>
                        </div>
                        <Notification />
                        {isLoading && (
                            <CircularProgress
                                color="#fff"
                                size={30}
                                thickness={2}
                                style={styles.loader}
                            />
                        )}
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

Layout.propTypes = {
    authClient: PropTypes.func,
    customRoutes: PropTypes.array,
    dashboard: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    isLoading: PropTypes.bool.isRequired,
    menu: PropTypes.element,
    resources: PropTypes.array,
    setSidebarVisibility: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({ isLoading: state.admin.loading > 0 });
export default connect(mapStateToProps, { setSidebarVisibility })(Layout); */