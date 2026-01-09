import { useEffect, useState } from 'react'
import { cn } from '~/lib/utils'
import { Icon } from './Icon'
import { buttonVariants } from './ui/button'

type BeforeInstallPromptEvent = Event & {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

const STORAGE_KEY = 'av-install-banner-dismissed'

export function InstallBanner() {
    const [deferredPrompt, setDeferredPrompt] =
        useState<BeforeInstallPromptEvent | null>(null)
    const [isVisible, setIsVisible] = useState(false)
    const [mode, setMode] = useState<'prompt' | 'ios' | 'android' | null>(null)

    useEffect(() => {
        if (typeof window === 'undefined') return

        const wasDismissed = window.localStorage.getItem(STORAGE_KEY) === 'true'
        const isStandalone =
            window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as { standalone?: boolean }).standalone

        if (wasDismissed || isStandalone) {
            return
        }

        const ua = window.navigator.userAgent.toLowerCase()
        const isiOS = /iphone|ipad|ipod/.test(ua)
        const isAndroid = /android/.test(ua)
        let promptTimeout: NodeJS.Timeout
        let hasReceivedPrompt = false

        if (isiOS) {
            setMode('ios')
            setIsVisible(true)
        }

        const handleBeforeInstallPrompt = (event: Event) => {
            if (isiOS) return
            event.preventDefault()
            clearTimeout(promptTimeout)
            hasReceivedPrompt = true
            setDeferredPrompt(event as BeforeInstallPromptEvent)
            setMode('prompt')
            setIsVisible(true)
        }

        const handleAppInstalled = () => {
            setIsVisible(false)
            setDeferredPrompt(null)
            window.localStorage.setItem(STORAGE_KEY, 'true')
        }

        window.addEventListener(
            'beforeinstallprompt',
            handleBeforeInstallPrompt
        )
        window.addEventListener('appinstalled', handleAppInstalled)

        // Fallback for Android devices where beforeinstallprompt doesn't fire
        if (isAndroid && !isiOS) {
            promptTimeout = setTimeout(() => {
                if (!hasReceivedPrompt) {
                    setMode('android')
                    setIsVisible(true)
                }
            }, 2000)
        }

        return () => {
            clearTimeout(promptTimeout)
            window.removeEventListener(
                'beforeinstallprompt',
                handleBeforeInstallPrompt
            )
            window.removeEventListener('appinstalled', handleAppInstalled)
        }
    }, [])

    const handleInstallClick = async () => {
        if (!deferredPrompt) return

        deferredPrompt.prompt()

        try {
            const choice = await deferredPrompt.userChoice
            if (choice.outcome === 'accepted') {
                window.localStorage.setItem(STORAGE_KEY, 'true')
            }
        } catch (error) {
            console.error('Install prompt error', error)
        } finally {
            setIsVisible(false)
            setDeferredPrompt(null)
            setMode(null)
        }
    }

    const handleDismiss = () => {
        setIsVisible(false)
        window.localStorage.setItem(STORAGE_KEY, 'true')
        setDeferredPrompt(null)
        setMode(null)
    }

    if (!isVisible || !mode) {
        return null
    }

    const subtitle =
        mode === 'ios'
            ? 'No iOS, usa Partilhar > Adicionar ao Ecrã Principal para guardar esta aplicação.'
            : 'Guarda este site no ecrã inicial para acesso rápido.'

    return (
        <div
            className="fixed inset-x-4 bottom-6 z-50 sm:inset-x-auto sm:left-auto sm:right-6 sm:max-w-sm"
            role="dialog"
            aria-labelledby="install-banner-title"
            aria-describedby="install-banner-description"
        >
            <div className="flex flex-col gap-4 rounded-2xl border border-cyan-500/30 bg-slate-950/90 p-4 shadow-xl shadow-cyan-500/20 backdrop-blur-2xl sm:p-5">
                <div className="flex items-start gap-3">
                    <div
                        className="rounded-full bg-cyan-500/10 p-2 text-cyan-400"
                        aria-hidden="true"
                    >
                        <Icon name="download" className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                        <p
                            id="install-banner-title"
                            className="text-sm font-semibold text-white"
                        >
                            Instalar aplicação
                        </p>
                        <p
                            id="install-banner-description"
                            className="text-xs leading-relaxed text-slate-400"
                        >
                            {subtitle}
                        </p>
                    </div>
                </div>

                {mode === 'prompt' ? (
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                        <button
                            type="button"
                            onClick={handleInstallClick}
                            className={cn(
                                buttonVariants({ size: 'sm' }),
                                'bg-cyan-500 font-semibold text-slate-950 shadow-lg shadow-cyan-500/30 hover:bg-cyan-400'
                            )}
                            aria-label="Instalar aplicação agora"
                        >
                            Instalar agora
                        </button>
                        <button
                            type="button"
                            onClick={handleDismiss}
                            className={cn(
                                buttonVariants({
                                    variant: 'ghost',
                                    size: 'sm',
                                }),
                                'text-slate-400 hover:text-slate-200'
                            )}
                            aria-label="Dispensar instalação"
                        >
                            Agora não
                        </button>
                    </div>
                ) : (
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={handleDismiss}
                            className={cn(
                                buttonVariants({
                                    variant: 'ghost',
                                    size: 'sm',
                                }),
                                'text-slate-400 hover:text-slate-200'
                            )}
                            aria-label={
                                mode === 'android'
                                    ? 'Fechar aviso'
                                    : 'Fechar instruções'
                            }
                        >
                            {mode === 'android' ? 'Fechar' : 'Entendi'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
