import { useEffect } from 'react'
import { Label } from '../common/components/Label'
import { Select } from '../common/components/Select'
import { ServiceCaseFormStore } from './ServiceCaseFormStore'

interface ServiceCaseFormPageProps {
    store: ServiceCaseFormStore
}

export const ServiceCaseFormPage = (props: ServiceCaseFormPageProps): JSX.Element => {
    const store = props.store

    useEffect(() => {
        store.init()
    }, [store])

    return (
        <div className='content'>
            <div className='mt-0'>
                <div className='hero-image text-center py-5'>
                    <h1 className='my-5'>Podpora pro =$device_type['device-types_name']</h1>
                </div>

                <form>
                    <div className='container pb-5 pt-4'>
                        <div className='row clearfix'>
                            <div className='col-12'>
                                {false && (
                                    <div className='form-overlay'>
                                        <div>
                                            <h1 className='mb-3'>
                                                <i className='fa fa-clock'></i>
                                            </h1>
                                            <p className='mb-1'>
                                                <strong>V tuto chvíli nepřijímáme servisní případy.</strong>
                                            </p>
                                            <p>Zkuste to prosím znovu později.</p>
                                        </div>
                                    </div>
                                )}

                                <p className='mb-5 text-muted'>
                                    <a href='/index'>Úvodní stránka</a> / Podpora pro =$device_type['device-types_name']
                                </p>

                                <h2>Jaký máš s =$device_type['device-types_name'] problém?</h2>
                                <p>
                                    Vyber požadované téma a popíš svůj problém.
                                    <br />
                                    Spojíme se&nbsp;e-mailem a&nbsp;najdeme ti&nbsp;ty&nbsp;nejlepší možnosti řešení.
                                </p>

                                <div className='row clearfix my-5'>
                                    <div className='col-12 col-md-4'>
                                        <div className='form-group'>
                                            <Label id='case-type'>Vyber téma:</Label>
                                            <Select name='case-type' field={store.form.caseType} required />
                                        </div>
                                    </div>
                                    <div className='col-12 col-md-4'>
                                        <div className='form-group'>
                                            <label htmlFor='serial-number'>Sériové číslo:</label>
                                            <input
                                                value="=($serial_number) ? $serial_number : ''"
                                                id='serial-number'
                                                name='serial-number'
                                                type='text'
                                                className='form-control'
                                                required
                                                autoComplete='off'
                                            />
                                            <small className='form-text text-muted'>Povinný údaj.</small>
                                        </div>
                                    </div>
                                    <div className='col-12'>
                                        <div className='form-group'>
                                            <label htmlFor='message'>Zpráva:</label>
                                            <textarea
                                                maxLength={5000}
                                                id='message'
                                                name='message'
                                                className='form-control'
                                                rows={7}
                                                required
                                                autoComplete='off'></textarea>
                                            <div className='d-flex justify-content-between'>
                                                <small className='form-text text-muted'>Povinný údaj.</small>
                                                <small className='form-text text-muted'>
                                                    Zbývá <span id='char-count'>5000</span> znaků.
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <h2>Informace o tobě</h2>

                                <div className='row clearfix mt-5'>
                                    <div className='col-12 col-md-4'>
                                        <div className='form-group'>
                                            <label htmlFor='name'>Jméno:</label>
                                            <input id='name' name='name' type='text' className='form-control' required autoComplete='off' />
                                            <small className='form-text text-muted'>Povinný údaj.</small>
                                        </div>
                                    </div>
                                    <div className='col-12 col-md-4'>
                                        <div className='form-group'>
                                            <label htmlFor='surname'>Příjmení:</label>
                                            <input
                                                id='surname'
                                                name='surname'
                                                type='text'
                                                className='form-control'
                                                required
                                                autoComplete='off'
                                            />
                                            <small className='form-text text-muted'>Povinný údaj.</small>
                                        </div>
                                    </div>
                                </div>
                                <div className='row clearfix'>
                                    <div className='col-12 col-md-4'>
                                        <div className='form-group'>
                                            <label htmlFor='email'>E-mail:</label>
                                            <input
                                                id='email'
                                                name='email'
                                                type='email'
                                                className='form-control'
                                                required
                                                autoComplete='off'
                                            />
                                            <small className='form-text text-muted'>Povinný údaj.</small>
                                        </div>
                                    </div>
                                    <div className='col-12 col-md-4'>
                                        <div className='form-group'>
                                            <label htmlFor='phone'>Telefon:</label>
                                            <div className='input-group'>
                                                <div className='input-group-prepend'>
                                                    <select id='prefix' name='prefix' className='form-control' required>
                                                        <option value='+420' selected>
                                                            +420
                                                        </option>
                                                        <option value='+421'>+421</option>
                                                    </select>
                                                </div>
                                                <input id='phone' name='phone' type='text' className='form-control' autoComplete='off' />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='row clearfix mt-5'>
                                    <div className='col-12 col-md-4'>
                                        <div className='form-group'>
                                            <label htmlFor='street'>Ulice:</label>
                                            <input id='street' name='street' type='text' className='form-control' autoComplete='off' />
                                        </div>
                                    </div>
                                    <div className='col-12 col-md-2'>
                                        <div className='form-group'>
                                            <label htmlFor='house-number'>ČP:</label>
                                            <input
                                                id='house-number'
                                                name='house-number'
                                                type='text'
                                                className='form-control'
                                                autoComplete='off'
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='row clearfix'>
                                    <div className='col-12 col-md-4'>
                                        <div className='form-group'>
                                            <label htmlFor='city'>Město:</label>
                                            <input id='city' name='city' type='text' className='form-control' autoComplete='off' />
                                        </div>
                                    </div>
                                    <div className='col-12 col-md-2'>
                                        <div className='form-group'>
                                            <label htmlFor='postal-code'>PSČ:</label>
                                            <input
                                                maxLength={5}
                                                id='postal-code'
                                                name='postal-code'
                                                type='text'
                                                className='form-control'
                                                autoComplete='off'
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className='row clearfix mt-5 align-items-center'>
                                    <div className='col-12 col-xl-6'>
                                        <div className='form-group'>
                                            <div className='form-check'>
                                                <input
                                                    className='form-check-input'
                                                    type='checkbox'
                                                    value=''
                                                    name='terms'
                                                    id='terms'
                                                    required
                                                />
                                                <label className='form-check-label' htmlFor='terms'>
                                                    Potvrzuji, že jsem se seznámil/a s{' '}
                                                    <a href='/privacy-policy' target='_blank'>
                                                        podmínkami zpracovávání osobních údajů
                                                    </a>{' '}
                                                    společností Kappacitní Podpora s.r.o.
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <input type='hidden' readOnly name='device-type-id' value="=$device_type['device-types_id']" />

                                    <div className='col-12 col-xl-6 text-center text-xl-right mt-5 mt-xl-0'>
                                        <button type='button' className='btn btn-primary'>
                                            Odeslat
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
