interface LoadingOverlayProps {
    isLoading: boolean
    message?: string
}

export function LoadingOverlay({
    isLoading,
    message = 'A carregar...',
}: LoadingOverlayProps) {
    if (!isLoading) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
                <div className="relative h-16 w-16">
                    <div className="absolute inset-0 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-500"></div>
                    <div className="absolute inset-2 animate-spin rounded-full border-4 border-slate-800 border-t-cyan-400 [animation-delay:150ms] [animation-duration:1.5s]"></div>
                </div>
                <p className="text-sm font-semibold uppercase tracking-wider text-cyan-400">
                    {message}
                </p>
            </div>
        </div>
    )
}
