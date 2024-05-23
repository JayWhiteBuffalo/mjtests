import DateUtil from '@util/DateUtil'
import ObjectUtil from '@util/ObjectUtil'

const daysOfWeek = ([
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]).map((name, index) => {
  const abbr = name.toLowerCase().substring(0, 3)
  return {
    abbr,
    index,
    key: abbr,
    name,
  }
})

const namedDays = [
  {key: 'newYears', name: 'New Year\'s', holiday: true},
  {key: 'mlk', name: 'MLK Day', holiday: true},
  {key: 'presidents', name: 'Presidents\' Day', holiday: true},
  {key: 'memorial', name: 'Memorial Day', holiday: true},
  {key: 'juneteenth', name: 'Juneteenth', holiday: true},
  {key: 'july4th', name: 'July 4th', holiday: true},
  {key: 'labor', name: 'Labor Day', holiday: true},
  {key: 'columbus', name: 'Columbus Day', holiday: true},
  {key: 'veterans', name: 'Veterans Day', holiday: true},
  {key: 'thanksgiving', name: 'Thanksgiving', holiday: true},
  {key: 'thanksgiving+1', name: 'Black Friday'},
  {key: 'thanksgiving+2'},
  {key: 'thanksgiving+3'},
  {key: 'thanksgiving+4', name: 'Cyber Monday'},
  {key: 'christmas-1', name: 'Christmas Eve'},
  {key: 'christmas', name: 'Christmas', holiday: true},
  {key: 'newYears-1', name: 'New Year\'s Eve'},
]

