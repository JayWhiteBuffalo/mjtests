import MathUtil from '@util/MathUtil'

const DateUtil = {
  formatYmd(year, month, day) {
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
  },

  todayYmd() {
    const now = new Date()
    return DateUtil.formatYmd(now.getFullYear(), now.getMonth() + 1, now.getDate())
  },

  nowTimeOfDay() {
    const now = new Date()
    return 3600 * now.getHours() + 60 * now.getMinutes() + now.getSeconds()
  },

  parseYmd(date) {
    return date.split('-').map(x => +x)
  },

  addYmd(date, d) {
    const [year, month, day] = DateUtil.parseYmd(date)
    const dateUtc = new Date(Date.UTC(year, month - 1, day + d))
    return DateUtil.formatYmd(dateUtc.getUTCFullYear(), dateUtc.getUTCMonth() + 1, dateUtc.getUTCDate())
  },

  formatAmPm(time) {
    const [time_, _second] = MathUtil.divide(time, 60)
    const [hour, minute] = MathUtil.divide(time_, 60)
    return [
      (hour - 1 + 12) % 12 + 1,
      ':',
      minute.toString().padStart(2, '0'),
      ' ',
      Math.floor(hour / 12) % 2 === 0 ? 'am' : 'pm',
    ].join('')
  },

  formatShortAmPm(time) {
    const [time_, _second] = MathUtil.divide(time, 60)
    const [hour, minute] = MathUtil.divide(time_, 60)
    return [
      (hour - 1 + 12) % 12 + 1,
      minute ? (':' + minute.toString().padStart(2, '0')) : '',
      Math.floor(hour / 12) % 2 === 0 ? 'am' : 'pm',
    ].join('')
  },

  parseAmPm(x) {
    const match = x.toLowerCase().match(/^(\d+):?(\d+)?\s*((a|p)m?)?/)
    if (match) {
      const hour = +match[1]
      const minute = +(match[2] ?? 0)
      const isPm = match[3]?.startsWith('p') ?? false
      if (
        0 <= hour && hour < 24
          && 0 <= minute && minute < 60
      ) {
        return 3600 * hour + 60 * minute + (hour < 12 && isPm ? 12 * 3600 : 0)
      }
    }
    return undefined
  },
}

export default DateUtil
