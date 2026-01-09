export interface CustomSchedule {
    year: string
    name: string
    schedules: Record<string, string[]>
}

/**
 * Schedule entry data structure
 */
export interface ScheduleEntry {
    date: Date
    dateFormatted: string
    location: string
    schedule: string
    isBold?: boolean
}

export interface GeneratedSchedule {
    data: ScheduleEntry[]
    name: string
    year: string
}
