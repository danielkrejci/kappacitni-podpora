import { navigation } from '../../App'

export const NavigationContainer = (): JSX.Element => {
    return (
        <div>
            <ul>
                <li>
                    <a href={navigation.href.home()}>Home</a>
                </li>
                <li>
                    <a href={navigation.href.serviceCaseForm()}>Form</a>
                </li>
            </ul>
        </div>
    )
}
