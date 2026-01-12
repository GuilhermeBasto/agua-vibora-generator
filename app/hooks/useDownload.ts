import { useState, useCallback, useRef, useEffect } from 'react'
import { toast } from 'sonner'
import type { GeneratedSchedule } from '~/lib/types'

interface UseDownloadOptions {
    onError?: (error: Error) => void
    onSuccess?: () => void
    fileNamePrefix?: string
}

export function useDownload(
    generatedSchedule: GeneratedSchedule | null,
    options?: UseDownloadOptions,
    apiUrl = '/api/custom'
) {
    const [isDownloading, setIsDownloading] = useState(false)
    const [activeFormat, setActiveFormat] = useState<
        'pdf' | 'xlsx' | 'ics' | null
    >(null)

    const abortControllerRef = useRef<AbortController | null>(null)

    useEffect(() => {
        return () => abortControllerRef.current?.abort()
    }, [])

    const download = useCallback(
        async (format: 'pdf' | 'xlsx' | 'ics') => {
            if (!generatedSchedule) return

            abortControllerRef.current?.abort()
            abortControllerRef.current = new AbortController()

            setActiveFormat(format)
            setIsDownloading(true)

            try {
                const fd = new FormData()
                fd.append('data', JSON.stringify(generatedSchedule))

                const res = await fetch(`${apiUrl}/${format}`, {
                    method: 'POST',
                    body: fd,
                    signal: abortControllerRef.current.signal,
                })

                if (!res.ok) throw new Error(`Erro no servidor: ${res.status}`)

                const blob = await res.blob()

                const fileName = `${options?.fileNamePrefix || generatedSchedule.name || 'agenda'}-${generatedSchedule.year}.${format}`

                // Android-compatible download approach
                // Use proper MIME type for ICS files on Android
                const mimeType =
                    format === 'ics'
                        ? 'text/calendar'
                        : format === 'pdf'
                          ? 'application/pdf'
                          : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

                const properBlob = new Blob([blob], { type: mimeType })
                const url = window.URL.createObjectURL(properBlob)
                const link = document.createElement('a')

                link.href = url
                link.setAttribute('download', fileName)
                link.style.display = 'none'
                document.body.appendChild(link)
                link.click()

                // Cleanup with slight delay for Android compatibility
                setTimeout(() => {
                    link.parentNode?.removeChild(link)
                    window.URL.revokeObjectURL(url)
                }, 100)

                toast.success('Download concluído com sucesso!')

                options?.onSuccess?.()
            } catch (error: unknown) {
                if (error instanceof Error && error.name === 'AbortError')
                    return

                const err =
                    error instanceof Error
                        ? error
                        : new Error('Erro desconhecido')
                options?.onError?.(err)
                toast.error(`Erro ao efetuar o download: ${err.message}`)
            } finally {
                setIsDownloading(false)
                setActiveFormat(null)
            }
        },
        [generatedSchedule, apiUrl, options]
    )

    return {
        download,
        isDownloading,
        activeFormat,
    }
}
