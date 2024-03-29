import { Link } from 'react-router-dom'
import { navigationStore } from '../../../App'
import { HomeStore } from './HomeStore'

interface HomePageProps {
    store: HomeStore
}

export const HomePage = (props: HomePageProps): JSX.Element => {
    return (
        <div className='content'>
            <div className='mt-0'>
                <div className='hero-image text-center py-5'>
                    <h1 className='my-5 text-uppercase'>Kappacitní podpora</h1>
                </div>

                <div className='container py-5'>
                    <div className='row clearfix'>
                        <div className='col-12'>
                            <h2>Jsme tu pro tebe</h2>
                            <p>Vyber produkt a&nbsp;my ti najdeme nejlepší řešení.</p>

                            <div className='row clearfix mt-5' id='devices'>
                                <div className='col-6 col-md-4 col-lg-2 mb-5 mb-md-4 mb-lg-0'>
                                    <Link to={navigationStore.href.serviceCaseForm('myphone')}>
                                        <img style={{ width: '40px', height: '75px' }} src='img/devices/myphone.png' alt='myPhone' />
                                        <p>myPhone</p>
                                    </Link>
                                </div>

                                <div className='col-6 col-md-4 col-lg-2 mb-5 mb-md-0'>
                                    <Link to={navigationStore.href.serviceCaseForm('mypad')}>
                                        <img style={{ width: '50px', height: '80px' }} src='img/devices/mypad.png' alt='myPad' />
                                        <p>myPad</p>
                                    </Link>
                                </div>

                                <div className='col-6 col-md-4 col-lg-2 mb-5 mb-md-4 mb-lg-0'>
                                    <Link to={navigationStore.href.serviceCaseForm('mybook')}>
                                        <img style={{ width: '110px', height: '70px' }} src='img/devices/mybook.png' alt='myBook' />
                                        <p>myBook</p>
                                    </Link>
                                </div>

                                <div className='col-6 col-md-4 col-lg-2 mb-5 mb-md-4 mb-lg-0'>
                                    <Link to={navigationStore.href.serviceCaseForm('mystudio')}>
                                        <img style={{ width: '85px', height: '75px' }} src='img/devices/mystudio.png' alt='myStudio' />
                                        <p>myStudio</p>
                                    </Link>
                                </div>

                                <div className='col-6 col-md-4 col-lg-2'>
                                    <Link to={navigationStore.href.serviceCaseForm('mywatch')}>
                                        <img style={{ width: '90px', height: '70px' }} src='img/devices/mywatch.png' alt='myWatch' />
                                        <p>myWatch</p>
                                    </Link>
                                </div>

                                <div className='col-6 col-md-4 col-lg-2'>
                                    <Link to={navigationStore.href.serviceCaseForm('mypods')}>
                                        <img style={{ width: '95px', height: '85px' }} src='img/devices/mypods.png' alt='myPods' />
                                        <p>myPods</p>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='container py-5'>
                    <div className='row clearfix'>
                        <div className='col-12 col-md-4 mb-5 mb-md-0'>
                            <h2>Máš otázku?</h2>
                            <p>Zeptej se všech. Možná najdeš odpověď na&nbsp;našich komunitních fórech.</p>
                            <p>
                                <Link to='#'>
                                    Zeptat se komunity <i className='fa fa-chevron-right'></i>
                                </Link>
                            </p>
                        </div>

                        <div className='col-12 col-md-4 mb-5 mb-md-0'>
                            <h2>Jak můžeme pomoci?</h2>
                            <p>Zodpověz nám pár otázek a&nbsp;my ti pomůžeme najít to&nbsp;nejlepší řešení.</p>
                            <p>
                                <Link to='#'>
                                    Využít podporu <i className='fa fa-chevron-right'></i>
                                </Link>
                            </p>
                        </div>

                        <div className='col-12 col-md-4 mb-5 mb-md-0'>
                            <h2>Záruka a servis</h2>
                            <p>Podívej se, jestli máš u&nbsp;svého poduktu nárok na&nbsp;servis a&nbsp;podporu v&nbsp;rámci naší záruky.</p>
                            <p>
                                <Link to='#'>
                                    Podívat se na stav <i className='fa fa-chevron-right'></i>
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
