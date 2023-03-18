import { navigationStore } from '../../App'

export const NavigationContainer = (): JSX.Element => {
    return (
        <div>
            <ul>
                <li>
                    <a href={navigationStore.href.index()}>Home</a>
                </li>
                <li>
                    <a href={navigationStore.href.serviceCaseForm()}>Form</a>
                </li>
            </ul>
        </div>
    )
}
