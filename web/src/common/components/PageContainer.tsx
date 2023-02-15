import { NavigationContainer } from './NavigationContainer'

interface PageContainerProps {
    children: JSX.Element
}

export const PageContainer = (props: PageContainerProps): JSX.Element => {
    return (
        <div>
            <div>
                <NavigationContainer />
            </div>
            <div>{props.children}</div>
        </div>
    )
}