const enDash = '–'
export const VendorSchedule = {
  namedDays,
  namedDaysByKey: ObjectUtil.fromIterable(namedDays, x => x.key),
  daysOfWeek,
  daysOfWeekByAbbr: ObjectUtil.fromIterable(daysOfWeek, x => x.abbr),

  getCurrentWeek(schedule) {
    const now = new Date()
    const dayOfWeek = now.getDay()

    const days = []
    for (let i = 0; i < 7; i += 1) {
      const day = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek + i))
      days.push(DateUtil.formatYmd(day.getUTCFullYear(), day.getUTCMonth() + 1, day.getUTCDate()))
    }
    return days.map(day => ({
      day,
      daySchedule: VendorSchedule.getDay(day, schedule),
    }))
  },

  getDay(day, schedule) {
    return schedule.special[day]
      ?? schedule.special[VendorSchedule.getNamedDay(day) ?? '']
      ?? schedule.week[new Date(day).getUTCDay()]
  },

  readDaySchedule(dayScheduleSpec) {
    if (dayScheduleSpec === 'closed') {
      return 'closed'
    }
    const daySchedule = dayScheduleSpec.split('-').map(DateUtil.parseAmPm)
    if (daySchedule.length !== 2 || daySchedule.some(time => time == null)) {
      return 'unknown'
    }
    if (daySchedule[1] <= daySchedule[0]) {
      daySchedule[1] += 24 * 3600
    }
    return daySchedule
  },

  readSchedule(spec) {
    const week = VendorSchedule.daysOfWeek.map(({abbr}) =>
      (spec[abbr] && VendorSchedule.readDaySchedule(spec[abbr]))
        ?? (spec.all && VendorSchedule.readDaySchedule(spec.all))
        ?? 'unknown'
    )

    const special = {}
    for (const key in spec) {
      if (key !== 'all' && !VendorSchedule.daysOfWeekByAbbr[key]) {
        special[key] = VendorSchedule.readDaySchedule(spec[key])
      }
    }

    return {week, special}
  },

  // https://en.wikipedia.org/wiki/Federal_holidays_in_the_United_States
  getNamedDay(day) {
    const date = new Date(day)
    const dayOfWeek = date.getUTCDay()
    const dayOfMonth = date.getUTCDate()
    const nthDayOfMonth = Math.floor((dayOfMonth - 1) / 7)
    const month = date.getUTCMonth() + 1

    if (day.endsWith('-01-01')) return 'newYears'
    if (month === 1 && dayOfWeek === 1 && nthDayOfMonth === 2) return 'mlk'
    if (month === 2 && dayOfWeek === 1 && nthDayOfMonth === 2) return 'presidents'
    if (month === 5 && dayOfWeek === 1 && (31 - 7) <= dayOfMonth) return 'memorial'
    if (day.endsWith('-06-19')) return 'juneteenth'
    if (day.endsWith('-07-04')) return 'july4th'
    if (month === 9 && dayOfWeek === 1 && nthDayOfMonth === 0) return 'labor'
    if (month === 10 && dayOfWeek === 1 && nthDayOfMonth === 1) return 'columbus'
    if (day.endsWith('-11-11')) return 'veterans'
    if (month === 11 && dayOfWeek === 4 && nthDayOfMonth === 3) return 'thanksgiving'
    if (day.endsWith('-12-24')) return 'christmas-1'
    if (day.endsWith('-12-25')) return 'christmas'
    if (day.endsWith('-12-31')) return 'newYears-1'

    return undefined
  },

  getNamedDaysForYear(startDay) {
    startDay ??= DateUtil.todayYmd()

    const items = []
    for (let i = 0; i < 366; i += 1) {
      const day = DateUtil.addYmd(startDay, i)
      const key = VendorSchedule.getNamedDay(day)
      if (key) {
        items.push({key, day})
      }
    }
    return items
  },

  formatDaySchedule(daySchedule) {
    if (daySchedule === 'closed') {
      return 'Closed'
    } else if (daySchedule === 'unknown') {
      return 'Contact store for hours'
    } else if (daySchedule instanceof Array) {
      return daySchedule.map(DateUtil.formatShortAmPm).join(` ${enDash} `)
    } else {
      return daySchedule
    }
  },

  getStatus(schedule) {
    const today = DateUtil.todayYmd()
    const yesterdaySchedule = VendorSchedule.getDay(DateUtil.addYmd(today, -1), schedule)
    const todaySchedule = VendorSchedule.getDay(today, schedule)
    const tomorrowSchedule = VendorSchedule.getDay(DateUtil.addYmd(today, 1), schedule)
    const timeOfDay = DateUtil.nowTimeOfDay()

    if (yesterdaySchedule instanceof Array) {
      if (yesterdaySchedule[0] <= timeOfDay + 24 * 3600 && timeOfDay + 24 * 3600 < yesterdaySchedule[1]) {
        return {
          isOpen: true,
          closingSoon: yesterdaySchedule[1] <= timeOfDay + 24 * 3600 + 3600,
          closes: yesterdaySchedule[1],
        }
      }
    }

    if (todaySchedule instanceof Array) {
      if (todaySchedule[0] <= timeOfDay && timeOfDay < todaySchedule[1]) {
        const abuts = todaySchedule[1] === 24 * 3600
          && tomorrowSchedule instanceof Array && tomorrowSchedule[0] === 0
        return {
          isOpen: true,
          closingSoon: !abuts && todaySchedule[1] <= timeOfDay + 3600,
          closes: todaySchedule[1],
          alwaysOpen: todaySchedule[0] === 0 && abuts,
        }
      }

    }

    if (todaySchedule === 'unknown') {
      return {unknown: true}
    }

    if (timeOfDay < todaySchedule[0]) {
      return {isOpen: false, opensNext: todaySchedule[0]}
    } else if (tomorrowSchedule instanceof Array) {
      return {isOpen: false, opensNext: tomorrowSchedule[0]}
    } else if (tomorrowSchedule === 'closed') {
      return {isOpen: false}
    } else {
      return {}
    }
  },

  hasSchedule(schedule) {
    return schedule.week.some(daySchedule => daySchedule !== 'unknown')
  },
}
