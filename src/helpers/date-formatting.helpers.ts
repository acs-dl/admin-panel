import { DateUtil, DataConfigType } from '@/utils'
import { ManipulateType } from 'dayjs'

export function toISO(date: DataConfigType) {
  return DateUtil.toISO(date)
}

export function substractDate(
  cuttingAmount: number,
  cuttingValue: ManipulateType,
  date?: DataConfigType,
) {
  return date
    ? DateUtil.substract(cuttingAmount, cuttingValue, date)
    : DateUtil.substract(cuttingAmount, cuttingValue)
}

export function formatDMYHM(date: DataConfigType) {
  return DateUtil.format(
    typeof date === 'number' ? DateUtil.fromTimestampSec(date) : date,
    'MMMM D, YYYY h:mm',
  )
}

export function formatMDY(date: DataConfigType) {
  return DateUtil.format(
    typeof date === 'number' ? DateUtil.fromTimestampSec(date) : date,
    'MMM DD YYYY',
  )
}
