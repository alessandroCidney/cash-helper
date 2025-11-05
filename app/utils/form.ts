function removeIsoStringMs(isoStr: string) {
  const splitArr = isoStr.split(':')

  splitArr.pop()

  return splitArr.join(':')
}

export function getInputDatetimeFromDate(date: Date) {
  const offset = date.getTimezoneOffset()

  date = new Date(date.getTime() - (offset * 60 * 1000))

  // The Date object contains an incorrect time (.getTime()), but the ISO string perfectly matches the user's time zone.
  const isoStringWithLocalDate = date.toISOString() // 'XXXX-XX-XXTXX:XX:XX.XXXZ'

  return removeIsoStringMs(isoStringWithLocalDate)
}

// Datetime Str -> XXXX-XX-XXTXX:XX
export function inputDatetimeToDate(dateTimeStr: string) {
  console.log('date', dateTimeStr)
  return new Date(dateTimeStr)
}

export function getMaxInputDatetime() {
  return getInputDatetimeFromDate(new Date())
}

export function getMinInputDatetime() {
  const dateObj = new Date()

  dateObj.setFullYear(dateObj.getFullYear() - 200)

  return removeIsoStringMs(dateObj.toISOString())
}

export function getMaxInputDate() {
  return getMaxInputDatetime().split('T')[0]
}

export function getMinInputDate() {
  return getMinInputDatetime().split('T')[0]
}
