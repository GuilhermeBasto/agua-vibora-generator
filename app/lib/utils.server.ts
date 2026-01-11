import { addDays, set } from 'date-fns'
import ExcelJS from 'exceljs'
import PDFDocument from 'pdfkit'
import type { ScheduleEntry } from './types'

const pageWidth = 595 // A4 width in points
const margin = 40
const pageHeight = 842 // A4 height in points
const titleColor = '#1e293b' // Dark slate text
const headerBgColor = '#f0f9ff' // Light cyan background
const headerTextColor = '#0369a1' // Darker cyan text

const addPDFPageNumber = (doc: PDFKit.PDFDocument, pageNumber: number) => {
    doc.font('Helvetica-Bold')
        .fontSize(8)
        .fillColor(titleColor)
        .text(
            String(pageNumber),
            pageWidth - margin - 50,
            pageHeight - margin - 10,
            {
                width: 40,
                align: 'right',
            }
        )
}

export const generatePDF = (
    title: string,
    data: ScheduleEntry[],
    headers = ['Data', 'Casal', 'Regantes']
) => {
    // PDF configuration with modern styling
    const doc = new PDFDocument({ margin: 40, size: 'A4' })

    // Professional header with title
    doc.fontSize(18).font('Helvetica-Bold').fillColor(titleColor).text(title, {
        align: 'center',
    })
    doc.moveDown(0.5)

    const startX = margin
    const totalWidth = pageWidth - 2 * margin
    const colWidths = {
        date: 100,
        location: 140,
        schedule: totalWidth - 100 - 140,
    }
    const rowHeight = 24
    const headerHeight = 28

    let currentY = doc.y
    let pageNumber = 1

    // Draw header row with professional styling
    const headerY = currentY

    // Header background
    doc.rect(startX, headerY, totalWidth, headerHeight)
        .fillAndStroke(headerBgColor, headerTextColor)
        .lineWidth(1)

    // Header text
    doc.font('Helvetica-Bold').fontSize(10).fillColor(headerTextColor)

    let xPos = startX
    headers.forEach((header, idx) => {
        const colWidth =
            idx === 0
                ? colWidths.date
                : idx === 1
                  ? colWidths.location
                  : colWidths.schedule
        doc.text(header, xPos + 8, headerY + 8, {
            width: colWidth - 16,
            align: 'left',
        })
        xPos += colWidth
    })

    currentY += headerHeight

    // Draw data rows with alternating background
    data.forEach((item, rowIndex) => {
        // Check if we need a new page
        if (currentY > 750) {
            addPDFPageNumber(doc, pageNumber)
            doc.addPage()
            pageNumber++
            currentY = margin + 20
        }

        // Alternating row background color
        const bgColor = rowIndex % 2 === 0 ? '#ffffff' : '#f8fafc'
        const isBoldRow = item.isBold
        const effectiveBgColor = isBoldRow ? '#e0f2fe' : bgColor // Light cyan for bold rows

        // Row background
        doc.rect(startX, currentY, totalWidth, rowHeight).fill(effectiveBgColor)
        doc.strokeColor(headerTextColor).lineWidth(1)

        // Set text color and font based on bold flag
        const textColor = isBoldRow ? '#0c4a6e' : '#334155' // Darker for bold rows
        doc.font(isBoldRow ? 'Helvetica-Bold' : 'Helvetica')
            .fontSize(9)
            .fillColor(textColor)

        // Date column
        doc.text(item.dateFormatted, startX + 8, currentY + 7, {
            width: colWidths.date - 16,
            align: 'left',
        })

        // Location column
        doc.text(item.location, startX + colWidths.date + 8, currentY + 7, {
            width: colWidths.location - 16,
            align: 'left',
        })

        // Schedule column with monospace-like appearance
        doc.text(
            item.schedule || '',
            startX + colWidths.date + colWidths.location + 8,
            currentY + 7,
            {
                width: colWidths.schedule - 16,
                align: 'left',
            }
        )

        // Draw cell borders
        doc.strokeColor(headerTextColor).lineWidth(1)
        doc.rect(startX, currentY, colWidths.date, rowHeight).stroke()
        doc.rect(
            startX + colWidths.date,
            currentY,
            colWidths.location,
            rowHeight
        ).stroke()
        doc.rect(
            startX + colWidths.date + colWidths.location,
            currentY,
            colWidths.schedule,
            rowHeight
        ).stroke()

        currentY += rowHeight
    })

    addPDFPageNumber(doc, pageNumber)
    return doc
}

/**
 * RFC 5987 compliant Content-Disposition filename encoding.
 * Ensures filenames download correctly across Android/iOS/desktop.
 */
