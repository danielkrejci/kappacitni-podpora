import React from 'react'
import { History, createBrowserHistory } from 'history'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import { NavigationStore } from './common/navigation/NavigationStore'
import { HomeStore } from './home/HomeStore'
import { ServiceCaseFormStore } from './serviceCaseForm/ServiceCaseFormStore'
import { HomePage } from './home/HomePage'
import { ServiceCaseFormPage } from './serviceCaseForm/ServiceCaseFormPage'
import { PageLayout } from './common/layout/PageLayout'
import { ServiceCaseDetailStore } from './serviceCaseDetail/ServiceCaseDetailStore'
import { ServiceCaseDetailPage } from './serviceCaseDetail/ServiceCaseDetailPage'

/**
 * Single browser history instance used by router and also by stores when it's needed (eg. for redirect after action).
 */
export const browserHistory: History = createBrowserHistory()

export const navigation = new NavigationStore(browserHistory)

const rootStore = {
    homeStore: new HomeStore(),
    serviceCaseFormStore: new ServiceCaseFormStore(),
    serviceCaseDetailStore: new ServiceCaseDetailStore(),
}

function App() {
    return (
        <div className='App'>
            <Router>
                <Routes>
                    <Route
                        path={navigation.href.index()}
                        loader={({ request, params }) => {
                            console.log('loader', request, params)
                        }}
                        element={
                            <PageLayout>
                                <HomePage store={rootStore.homeStore} />
                            </PageLayout>
                        }
                    />

                    <Route
                        path={navigation.href.serviceCaseForm()}
                        loader={({ request, params }) => {
                            console.log('loader', request, params)
                        }}
                        element={
                            <PageLayout>
                                <ServiceCaseFormPage store={rootStore.serviceCaseFormStore} />
                            </PageLayout>
                        }
                    />

                    <Route
                        path={navigation.href.serviceCaseDetail()}
                        loader={({ request, params }) => {
                            console.log('loader', request, params)
                        }}
                        element={
                            <PageLayout>
                                <ServiceCaseDetailPage store={rootStore.serviceCaseDetailStore} />
                            </PageLayout>
                        }
                    />

                    <Route path='/' element={<Navigate to={navigation.href.index()} replace />} />
                </Routes>
            </Router>
        </div>
    )
}

export default App
