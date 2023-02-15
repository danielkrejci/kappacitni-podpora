import React from 'react'
import { History, createBrowserHistory } from 'history'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import { NavigationStore } from './common/navigation/NavigationStore'
import { HomeStore } from './home/HomeStore'
import { ServiceCaseFormStore } from './serviceCaseForm/ServiceCaseFormStore'
import { HomePage } from './home/HomePage'
import { ServiceCaseFormPage } from './serviceCaseForm/ServiceCaseFormPage'
import { PageContainer } from './common/components/PageContainer'

import './App.css'

/**
 * Single browser history instance used by router and also by stores when it's needed (eg. for redirect after action).
 */
export const browserHistory: History = createBrowserHistory()

export const navigation = new NavigationStore(browserHistory)

const rootStore = {
    homeStore: new HomeStore(),
    ServiceCaseFormStore: new ServiceCaseFormStore(),
}

function App() {
    return (
        <div className='App'>
            <Router>
                <Routes>
                    <Route
                        path={navigation.href.home()}
                        loader={({ request, params }) => {
                            console.log('loader', request, params)
                        }}
                        element={<HomePage store={rootStore.homeStore} />}
                    />

                    <Route
                        path={navigation.href.serviceCaseForm()}
                        loader={({ request, params }) => {
                            console.log('loader', request, params)
                        }}
                        element={<ServiceCaseFormPage store={rootStore.ServiceCaseFormStore} />}
                    />

                    <Route path='/' element={<Navigate to={navigation.href.home()} replace />} />
                </Routes>
            </Router>
        </div>
    )
}

export default App
