import { GoogleOAuthProvider } from '@react-oauth/google'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

ReactDOM.render(
    <GoogleOAuthProvider clientId='440750977540-89l2ll74t5bqlj5cjh8q4rktmvd0igo2.apps.googleusercontent.com'>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </GoogleOAuthProvider>,
    document.getElementById('root') as HTMLElement
)
