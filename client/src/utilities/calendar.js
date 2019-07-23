import dayjs from 'dayjs'

export const now = dayjs().toJSON()
export const yesterday = dayjs()
  .subtract('1', 'day')
  .toJSON()
export const lastWeek = dayjs()
  .subtract('1', 'week')
  .toJSON()
export const lastMonth = dayjs()
  .subtract('1', 'month')
  .toJSON()

console.log(now, yesterday, lastWeek, lastMonth)

export const weekDays = {
  sunday: 'Sun',
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
  saturday: 'Sat'
}

export const months = {
  january: 'Jan',
  february: 'Feb',
  march: 'Mar',
  april: 'Apr',
  may: 'May',
  june: 'Jun',
  july: 'Jul',
  august: 'Aug',
  september: 'Sep',
  october: 'Oct',
  november: 'Nov',
  december: 'Dec'
}
