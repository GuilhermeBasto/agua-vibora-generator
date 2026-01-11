import { useEffect } from 'react'
import { useNavigation } from 'react-router'

/**
 * Hook that automatically closes the keyboard on Android/iOS when navigation starts
 * Useful to prevent keyboard staying open when changing pages/loading data
 */
export function useCloseKeyboardOnNavigation() {
    const navigation = useNavigation()

    useEffect(() => {
        // When navigation starts, close the keyboard
        if (navigation.state === 'loading') {
            // Method 1: Blur the active element (works on most devices)
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur()
            }

            // Method 2: Try to hide keyboard using viewport meta (Android specific)
            const activeElement = document.activeElement as HTMLElement
            if (
                activeElement &&
                (activeElement.tagName === 'INPUT' ||
                    activeElement.tagName === 'TEXTAREA')
            ) {
                activeElement.blur()

                // Force hide keyboard on Android
                if (
                    /Android/i.test(navigator.userAgent) &&
                    activeElement instanceof HTMLInputElement
                ) {
                    activeElement.readOnly = true
                    setTimeout(() => {
                        activeElement.readOnly = false
                    }, 100)
                }
            }
        }
    }, [navigation.state])
}
