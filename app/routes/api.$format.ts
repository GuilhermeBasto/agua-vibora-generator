import {
    generatePoolSchedulePDF,
    generatePoolScheduleWorkbook,
} from '~/lib/poolSchedule.server'
import {
    generateSchedulePDF,
    generateScheduleWorkbook,
    generateScheduleCalendar,
} from '~/lib/schedule.server'
import { getResponseHeaders } from '~/lib/utils.server'
import type { Route } from './+types/api.$format'

type Format = 'pdf' | 'xlsx' | 'ics'
type ScheduleType = 'irrigation' | 'irrigation-pool'

const getFileName = (
    year: number,
    isTemplate: boolean,
    format: Format,
    type: ScheduleType = 'irrigation'
) => {
    const prefix = type === 'irrigation-pool' ? 'coblinho' : 'vibora'
    return isTemplate
        ? `agua-${prefix}-${year}-template.${format}`
        : `agua-${prefix}-${year}.${format}`
}

// Using shared header helper from utils.server

export async function loader({ params, request }: Route.LoaderArgs) {
    const url = new URL(request.url)
    const year = parseInt(
        url.searchParams.get('year') || String(new Date().getFullYear()),
        10
    )
    const type: ScheduleType =
        (url.searchParams.get('type') as ScheduleType) || 'irrigation'
    const isTemplate = url.searchParams.get('template') === 'true'
    const format = params.format?.toLowerCase()

    if (isNaN(year)) {
        return new Response('Ano inválido', { status: 400 })
    }

    try {
        switch (format) {
            case 'pdf': {
                const pdfDoc =
                    type === 'irrigation-pool'
                        ? generatePoolSchedulePDF(year)
                        : generateSchedulePDF(year, isTemplate)
                const chunks: Buffer[] = []

                const pdfBuffer = await new Promise<Buffer>(
                    (resolve, reject) => {
                        pdfDoc.on('data', (chunk) => chunks.push(chunk))
                        pdfDoc.on('error', (err) => reject(err))
                        pdfDoc.on('end', () => resolve(Buffer.concat(chunks)))
                        pdfDoc.end()
                    }
                )

                const fileName = getFileName(year, isTemplate, format, type)
                const uint8Array = new Uint8Array(pdfBuffer)

                return new Response(uint8Array, {
                    headers: getResponseHeaders(
                        fileName,
                        'pdf',
                        uint8Array.length
                    ),
                })
            }

            case 'xlsx': {
                const workbook =
                    type === 'irrigation-pool'
                        ? generatePoolScheduleWorkbook(year)
                        : generateScheduleWorkbook(year, isTemplate)
                const buffer = await workbook.xlsx.writeBuffer()
                const fileName = getFileName(year, isTemplate, format, type)

                const uint8Array = new Uint8Array(buffer)

                return new Response(uint8Array, {
                    headers: getResponseHeaders(
                        fileName,
                        'xlsx',
                        uint8Array.length
                    ),
                })
            }

            case 'ics': {
                if (type === 'irrigation-pool') {
                    return new Response(
                        'Formato ICS não suportado para Poça do Coblinho',
                        {
                            status: 400,
                        }
                    )
                } else {
                    const result = generateScheduleCalendar(year)
                    if ('error' in result) throw result.error
                    const fileName = getFileName(year, false, 'ics', type)

                    // Convert string to UTF-8 encoded buffer for Android compatibility
                    const icsBuffer = new TextEncoder().encode(result.value)

                    return new Response(icsBuffer, {
                        headers: getResponseHeaders(
                            fileName,
                            'ics',
                            icsBuffer.length
                        ),
                    })
                }
            }

            default:
                return new Response('Formato não suportado', { status: 400 })
        }
    } catch (error) {
        console.error(`Erro ao gerar ${format}:`, error)
        return new Response('Erro interno ao gerar ficheiro', { status: 500 })
    }
}
