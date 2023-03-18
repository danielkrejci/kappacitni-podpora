import React from 'react'
import { Redirect, Route, Router, Switch } from 'react-router-dom'
import { NavigationStore } from './common/navigation/NavigationStore'
import { HomeStore } from './home/HomeStore'
import { ServiceCaseFormStore } from './serviceCaseForm/ServiceCaseFormStore'
import { HomePage } from './home/HomePage'
import { ServiceCaseFormPage } from './serviceCaseForm/ServiceCaseFormPage'
import { PageLayout } from './common/layout/PageLayout'
import { ServiceCaseDetailStore } from './serviceCaseDetail/ServiceCaseDetailStore'
import { ServiceCaseDetailPage } from './serviceCaseDetail/ServiceCaseDetailPage'
import { LoginPage } from './admin/login/LoginPage'
import { LoginStore } from './admin/login/LoginStore'
import { AuthService } from './api/services/AuthService'
import { AdminPageLayout } from './common/layout/AdminPageLayout'
import { AdminIndexStore } from './admin/index/AdminIndexStore'
import { AdminIndexPage } from './admin/index/AdminIndexPage'
import { browserHistory, NavigationContext } from './common/navigation/NavigationContext'
import { observer } from 'mobx-react'

// Global navigation store instance
export const navigationStore = new NavigationStore(browserHistory)

const rootStore = {
    homeStore: new HomeStore(),
    serviceCaseFormStore: new ServiceCaseFormStore(),
    serviceCaseDetailStore: new ServiceCaseDetailStore(),
    loginStore: new LoginStore(),
    adminIndexStore: new AdminIndexStore(),
}

export const authService = new AuthService()

export const App = observer((props: any) => {
    const [navigation, setNavigation] = React.useState(navigationStore)

    return (
        <NavigationContext.Provider value={{ navigation, setNavigation }}>
            <Router history={browserHistory}>
                <Switch>
                    <Route
                        path={navigation.href.index()}
                        render={() => (
                            <PageLayout>
                                <HomePage store={rootStore.homeStore} />
                            </PageLayout>
                        )}
                    />

                    <Route
                        path={navigation.href.serviceCaseForm()}
                        render={() => (
                            <PageLayout>
                                <ServiceCaseFormPage store={rootStore.serviceCaseFormStore} />
                            </PageLayout>
                        )}
                    />

                    <Route
                        path={navigation.href.serviceCaseDetail()}
                        render={() => (
                            <PageLayout>
                                <ServiceCaseDetailPage store={rootStore.serviceCaseDetailStore} />
                            </PageLayout>
                        )}
                    />

                    <Route
                        path={navigation.href.login()}
                        render={() =>
                            !authService.isLoggedIn ? (
                                <PageLayout>
                                    <LoginPage store={rootStore.loginStore} />
                                </PageLayout>
                            ) : (
                                <Redirect to={navigation.href.adminIndex()} />
                            )
                        }
                    />

                    <Route
                        path={navigation.href.adminIndex()}
                        render={() =>
                            authService.isLoggedIn ? (
                                <AdminPageLayout>
                                    {authService.isLoggedIn}
                                    <AdminIndexPage store={rootStore.adminIndexStore} />
                                </AdminPageLayout>
                            ) : (
                                <PageLayout>
                                    {authService.isLoggedIn}
                                    <LoginPage store={rootStore.loginStore} />
                                </PageLayout>
                            )
                        }
                    />

                    <Route path='/admin' render={() => <Redirect to={navigation.href.login()} />} />

                    <Route path='/' render={() => <Redirect to={navigation.href.index()} />} />
                </Switch>
            </Router>
        </NavigationContext.Provider>
    )
})

export default App
