export function getToday(){
    return new Date().toISOString().split('T')[0]; //yyyy-mm-dd
}

export function getWeekAgo(){
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split('T')[0]; //yyyy-mm-dd
}

export function isDateRangeValid(startDate, endDate){
    const start = new Date(startDate);
    const end = new Date(endDate);

    const sevenDays = 1000 * 60 * 60 * 24 * 7;

    const diff = end.getTime() - start.getTime();

    return diff <= sevenDays && diff > 0
}

export function datePickerNow(){
    return new Date().toISOString().split(":").slice(0,2);
}