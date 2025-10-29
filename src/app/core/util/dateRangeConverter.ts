import { SelectedDateFilter } from "../models/qbd/misc/qbd-date-filter.model";

// Converts a date range {startDate: Date, endDate: Date} to the
// API format: {start: string, end: string}
// These dates are in the format: YYYY-MM-DDTHH:MM:SS in UTC timezone
export const convertDateRangeToAPIFormat = (selectedDateFilter: SelectedDateFilter) => {
    const {startDate, endDate} = selectedDateFilter;
    endDate.setHours(23, 59, 59);
    return {
      start: `${startDate.getUTCFullYear()}-${startDate.getUTCMonth() + 1}-${startDate.getUTCDate()}T${startDate.getUTCHours()}:${startDate.getUTCMinutes()}:${startDate.getUTCSeconds()}`,
      end: `${endDate.getUTCFullYear()}-${endDate.getUTCMonth() + 1}-${endDate.getUTCDate()}T${endDate.getUTCHours()}:${endDate.getUTCMinutes()}:${endDate.getUTCSeconds()}`
    };
};
