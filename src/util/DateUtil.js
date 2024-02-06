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
      minute ? (':' + minute) : '',
      Math.floor(hour / 12) % 2 === 0 ? 'am' : 'pm',
    ].join('')
  },
}

export default DateUtil
