import React from 'react'
import { Redirect, Route, Router, Switch } from 'react-router-dom'
import { NavigationStore } from './common/navigation/NavigationStore'
import { HomeStore } from './pages/web/home/HomeStore'
import { HomePage } from './pages/web/home/HomePage'
import { PageLayout } from './common/layout/PageLayout'
import { LoginPage } from './pages/admin/login/LoginPage'
import { LoginStore } from './pages/admin/login/LoginStore'
import { AuthService } from './api/services/AuthService'
import { AdminPageLayout } from './common/layout/AdminPageLayout'
import { AdminIndexStore } from './pages/admin/index/AdminIndexStore'
import { AdminIndexPage } from './pages/admin/index/AdminIndexPage'
import { browserHistory, NavigationContext } from './common/navigation/NavigationContext'
import { observer } from 'mobx-react'
import { UserListPage } from './pages/admin/user/UserListPage'
import { UserListStore } from './pages/admin/user/UserListStore'
import { ServiceCaseDetailPage } from './pages/web/service-case/detail/ServiceCaseDetailPage'
import { ServiceCaseDetailStore } from './pages/web/service-case/detail/ServiceCaseDetailStore'
import { ServiceCaseFormPage } from './pages/web/service-case/form/ServiceCaseFormPage'
import { ServiceCaseFormStore } from './pages/web/service-case/form/ServiceCaseFormStore'
import { ServiceCaseListPage } from './pages/admin/service-case/list/ServiceCaseListPage'
import { ServiceCaseListStore } from './pages/admin/service-case/list/ServiceCaseListStore'
import { AdminServiceCaseDetailStore } from './pages/admin/service-case/detail/AdminServiceCaseDetailStore'
import { AdminServiceCaseDetailPage } from './pages/admin/service-case/detail/AdminServiceCaseDetailPage'
import { AccountPage } from './pages/admin/account/AccountPage'
import { AccountStore } from './pages/admin/account/AccountStore'
import { SettingsPage } from './pages/admin/settings/SettingsPage'
import { PrivacyPolicyPage } from './pages/web/privacy-policy/PrivacyPolicyPage'

// Global navigation store instance
export const navigationStore = new NavigationStore(browserHistory)

const rootStore = {
    homeStore: new HomeStore(),
    serviceCaseFormStore: new ServiceCaseFormStore(),
    serviceCaseDetailStore: new ServiceCaseDetailStore(),
    loginStore: new LoginStore(),
    accountStore: new AccountStore(),
    adminIndexStore: new AdminIndexStore(),
    adminUsersStore: new UserListStore(),
    adminServiceCasesListStore: new ServiceCaseListStore(),
    adminServiceCasesDetailStore: new AdminServiceCaseDetailStore(),
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
                        path={navigation.href.privacyPolicy()}
                        render={() => (
                            <PageLayout>
                                <PrivacyPolicyPage />
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
                                    <AdminIndexPage store={rootStore.adminIndexStore} />
                                </AdminPageLayout>
                            ) : (
                                <PageLayout>
                                    <LoginPage store={rootStore.loginStore} />
                                </PageLayout>
                            )
                        }
                    />

                    <Route
                        path={navigation.href.account()}
                        render={() =>
                            authService.isLoggedIn ? (
                                <AdminPageLayout>
                                    <AccountPage store={rootStore.accountStore} />
                                </AdminPageLayout>
                            ) : (
                                <PageLayout>
                                    <LoginPage store={rootStore.loginStore} loginRedirect={() => navigation.account()} />
                                </PageLayout>
                            )
                        }
                    />

                    <Route
                        path={navigation.href.settings()}
                        render={() =>
                            authService.isLoggedIn ? (
                                <AdminPageLayout>
                                    <SettingsPage />
                                </AdminPageLayout>
                            ) : (
                                <PageLayout>
                                    <LoginPage store={rootStore.loginStore} loginRedirect={() => navigation.settings()} />
                                </PageLayout>
                            )
                        }
                    />

                    <Route
                        path={navigation.href.adminUsers()}
                        render={() =>
                            authService.isLoggedIn ? (
                                <AdminPageLayout>
                                    <UserListPage store={rootStore.adminUsersStore} />
                                </AdminPageLayout>
                            ) : (
                                <PageLayout>
                                    <LoginPage
                                        store={rootStore.loginStore}
                                        loginRedirect={() => {
                                            const split = window.location.pathname.split('/')
                                            const type = split[split.length - 1]
                                            navigation.adminUsers(type ?? '')
                                        }}
                                    />
                                </PageLayout>
                            )
                        }
                    />

                    <Route
                        path={navigation.href.adminServiceCaseDetail()}
                        render={() =>
                            authService.isLoggedIn ? (
                                <AdminPageLayout>
                                    <AdminServiceCaseDetailPage store={rootStore.adminServiceCasesDetailStore} />
                                </AdminPageLayout>
                            ) : (
                                <PageLayout>
                                    <LoginPage
                                        store={rootStore.loginStore}
                                        loginRedirect={() => {
                                            const split = window.location.pathname.split('/')
                                            const id = split[split.length - 1]
                                            navigation.adminServiceCaseDetail(id ?? '')
                                        }}
                                    />
                                </PageLayout>
                            )
                        }
                    />

                    <Route
                        path='/admin/service-cases'
                        render={() =>
                            authService.isLoggedIn ? (
                                <AdminPageLayout>
                                    <ServiceCaseListPage store={rootStore.adminServiceCasesListStore} />
                                </AdminPageLayout>
                            ) : (
                                <PageLayout>
                                    <LoginPage
                                        store={rootStore.loginStore}
                                        loginRedirect={() => {
                                            const query = new URLSearchParams(window.location.search)
                                            navigation.adminServiceCaseList(
                                                query.get('operatorId') ?? '',
                                                query.get('clientId') ?? '',
                                                query.get('state') ?? '',
                                                query.get('page') ?? '',
                                                query.get('sort') ?? ''
                                            )
                                        }}
                                    />
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
