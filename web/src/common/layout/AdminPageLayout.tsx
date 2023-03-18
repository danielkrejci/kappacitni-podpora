import { observer } from 'mobx-react'
import React from 'react'
import { Link } from 'react-router-dom'
import { authService, navigationStore } from '../../App'
import { PageLayout } from './PageLayout'

interface AdminPageLayoutProps {
    children: React.ReactNode
}

export const AdminPageLayout: React.FC<AdminPageLayoutProps> = observer(props => {
    return (
        <>
            <div className='content admin-page'>
                <div className='row clearfix m-0'>
                    <div className='col-4 col-xl-3 sidebar'>
                        <div className='p-5 position-fixed'>
                            <div>
                                <div className='d-flex align-items-center'>
                                    <img
                                        alt={`${authService.authUser!.name} ${authService.authUser!.surname}`}
                                        className='mr-2 rounded-circle'
                                        width='30px'
                                        src={authService.authUser!.picture}
                                    />
                                    <h3 className='mb-0'>
                                        {authService.authUser!.name} {authService.authUser!.surname}
                                    </h3>
                                </div>
                                <ul className='nav flex-column'>
                                    <p className='text-muted mt-5 mb-2 ml-1'>Přehled</p>
                                    <li className='nav flex-column'>
                                        <Link className='nav-link' to={'#'}>
                                            Úvodní stránka
                                        </Link>
                                    </li>
                                    <li className='nav flex-column'>
                                        <Link className='nav-link' to={'#'}>
                                            Můj účet
                                        </Link>
                                    </li>
                                    <li className='nav flex-column'>
                                        <Link className='nav-link' to={'#'}>
                                            Nastavení
                                        </Link>
                                    </li>

                                    <p className='text-muted mt-5 mb-2 ml-1'>Servisní případy</p>
                                    <li className='nav flex-column'>
                                        <Link className='nav-link' to={'#'}>
                                            Všechny
                                        </Link>
                                    </li>
                                    <li className='nav flex-column'>
                                        <Link className='nav-link' to={'#'}>
                                            Moje
                                        </Link>
                                    </li>

                                    <p className='text-muted mt-5 mb-2 ml-1'>Uživatelé</p>
                                    <li className='nav flex-column'>
                                        <Link className='nav-link' to={'#'}>
                                            Klienti
                                        </Link>
                                    </li>
                                    <li className='nav flex-column'>
                                        <Link className='nav-link' to={'#'}>
                                            Operátoři
                                        </Link>
                                    </li>

                                    <li className='nav flex-column position-fixed' style={{ bottom: '40px' }}>
                                        <Link
                                            className='nav-link'
                                            to='#'
                                            onClick={() => {
                                                authService.logout()
                                                navigationStore.login()
                                            }}>
                                            Odhlásit se
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className='col-8 col-xl-9'>
                        <div className='p-5'>
                            <PageLayout>{props.children}</PageLayout>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
})
