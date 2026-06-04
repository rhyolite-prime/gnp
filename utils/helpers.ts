import dayjs from "dayjs";
import numeral from "numeral";

export function isMobileScreen() {
  const screenWidth = window.innerWidth;
  if (screenWidth <= 980) {
    return true;
  }
  return false;
}

export const getCurrentDate = () => {
    return dayjs().format("DD-MMM-YYYY");
};
  
export const formatAscurrency = (value: string | number) => {
    let formattedValue = numeral(value).format("0,000.00");
    return parseFloat(formattedValue);
  };

export const generateReceiptNumber = () : string => {
    return dayjs().format("YYYYMMDDhhmmss");
};

export const generateUniqueIdentifier = (): string => {
     
    let identifier = dayjs().format("DDhhmmss");
    identifier = identifier.replace(/^0+/, '');
    return identifier;
};
  

export const generateSku = (): string => {
    
    return dayjs().format("hhmmss");
  };

export const buildQueryParams = (params: any) => {
  Object.keys(params).forEach((key) => {
    if (
      params[key] === null ||
      params[key] === "" ||
      params[key] === " " ||
      params[key] === undefined
    ) {
      delete params[key];
    }
  });
  let queryString = Object.keys(params)
    .map((key) => key + "=" + params[key])
    .join("&");
  return queryString;
};

export const filterQueryParams = (query: any) => {
  const obj: any = {};

  Object.keys(query).forEach((key) => {
    const value = query[key];

    if (
      value !== null &&
      value !== "" &&
      value !== " " &&
      value !== undefined
    ) {
      obj[key] = value;
    }
  });

  return obj;
};

export const replacePartOfString = (
  originalString: string | Ref<string>,
  params: { target: string | string[]; replacement: string }
) => {
  let newString = originalString as string;
  if (typeof params.target === "object") {
    params.target.forEach((word) => {
      if (newString.includes(word)) {
        newString = newString.replace(word, params.replacement);
      }
    });
  }

  if (typeof params.target === "string") {
    newString = newString.replace(params.target, params.replacement);
  }

  return newString;
};

export const scrollTop = () => {
  window.scroll({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
};


export const isValidEmail = (email: string) => {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return pattern.test(email?.trim());
};

export const isValidPhoneNumber = (number: string) => {
  const pattern = /^(\d+-)*\d+$/;
  return pattern.test(number) && number.length === 10;
};

export const isNullOrUndefined = (item: any) => {
  return typeof item === "undefined" || item === null;
};

export const isUndefined = (val: any) => {
  return (
    val === undefined ||
    typeof val === "undefined" ||
    (typeof val === "string" && !val?.length)
  );
};

export const isNumber = (item: any) => {
  return typeof item === "number";
};

export const isString = (item: any) => {
  return typeof item === "string";
};

export const addPossesive = (item: string) => {
  if (!item) return;
  return item.endsWith("s" || "S") ? `${item}'` : `${item}'s`;
};

export const generateEmptyGuid = (): string => {
  return "00000000-0000-0000-0000-000000000000";
};



export const bufferToBase64URL = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};
