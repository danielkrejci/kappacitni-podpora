import { createContext, useContext } from 'react'
import { NavigationStore } from './NavigationStore'
import { History, createBrowserHistory } from 'history'

// Default browser history
export const browserHistory: History = createBrowserHistory({ basename: '/' })

/**
 * Definition of navigation context type.
 */
export type NavigationContextType = {
    navigation: NavigationStore
    setNavigation: (navigation: NavigationStore) => void
}

export const NavigationContext = createContext<NavigationContextType>({
    navigation: new NavigationStore(browserHistory),
    setNavigation: navigation => console.warn('No navigation provider'),
})
export const useNavigation = () => useContext(NavigationContext)
