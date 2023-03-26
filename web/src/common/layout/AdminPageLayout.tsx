import { observer } from 'mobx-react'
import React from 'react'
import { Link } from 'react-router-dom'
import { UserType } from '../../api/models/User'
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
                    <div className='sidebar'>
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
                                        <Link className='nav-link' to={navigationStore.href.adminIndex()}>
                                            Úvodní stránka
                                        </Link>
                                    </li>
                                    <li className='nav flex-column'>
                                        <Link className='nav-link' to={navigationStore.href.account()}>
                                            Můj účet
                                        </Link>
                                    </li>
                                    <li className='nav flex-column'>
                                        <Link className='nav-link' to={navigationStore.href.settings()}>
                                            Nastavení
                                        </Link>
                                    </li>

                                    <p className='text-muted mt-5 mb-2 ml-1'>Servisní případy</p>
                                    <li className='nav flex-column'>
                                        <Link className='nav-link' to={navigationStore.href.adminServiceCaseList()}>
                                            Všechny
                                        </Link>
                                    </li>
                                    <li className='nav flex-column'>
                                        <Link className='nav-link' to={navigationStore.href.adminServiceCaseList(authService.authUser?.id)}>
                                            Moje
                                        </Link>
                                    </li>

                                    <p className='text-muted mt-5 mb-2 ml-1'>Uživatelé</p>
                                    <li className='nav flex-column'>
                                        <Link
                                            className='nav-link'
                                            to={navigationStore.href.adminUsers(UserType.CLIENT.toLocaleLowerCase())}>
                                            Klienti
                                        </Link>
                                    </li>
                                    <li className='nav flex-column'>
                                        <Link
                                            className='nav-link'
                                            to={navigationStore.href.adminUsers(UserType.OPERATOR.toLocaleLowerCase())}>
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
                    <div className='p-5'>
                        <PageLayout>{props.children}</PageLayout>
                    </div>
                </div>
            </div>
        </>
    )
})
