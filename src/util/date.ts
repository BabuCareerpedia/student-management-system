import {MONTHS} from '@constants/master_data_constants';
import logger from '@logger';
import {DateTime} from 'luxon';

export function twoDigits(d) {
    if (0 <= d && d < 10) {
        return '0' + d.toString();
    }
    if (-10 < d && d < 0) {
        return '-0' + (-1 * d).toString();
    }
    return d.toString();
}

export function convertDateTimeToMysqlDateTime(date: Date) {
    try {
        return date.getUTCFullYear() + '-' + twoDigits(1 + date.getUTCMonth()) + '-' + twoDigits(date.getUTCDate())
            + ' ' + twoDigits(date.getUTCHours()) + ':' + twoDigits(date.getUTCMinutes()) + ':'
            + twoDigits(date.getUTCSeconds());
    } catch (error) {
        logger.error('ERROR occurred in utils.date.convertDateToMysqlDateTime()', error);
        throw error;
    }
}

export function convertDateToYYYDDMM(date: Date) {
    try {
        return `${date.getFullYear()}-${twoDigits(date.getMonth() + 1)}-${twoDigits(date.getDate())}`;
    } catch (error) {
        logger.error('ERROR occurred in utils.date.convertDateToYYYDDMM()', error);
        throw error;
    }
}

export function convertDateToLocalString(date: Date): string {
    const month = MONTHS[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
}

export function getDateWithDiff(startDate: string, days: number): string {
    return DateTime.fromISO(startDate).plus({days: days}).toISODate();
}

export function getDaysDiffOfDates(startDate: string, endDate: string): any {
    const date1 = DateTime.fromISO(startDate);
    const date2 = DateTime.fromISO(endDate);

    const diff = date1.diff(date2, ['days']);
    return diff.toObject();

}

export function getFinancialYear() {
    try {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        function sliceYear(inputYear: number) {
            return String(inputYear).slice(2, 4);
        }

        const financialYear = `${month < 3 ? sliceYear(year - 1) : sliceYear(year)}-` +
            `${month >= 3 ? sliceYear(year + 1) : sliceYear(year)}`;
        return financialYear.split('-')[1];
    } catch (error) {
        logger.debug('ERROR occurred in getFinancialYear()');
        logger.error(error);
        throw error;
    }
}

export function getMonthsBetweenDateRange(startDate, endDate) {
    const start = startDate.split('-');
    const end = endDate.split('-');
    const startYear = parseInt(start[0]);
    const endYear = parseInt(end[0]);
    const dates = [];

    for (let i = startYear; i <= endYear; i++) {
        const endMonth = i != endYear ? 11 : parseInt(end[1]) - 1;
        const startMon = i === startYear ? parseInt(start[1]) - 1 : 0;
        for (let j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j + 1) {
            const month = j + 1;
            const displayMonth = month < 10 ? '0' + month : month;
            dates.push(Number(displayMonth));
        }
    }
    return dates;
}

export function getMonthsAndYearBetweenDateRange(startDate, endDate) {
    const start = startDate.split('-');
    const end = endDate.split('-');
    const startYear = parseInt(start[0]);
    const endYear = parseInt(end[0]);
    const dates = [];

    for (let i = startYear; i <= endYear; i++) {
        const endMonth = i != endYear ? 11 : parseInt(end[1]) - 1;
        const startMon = i === startYear ? parseInt(start[1]) - 1 : 0;
        for (let j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j + 1) {
            const month = j + 1;
            const displayMonth = month < 10 ? '0' + month : month;
            dates.push([Number(displayMonth), i]);
        }
    }
    return dates;
}

export function daysInMonth(month, year) {
    return twoDigits(new Date(year, month, 0).getDate());
}

export function getNumberOfDaysBetweenDays(startDate: any, endDate: any) {
    const date1 = new Date(startDate);
    const date2 = new Date(endDate);
    // @ts-ignore
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
}

export function getFirstDayAndLastOfMonthsBetweenDateRange(startDate: string, endDate: string) {
    const monthsAndYear = getMonthsAndYearBetweenDateRange(startDate, endDate);
    const splittedStartDate = startDate.split('-');
    const splittedEndDate = endDate.split('-');
    const months = [];
    for (const [month, year] of monthsAndYear) {
        const totalDaysInMonth = daysInMonth(month, year);
        let startDay = '01';
        let lastDay = totalDaysInMonth;
        if (Number(splittedStartDate[0]) == year && Number(splittedStartDate[1]) == month) {
            startDay = splittedStartDate[2];
        }
        if (Number(splittedEndDate[0]) == year && Number(splittedEndDate[1]) == month) {
            lastDay = splittedEndDate[2];
        }
        // Save Date Objects for furture calculations
        const monthStartDate = new Date(`${year}-${twoDigits(month)}-${startDay}`);
        const monthEndDate = new Date(`${year}-${twoDigits(month)}-${lastDay}`);
        months.push({
            month,
            year,
            monthStartDate,
            monthEndDate,
        });
    }
    return months;
}

export function getDatesBetweenDateRange(startDate, endDate) {
    function addDays(date, days) {
        date.setDate(date.getDate() + days);
        return date;
    }

    startDate = new Date(startDate);
    endDate = new Date(endDate);
    const dateArray = [];
    let currentDate = startDate;
    while (currentDate <= endDate) {
        dateArray.push(convertDateToYYYDDMM(currentDate));
        currentDate = addDays(currentDate, 1);
    }
    return dateArray;
}

export function getTotalMonthsBetweenDateRange(startDate, endDate) {
    const start = startDate.split('-');
    const end = endDate.split('-');
    const startYear = parseInt(start[0]);
    const endYear = parseInt(end[0]);

    let totalMonths = 0;
    for (let i = startYear; i <= endYear; i++) {
        const endMonth = i != endYear ? 11 : parseInt(end[1]) - 1;
        const startMon = i === startYear ? parseInt(start[1]) - 1 : 0;
        for (let j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j + 1) {
            totalMonths += 1;
        }
    }
    return totalMonths;
}

export function getPreviousDate(date: string) {
    const yesterday = new Date(date);
    yesterday.setDate(yesterday.getDate() - 1);
    return convertDateToYYYDDMM(yesterday);
}
