/**
 * @fileoverview Server-only utilities for generating Água de Víbora irrigation schedules.
 *
 * Generates the daily rotation data for all villages between a configured start
 * and end date, and exposes helpers to export this data as Excel and PDF.
 *
 * Note: this is a `.server.ts` file to ensure it is never bundled to the client.
 * The PDF export delegates layout and rendering to `generatePDF` in `utils.server`.
 */
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import ExcelJS from 'exceljs'
import type { ScheduleEntry } from './types'
import {
    addBordersToCell,
    addTitleToWorksheet,
    generatePDF,
    generateSchedulePointers,
    buildScheduleData,
    getOrder,
    getYearScheduleDurations,
    getDateRange,
} from './utils.server'

/** Reference year used to compute rotation offsets for village order */
const REFERENCE_YEAR = 2019

/** Start date (inclusive) for the irrigation schedule window (June 25) */
const SCHEDULE_START = { month: 5, date: 25 }

/** End date (inclusive) for the irrigation schedule window (September 2) */
const SCHEDULE_END = { month: 8, date: 2 }

/** Date format used for `dateFormatted` (Portuguese locale) */
const DATE_FORMAT = "dd 'de' MMMM"

/**
 * Villages participating in the rotation.
 * The effective order for a given year is computed via `getYearSchedule`.
 */
const VILLAGES = [
    'Torre',
    'Crasto',
    'Passo',
    'Ramada',
    'Figueiredo',
    'Redondinho',
]

/**
 * Time schedule labels for each village by parity of year.
 * Values are free-form strings denoting the responsible parties or periods.
 */
type YearScheduleConfig = Record<string, string[]>

const YEAR_SCHEDULE: {
    odd: YearScheduleConfig
    even: YearScheduleConfig
} = {
    odd: {
        Passo: [
            'Torre/Souto',
            'Figueiredo/Torre',
            'Souto/Torre',
            'Torre/Figueiredo',
        ],
        Ramada: ['Simão', 'Simão', 'Simão', 'Simão'],
        Figueiredo: ['Simão', 'Simão', 'Simão', 'Simão'],
        Redondinho: ['Souto', 'Simão', 'Souto', 'Simão'],
        Torre: ['Souto', 'Souto', 'Souto', 'Souto'],
        Crasto: ['Souto/Simão', 'Souto', 'Simão/Souto', 'Souto'],
    },
    even: {
        Crasto: ['Ramada/Dourado', 'Simão', 'Ramada', 'Simão'],
        Passo: ['Simão', 'Souto', 'Simão', 'Souto'],
        Ramada: ['Souto', 'Souto', 'Souto', 'Souto'],
        Figueiredo: ['Souto', 'Souto/Simão', 'Souto', 'Simão/Souto'],
        Redondinho: [
            'Torre/Souto',
            'Figueiredo/Torre',
            'Souto/Torre',
            'Torre/Figueiredo',
        ],
        Torre: ['Simão', 'Ze Manel', 'Simão', 'Ze Manel'],
    },
}

/**
 * Rotates a list based on the year offset from a reference year.
 * @param list The list to rotate.
 * @param year The target year.
 * @param referenceYear The reference year for calculating offset.
 * @returns A new list rotated by the computed offset.
 */
// getOrder moved to utils.server

/**
 * Retrieves the per-village schedule labels for the given year parity.
 * @param year Target year.
 * @returns Schedule configuration for odd or even year.
 */
// getYearScheduleDurations moved to utils.server

/**
 * Computes the ordered list of villages for the given year.
 * @param year Target year.
 * @returns Ordered list of village names for the year.
 */
const getYearSchedule = (year: number): string[] => {
    return getOrder(VILLAGES, year, REFERENCE_YEAR)
}

/**
 * Builds the start and end `Date` objects for the schedule window.
 * @param year Target year.
 * @returns `{ startDate, endDate }` for the configured window.
 */
// getDateRange moved to utils.server

/**
 * Generates the daily schedule entries between the configured start and end dates.
 * Each entry includes the formatted date, village location, and a schedule label
 * resolved by cycling the per-location label arrays.
 * @param year Target year.
 * @returns Array of schedule entries for the full window.
 */
const generatePoolScheduleData = (year: number): ScheduleEntry[] => {
    const yearSequence = getYearSchedule(year)
    const schedulesByLocation = getYearScheduleDurations(year, YEAR_SCHEDULE)
    const schedulePointers: Record<string, number> =
        generateSchedulePointers(schedulesByLocation)
    const { startDate, endDate } = getDateRange(
        year,
        SCHEDULE_START,
        SCHEDULE_END
    )
    const scheduleData = buildScheduleData(
        yearSequence,
        schedulesByLocation,
        schedulePointers,
        startDate,
        endDate,
        (d) => format(d, DATE_FORMAT, { locale: pt })
    )

    return scheduleData as ScheduleEntry[]
}

/**
 * Generates an Excel workbook named "Agua do Coblinho" with the schedule data.
 * Applies borders to all cells and bold styling where applicable.
 * @param year Target year.
 * @returns ExcelJS `Workbook` instance containing the schedule.
 */
const generatePoolScheduleWorkbook = (year: number): ExcelJS.Workbook => {
    const scheduleData = generatePoolScheduleData(year)

    // Excel configuration
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Agua do Coblinho')

    worksheet.columns = [
        { key: 'date', width: 15 },
        { key: 'location', width: 20 },
        { key: 'schedule', width: 40 },
    ]

    // Add title
    addTitleToWorksheet(worksheet, year, 'Agua do Coblinho')

    // Add data rows
    scheduleData.forEach((item) => {
        const row = worksheet.addRow({
            date: item.dateFormatted,
            location: item.location,
            schedule: item.schedule,
        })

        // Add black borders to all cells
        row.eachCell((cell: ExcelJS.Cell) => addBordersToCell(cell))

        // Make bold if needed
        if (item.isBold) {
            row.getCell('date').font = { bold: true }
            row.getCell('location').font = { bold: true }
            row.getCell('schedule').font = { bold: true }
        }
    })

    return workbook
}

/**
 * Generates a PDF with the irrigation schedule for the given year.
 * Delegates layout/rendering to `generatePDF` defined in `utils.server`.
 * @param year Target year.
 * @returns The result of `generatePDF` (PDF document/buffer depending on implementation).
 */
const generatePoolSchedulePDF = (year: number) => {
    const scheduleData = generatePoolScheduleData(year)

    return generatePDF(
        `Aviança da Água do Coblinho - Ano ${year}`,
        scheduleData
    )
}

export {
    getYearSchedule,
    generatePoolScheduleData,
    generatePoolScheduleWorkbook,
    generatePoolSchedulePDF,
}
