import { isBefore, isSameDay, isSameMonth, getYear } from 'date-fns';
// utils
import { fDate } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export function isDateError(startDate, endDate) {
  let error = false;

  if (startDate && endDate) {
    error = isBefore(new Date(endDate), new Date(startDate));
  }

  return error;
}

// ----------------------------------------------------------------------

export function shortDateLabel(startDate, endDate) {
  const getCurrentYear = new Date().getFullYear();

  const startDateYear = startDate ? getYear(startDate) : null;

  const endDateYear = endDate ? getYear(endDate) : null;

  const currentYear = getCurrentYear === startDateYear && getCurrentYear === endDateYear;

  const sameDay = startDate && endDate ? isSameDay(new Date(startDate), new Date(endDate)) : false;

  const sameMonth =
    startDate && endDate ? isSameMonth(new Date(startDate), new Date(endDate)) : false;

  if (currentYear) {
    if (sameMonth) {
      if (sameDay) {
        return fDate(endDate, 'dd MMM yy');
      }
      return `${fDate(startDate, 'dd')} - ${fDate(endDate, 'dd MMM yy')}`;
    }
    return `${fDate(startDate, 'dd MMM')} - ${fDate(endDate, 'dd MMM yy')}`;
  }

  return `${fDate(startDate, 'dd MMM yy')} - ${fDate(endDate, 'dd MMM yy')}`;
}