export const getContentDispositionHeader = (fileName: string) => {
    const encoded = encodeURIComponent(fileName).replace(
        /[!'()*]/g,
        (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`
    )

    // Create ASCII-safe fallback by removing non-ASCII characters (code points > 127)
    // This ensures the header itself is valid (headers must be ASCII-only)
    const asciiFallback = fileName
        .split('')
        .filter((char) => char.charCodeAt(0) <= 127)
        .join('')

    return `attachment; filename="${asciiFallback}"; filename*=UTF-8''${encoded}`
}

/**
 * Adds black borders to an Excel cell
 * @param cell - ExcelJS cell object
 */
export const addBordersToCell = (cell: ExcelJS.Cell): void => {
    cell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } },
    }
}

/**
 * Adds a centered, bold title row to an Excel worksheet.
 * @param worksheet ExcelJS worksheet object.
 * @param year Year to display in the title.
 * @param title Title text to display.
 */
export const addTitleToWorksheet = (
    worksheet: ExcelJS.Worksheet,
    year: number,
    title: string
): void => {
    worksheet.insertRow(1, [title + ' - Ano ' + year])
    worksheet.mergeCells('A1:C1')
    const titleCell = worksheet.getCell('A1')
    titleCell.font = { name: 'Arial', size: 14, bold: true }
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' }
    worksheet.addRow([]) // Empty separator row
}

/**
 * Generates an ExcelJS Workbook from an array of schedule entries.
 * Shared utility to avoid duplication across API routes.
 */
export const generateWorkbookFromData = (
    title: string,
    year: number,
    data: ScheduleEntry[]
): ExcelJS.Workbook => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet(title)

    worksheet.columns = [
        { key: 'date', width: 15 },
        { key: 'location', width: 20 },
        { key: 'schedule', width: 40 },
    ]

    addTitleToWorksheet(worksheet, year, title)

    data.forEach((item) => {
        const row = worksheet.addRow({
            date: item.dateFormatted,
            location: item.location,
            schedule: item.schedule,
        })
        row.eachCell((cell: ExcelJS.Cell) => addBordersToCell(cell))
        if (item.isBold) {
            row.getCell('date').font = { bold: true }
            row.getCell('location').font = { bold: true }
            row.getCell('schedule').font = { bold: true }
        }
    })

    return workbook
}

export const generateSchedulePointers = (
    config: Record<string, string[]>
): Record<string, number> => {
    return Object.keys(config).reduce(
        (acc, location) => {
            acc[location] = 0
            return acc
        },
        {} as Record<string, number>
    )
}

/**
 * Rotates a list based on the year offset from a reference year.
 */
export const getOrder = <T>(
    list: T[],
    year: number,
    referenceYear: number
): T[] => {
    const offset = (year - referenceYear) % list.length
    return [...list.slice(offset), ...list.slice(0, offset)]
}

/**
 * Retrieves the per-village schedule labels for the given year parity.
 */
export const getYearScheduleDurations = (
    year: number,
    schedule: { odd: Record<string, string[]>; even: Record<string, string[]> }
): Record<string, string[]> => {
    return year % 2 === 0 ? schedule.even : schedule.odd
}

/**
 * Builds the start and end `Date` objects for the schedule window.
 */
export const getDateRange = (
    year: number,
    startCfg: { month: number; date: number },
    endCfg: { month: number; date: number }
): { startDate: Date; endDate: Date } => {
    const startDate = set(new Date(), {
        year,
        month: startCfg.month,
        date: startCfg.date,
        hours: 0,
        minutes: 0,
        seconds: 0,
    })

    const endDate = set(new Date(), {
        year,
        month: endCfg.month,
        date: endCfg.date,
        hours: 0,
        minutes: 0,
        seconds: 0,
    })

    return { startDate, endDate }
}

/**
 * Builds schedule entries from a rotating sequence and per-location label arrays.
 * @param yearSequence Ordered list of locations for the year.
 * @param schedulesByLocation Map of location -> label list.
 * @param schedulePointers Map of location -> current pointer index.
 * @param startDate Inclusive start date.
 * @param endDate Inclusive end date.
 * @param formatDate Function to format a given date.
 * @returns Array of entries: { date, dateFormatted, location, schedule }.
 */
export const buildScheduleData = (
    yearSequence: string[],
    schedulesByLocation: Record<string, string[]>,
    schedulePointers: Record<string, number>,
    startDate: Date,
    endDate: Date,
    formatDate: (d: Date) => string
) => {
    const scheduleData: {
        date: Date
        dateFormatted: string
        location: string
        schedule: string
    }[] = []

    let currentDate = startDate
    let dayIndex = 0

    while (currentDate <= endDate) {
        const locationName = yearSequence[dayIndex % yearSequence.length]
        let scheduleStr = ''

        if (schedulesByLocation[locationName]) {
            const list = schedulesByLocation[locationName]
            scheduleStr = list[schedulePointers[locationName] % list.length]
            schedulePointers[locationName]++
        }

        scheduleData.push({
            date: currentDate,
            dateFormatted: formatDate(currentDate),
            location: locationName,
            schedule: scheduleStr,
        })

        currentDate = addDays(currentDate, 1)
        dayIndex++
    }

    return scheduleData
}

const getContentType = (type: 'pdf' | 'xlsx' | 'ics'): string => {
    switch (type) {
        case 'pdf':
            return 'application/pdf'
        case 'xlsx':
            return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        case 'ics':
            return 'text/calendar; charset=utf-8'
        default:
            return 'application/octet-stream'
    }
}

export const getResponseHeaders = (
    fileName: string,
    type: 'pdf' | 'xlsx' | 'ics',
    length: number
): HeadersInit => {
    const headers: HeadersInit = {
        'Content-Type': getContentType(type),
        'Content-Disposition': getContentDispositionHeader(fileName),
        'Content-Length': length.toString(),
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'no-cache',
    }

    // Add extra headers for ICS files to improve Android compatibility
    if (type === 'ics') {
        headers['Content-Transfer-Encoding'] = 'binary'
        headers['Accept-Ranges'] = 'bytes'
    }

    return headers
}
