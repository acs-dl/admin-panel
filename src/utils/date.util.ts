import dayjs, { ConfigType, ManipulateType } from 'dayjs'

export type DataConfigType = ConfigType

export class DateUtil {
  static get ISOFormat() {
    return 'YYYY-MM-DDT00:00:00+00:00'
  }

  static toISO(date?: DataConfigType, format?: dayjs.OptionType) {
    return this._instance(date, format).format(this.ISOFormat)
  }

  static toTimestamp(date?: DataConfigType, format?: dayjs.OptionType) {
    return this._instance(date, format).unix()
  }

  static fromTimestampSec(timestamp: number) {
    return dayjs.unix(timestamp)
  }

  static _instance(date?: DataConfigType, format?: dayjs.OptionType) {
    return format ? dayjs(date, format) : dayjs(date)
  }

  static timeLeft(date: DataConfigType) {
    if (!date) return 0
    const currentDate = this._instance()
    const targetDate = this._instance(date)

    return targetDate.diff(currentDate, 'ms')
  }

  static isSameOrAfter(
    checkingDate: DataConfigType,
    targetDate?: DataConfigType,
  ) {
    return (
      this.isAfter(checkingDate, targetDate) ||
      this.isSame(checkingDate, targetDate)
    )
  }

  static isAfter(checkingDate: DataConfigType, targetDate?: DataConfigType) {
    const checking = this._instance(checkingDate)
    const target = this._instance(targetDate)
    return target.isAfter(checking)
  }

  static isSame(checkingDate: DataConfigType, targetDate?: DataConfigType) {
    const checking = this._instance(checkingDate)
    const target = this._instance(targetDate)
    return checking.isSame(target)
  }

  static substract(
    cuttingAmount: number,
    cuttingValue: ManipulateType,
    date?: DataConfigType,
  ) {
    return this._instance(date).subtract(cuttingAmount, cuttingValue)
  }

  static diffs(
    checkingDate: DataConfigType,
    targetDate: DataConfigType,
  ): number {
    return this._instance(checkingDate).diff(this._instance(targetDate))
  }

  static format(date: DataConfigType, format: string) {
    return this._instance(date).format(format)
  }
}
