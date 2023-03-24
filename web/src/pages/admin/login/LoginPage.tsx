import { GoogleLogin } from '@react-oauth/google'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { navigationStore } from '../../../App'
import { Row } from '../../../common/components/Row'
import { LoginStore } from './LoginStore'

interface LoginPageProps {
    store: LoginStore
    loginRedirect?: () => void
}

export const LoginPage: React.FC<LoginPageProps> = observer(props => {
    const store = props.store

    useEffect(() => {
        if (!store.initDone) {
            store.init(props.loginRedirect)
        }
    }, [props.loginRedirect, store])

    return (
        <div className='content'>
            <div className='mt-0'>
                <div className='hero-image text-center py-5'>
                    <h1 className='my-5 text-uppercase'>Administrace</h1>
                </div>

                <div className='container py-5'>
                    <Row className='justify-content-center align-items-center flex-column'>
                        <h2 className='mb-3'>Přihlášení</h2>
                        <GoogleLogin onSuccess={res => store.onSuccess(res)} onError={() => store.onFailure()} />

                        <p className='mt-5'>
                            <a href={navigationStore.href.index()}>
                                Přejít na úvodní stránku&nbsp;
                                <i className='fa fa-arrow-right' />
                            </a>
                        </p>
                    </Row>
                </div>
            </div>
        </div>
    )
})
