import dayjs from "dayjs";
import numeral from "numeral";

export const dateAndTimeFormat = (date: string) => {
  if (date) {
    return dayjs(date).format("DD/MM/YYYY, h:mm A");
  }
};

export const standardDateFormat = (date: string) : string | undefined => {
  if (date) {
    return dayjs(date).format("DD-MMM-YYYY");
  }
};

export const longDateFormat = (date: string) => {
  if (date) {
    return dayjs(date).format("DD MMM YYYY");
  }
};


export const rawTimeFormat = (date: string) => {
    if (date) {
      return dayjs(date).format("h:mm A");
    }
  };

export const longDateAndTimeFormat = (date: string) => {
  if (date) {
    return dayjs(date).format("DD MMM YYYY, h:mm A");
  }
};

export const dateFormat = (date: string) => {
  if (date) {
    return dayjs(date).format("MMM DD");
  }
};

export const isoDateFormat = (date: string) => {
  if (date) {
    return dayjs(date).toISOString();
  }
};

export const shortDateFormat = (date: string) => {
  return dayjs(date).format("YYYY-MM-DD");
};

export const _currency = (value: string | number) => {
  return numeral(value).format("0,000.00");
};

export const toNumber = (value: string | number) => {
  return numeral(value).format("0,0");
};

export const toAbs = (value: string | number) => {
  let formatVal: number = 0;
  if (typeof value === "string") {
    formatVal = parseInt(value);
  }
  if (typeof value === "number") {
    formatVal = value;
  }
  return Number.isInteger(formatVal)
    ? Math.abs(formatVal)
    : Math.abs(formatVal).toFixed(2);
};