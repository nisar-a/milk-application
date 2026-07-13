const dayjs = require('dayjs');

const normalizeToDayStart = (dateInput) => {
  return dayjs(dateInput).startOf('day').toDate();
};

const getMonthRange = (month) => {
  const start = dayjs(`${month}-01`).startOf('month');
  return {
    start: start.toDate(),
    end: start.endOf('month').toDate()
  };
};

module.exports = {
  normalizeToDayStart,
  getMonthRange
};
