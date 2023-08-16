import {
  Person,
} from "../interfaces/CodiceFiscale.interface";
import { getProvinces } from "../utils/CommonUtils";
import { InvalidInputError, InvalidRegexError } from "../utils/Errors";



/**
 * ItalianDocsValidationJs Library
 * 
 *  CODICE FISCALE
 */

/**
 * Generates an Italian codice fiscale (fiscal code) based on the provided Person object.
 *
 * @param person - The Person object containing personal information for generating the codice fiscale.
 * @returns The generated codice fiscale string.
 * @throws InvalidInputError if any required field in the person object is missing.
 */
export const generateCodiceFiscale = (person: Person): string => {
  // Check if all required fields are present in the person object
  Object.entries(person).map(([key, value]) => {
    if (!value) {
      throw new InvalidInputError('Invalid input');
    }
  });

  // Extract necessary information
  const firstName = extractFirstName(person.firstName);
  const lastName = extractLastName(person.lastName);
  const year = extractYearOfBirth(person.birthday);
  const month = extractMonthOfBirth(person.birthday);
  const day = extractDayOfBirth(person.birthday, person.gender);
  const comune = extractBirthplace(person.birthplace, person.birthplaceInitials);
  const partialCdf = `${lastName}${firstName}${year}${month}${day}${comune}`;
  const controlCode = extractControlCode(partialCdf);
  const cdf = `${partialCdf}${controlCode}`;
  return cdf;
};

/**
 * Extracts the first, second, and third consonants from the surname.
 * If there are not enough consonants, it proceeds with the vowels.
 *
 * @param lastName - The last name from which to extract consonants and vowels.
 * @returns The extracted consonants or a combination of consonants and vowels according to the rules.
 * @throws InvalidInputError if the last name is missing or invalid.
 * @throws InvalidRegexError for various regex-based validation errors.
 */
export const extractLastName = (lastName: string): string => {
  if (!lastName) {
    throw new InvalidInputError('Last name is required.');
  }

  // Validate last name using regex patterns
  const maxChars = /^[A-Za-z\s]{2,40}$/;
  if (!maxChars.test(lastName)) {
    throw new InvalidRegexError("Last name must be between 2 and 40 characters and only contain letters.");
  }

  // Normalize and convert to uppercase
  lastName = lastName.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();

  // Count consonants and vowels
  let consonantCount = 0;
  let vowelCount = 0;
  let firstNameConsonants = "";
  let firstNameVowels = "";

  // Iterate through the characters of the last name
  Array.from(lastName).forEach((char) => {
    if (/[a-zA-Z]/.test(char)) {
      if ("AEIOUaeiou".includes(char)) {
        vowelCount++;
        firstNameVowels += char;
      } else {
        consonantCount++;
        firstNameConsonants += char;
      }
    }
  });

  // Generate the result based on consonant and vowel counts
  let result = "";
  if (consonantCount >= 3) {
    result = firstNameConsonants.slice(0, 3);
  } else {
    if (consonantCount === 1) {
      result = firstNameConsonants[0];
      result += vowelCount === 0 ? "XX" : (vowelCount === 1 ? firstNameVowels[0] + "X" : firstNameVowels.slice(0, 2));
    } else if (consonantCount === 2) {
      result = firstNameConsonants.slice(0, 2);
      result += vowelCount === 0 ? "X" : firstNameVowels[0];
    }
  }

  return result;
};
/**
 * Extracts the first, third, and fourth consonants from the first name.
 * If there are not enough consonants, it proceeds with the vowels.
 *
 * @param firstName - The first name from which to extract consonants and vowels.
 * @returns The extracted consonants or a combination of consonants and vowels according to the rules.
 * @throws InvalidInputError if the first name is missing or invalid.
 * @throws InvalidRegexError for various regex-based validation errors.
 */
export const extractFirstName = (firstName: string): string => {
  if (!firstName) {
    throw new InvalidInputError('First name is required.');
  }

  // Regular expression constants
  const maxCharsRegex = /^[A-Za-z\s]{2,40}$/;

  if (!maxCharsRegex.test(firstName)) {
    throw new InvalidRegexError("First name must be between 2 and 40 characters and only contain letters.");
  }

  firstName = firstName
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();

  const letters = Array.from(firstName).filter(char => /[a-zA-Z]/.test(char));
  const vowels = letters.filter(char => "AEIOUaeiou".includes(char));
  const consonants = letters.filter(char => !"AEIOUaeiou".includes(char));

  let result = "";

  if (consonants.length >= 3) {
    result = consonants[0] + consonants[2] + consonants[3];
  }

  if (consonants.length === 1) {
    result = consonants[0] + (vowels.length === 0 ? "XX" : (vowels.length === 1 ? vowels[0] + "X" : vowels[0] + vowels[1]));
  }

  if (consonants.length === 2) {
    result = consonants[0] + consonants[1] + (vowels.length === 0 ? "X" : vowels[0]);
  }

  if (consonants.length === 3) {
    result = consonants.join("");
  }

  return result;
};

/**
 * Extracts the year of birth from various input formats including Date, string, or number.
 *
 * @param {Date|string|number} dateOfBirth - The input representing the date of birth.
 * @returns {string} The extracted year of birth.
 * @throws {InvalidInputError} If the input format is not supported or invalid.
 */
export const extractYearOfBirth = (dateOfBirth) => {
  const DATE_FORMAT_REGEX = /^\d{2}[-/]\d{2}[-/]\d{4}$/;
  const DDMMYYYY_REGEX = /^\d{8}$/;

  if (!dateOfBirth) {
    throw new InvalidInputError('Date of birth is required.');
  }

  if (typeof dateOfBirth === "string") {
    if (DATE_FORMAT_REGEX.test(dateOfBirth)) {
      const delimiter = dateOfBirth.includes("/") ? "/" : "-";
      const splittedDate = dateOfBirth.split(delimiter);

      if (splittedDate.length === 3 && splittedDate[2].length === 4) {
        return splittedDate[2].slice(2);
      }
    } else if (DDMMYYYY_REGEX.test(dateOfBirth)) {
      return dateOfBirth.slice(6, 8);
    }

    throw new InvalidInputError('Unsupported date format');
  }

  if (typeof dateOfBirth === "number") {
    if (dateOfBirth < 0) {
      throw new InvalidInputError('Invalid timestamp');
    }

    const year = new Date(dateOfBirth).getFullYear().toString().slice(2, 4);
    return year;
  }

  if (dateOfBirth instanceof Date) {
    const year = dateOfBirth.getFullYear().toString().slice(2, 4);
    return year;
  }

  throw new InvalidInputError('Invalid input');
};

/**
 * Extracts the month of birth code from a given date of birth.
 *
 * @param {Date | string | number} dateOfBirth - The date of birth to extract the month code from.
 * @returns {string} The extracted month code.
 * @throws {InvalidInputError} If the input is invalid or in an unsupported format.
 */

export const extractMonthOfBirth = (dateOfBirth: Date | string | number): string => {
  // Check if input is empty
  if (!dateOfBirth) throw new InvalidInputError('Invalid input.');

  // Mapping of month numbers to corresponding letters
  const monthMap = new Map<string, string>([
    ['01', 'A'], // January
    ['02', 'B'], // February
    ['03', 'C'], // March
    ['04', 'D'], // April
    ['05', 'E'], // May
    ['06', 'H'], // June
    ['07', 'L'], // July
    ['08', 'M'], // August
    ['09', 'P'], // September
    ['10', 'R'], // October
    ['11', 'S'], // November
    ['12', 'T'], // December
  ]);

  // Handle string input
  if (typeof dateOfBirth === 'string') {
    // Check if input matches the format xx-xx-xxxx or xx/xx/xxxx
    if (/^\d{2}[-/]\d{2}[-/]\d{4}$/.test(dateOfBirth)) {
      const delimiter = dateOfBirth.includes('/') ? '/' : '-';
      const month = dateOfBirth.split(delimiter)[1];
      if (!month) throw new InvalidInputError('Invalid input.');
      return monthMap.get(month);
    } else if (/^\d{8}$/.test(dateOfBirth)) {
      // Check if input is in the format of eight digits
      const month = dateOfBirth.slice(2, 4);
      if (!month) throw new InvalidInputError('Invalid input.');
      return monthMap.get(month);
    }
  }
  // Handle numeric input
  else if (typeof dateOfBirth === 'number') {
    // Check if input is a positive number
    if (dateOfBirth < 0) throw new InvalidInputError('Invalid input.');
    const date = new Date(dateOfBirth);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return monthMap.get(month);
  }
  // Handle Date object input
  else if (dateOfBirth instanceof Date) {
    const month = (dateOfBirth.getMonth() + 1).toString().padStart(2, '0');
    return monthMap.get(month);
  }

  // Invalid input type
  throw new InvalidInputError('Invalid input.');
};

/**
 * Extracts the day from the date of birth and converts it according to gender convention (F+40)
 *
 * @param {Date|string} dateOfBirth - The date of birth to extract the day from.
 * @param {string} gender - The gender of the individual ('M' or 'F').
 * @returns {string} The extracted day of birth according to gender convention.
 * @throws {InvalidInputError} If date of birth or gender is not provided.
 * @throws {InvalidRegexError} If the gender is not 'M' or 'F'.
 */
export const extractDayOfBirth = (dateOfBirth: Date | string, gender: string) => {
  // Check if date of birth and gender are provided
  if (!dateOfBirth) {
    throw new InvalidInputError('Date of birth is required.');
  }
  if (!gender) {
    throw new InvalidInputError('Gender is required.');
  }

  // Convert gender to uppercase for comparison
  const _gender = gender.toUpperCase();

  // Validate gender
  if (_gender !== "M" && _gender !== "F") {
    throw new InvalidRegexError("Gender must be 'M' or 'F'.");
  }

  // Check if the individual is female based on gender
  const isFemale = _gender === "F";

  // Check if date of birth is a string
  const isString = typeof dateOfBirth === "string";

  // Handle string input
  if (isString) {
    // Split date of birth if it contains '/'
    if (dateOfBirth.includes("/")) {
      const splittedDate = dateOfBirth.split("/");
      const day = isFemale ? 40 + Number(splittedDate.splice(0, 2)[0]) : splittedDate.splice(0, 2)[0];
      return day.toString();
    }
  } else {
    // Get the day from the date object
    const day = new Date(dateOfBirth).toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).split("/")[1];

    // Calculate the converted day if the individual is female
    if (isFemale) {
      const convertedDay = 40 + Number(day);
      return convertedDay.toString();
    }

    return day;
  }
};
/**
 * Find the fisco_code using data from the library
 *
 * @param {string} birthPlace - The birthplace of the individual.
 * @param {string} birthplaceInitials - The initials of the birthplace.
 * @returns {string} The fisco_code associated with the birthplace.
 * @throws {InvalidInputError} If birthplace or birthplaceInitials are not provided, or if they are invalid.
 */
export const extractBirthplace = (birthPlace, birthplaceInitials) => {
  // Check if birthPlace and birthplaceInitials are provided
  if (!birthPlace || !birthplaceInitials) {
    throw new InvalidInputError('Invalid input');
  }

  // Convert initials to uppercase
  const fKey = birthplaceInitials[0].toUpperCase();
  const sKey = birthplaceInitials[1].toUpperCase();

  // Error messages
  const birthplaceInitialsNotAssociatedWithBirthplaceException = `Birth place initials ${birthplaceInitials} are not associated with birthplace ${birthPlace}`;
  const siglaNotValid = `${birthplaceInitials} is not valid`;

  // Check if initials are valid
  if (!fKey || !sKey) {
    throw new InvalidInputError(siglaNotValid);
  }

  try {
    // Check if the province exists in the data
    getProvinces()[fKey][sKey]?.length;
  } catch {
    throw new InvalidInputError(siglaNotValid);
  }

  // Find the birthplace using initials and birthplace name
  const _birthPlace = getProvinces()[fKey][sKey]?.find(
    (el) => el.provincia === birthplaceInitials && el.comune === birthPlace
  );

  // Throw an error if birthplace is not found
  if (!_birthPlace) {
    throw new InvalidInputError(birthplaceInitialsNotAssociatedWithBirthplaceException);
  }

  return _birthPlace.cod_fisco; // Return the fisco_code
};

/**
 * Extracts the control character of a partial codice fiscale.
 * @param partialCdf - Partial codice fiscale (15 characters)
 * @returns The control character
 */
export const extractControlCode = (partialCdf: string): string => {
  // Input validation
  if (!partialCdf) {
    throw new InvalidInputError("Partial codice fiscale is required.");
  }

  if (partialCdf.length !== 15) {
    throw new InvalidInputError("Partial codice fiscale must contain exactly 15 characters.");
  }

  const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const even = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
  ];
  const odd = [
    1, 0, 5, 7, 9, 13, 15, 17, 19, 21, 1, 0, 5, 7, 9, 13, 15, 17, 19, 21, 2,
    4, 18, 20, 11, 3, 6, 8, 12, 14, 16, 10, 22, 25, 24, 23,
  ];

  let cont = 0;
  // Calculate the sum using even and odd arrays based on character indexes
  Array.from(partialCdf).forEach((char, i) => {
    const index = characters.indexOf(partialCdf.charAt(i));
    if (index !== -1) {
      cont += i % 2 === 0 ? odd[index] : even[index];
    }
  });

  // Calculate control character index and return it from the characters string
  const controlIndex = ((cont % 26) + 10) % 36;
  return characters.charAt(controlIndex);
}

/**
 * Check if the last name is valid according to specific rules.
 * @param lastName - The last name to validate.
 * @returns True if the last name is valid, otherwise false.
 */
export const isLastNameValid = (lastName: string): boolean => {
  if (!lastName) throw new InvalidInputError('Last name is required.');

  // Regular expression patterns
  const atLeastVowelPattern = /^(?=.*[aeiouAEIOU])/;
  const atLeastConsonantPattern = /^(?=.*[^aeiouAEIOU])/;
  const maxCharsPattern = /^[A-Za-z\s]{2,40}$/;

  // Test against the regular expression patterns
  const hasAtLeastVowel = atLeastVowelPattern.test(lastName);
  const hasAtLeastConsonant = atLeastConsonantPattern.test(lastName);
  const hasValidLength = maxCharsPattern.test(lastName);
  const isNotEmpty = lastName.trim() !== '';

  // Check if the last name is valid based on the rules
  if (hasAtLeastVowel || hasAtLeastConsonant || !hasValidLength || !isNotEmpty) {
    return false;
  }

  return true;
};
/**
 * Check if the first name is valid according to specific rules.
 * @param firstName - The first name to validate.
 * @returns True if the first name is valid, otherwise false.
 */
export const isFirstNameValid = (firstName: string): boolean => {
  if (!firstName) throw new InvalidInputError('First name is required.');

  // Regular expression patterns
  const atLeastVowelPattern = /^(?=.*[aeiouAEIOU])/;
  const atLeastConsonantPattern = /^(?=.*[^aeiouAEIOU])/;
  const maxCharsPattern = /^[A-Za-z\s]{2,40}$/;

  // Test against the regular expression patterns
  const hasAtLeastVowel = atLeastVowelPattern.test(firstName);
  const hasAtLeastConsonant = atLeastConsonantPattern.test(firstName);
  const hasValidLength = maxCharsPattern.test(firstName);
  const isNotEmpty = firstName.trim() !== '';

  // Check if the first name is valid based on the rules
  if (hasAtLeastVowel || hasAtLeastConsonant || !hasValidLength || !isNotEmpty) {
    return false;
  }

  return true;
};

// CODICE FISCALE REVERSE
/**
 * Extract data from a codice fiscale and return a Person object.
 * @param codiceFiscale - The codice fiscale to reverse.
 * @returns A Person object containing extracted data.
 */
export const reverseCodiceFiscale = (codiceFiscale: string): Person => {
  if (!codiceFiscale || codiceFiscale.length !== 16) {
    throw new InvalidInputError("Invalid codice fiscale.");
  }

  return {
    // Extract and reverse the first name
    firstName: reverseExtractFirstName(codiceFiscale),

    // Extract and reverse the last name
    lastName: reverseExtractLastName(codiceFiscale),

    // Extract and reverse the birthday in DD/MM/YYYY format
    birthday: `${reverseExtractDayOfBirth(codiceFiscale)}/${
      reverseExtractMonthOfBirth(codiceFiscale)
    }/${reverseExtractYearOfBirth(codiceFiscale)}`,

    // Extract and reverse the gender
    gender: reverseExtractGender(codiceFiscale),

    // Extract and reverse the birthplace
    birthplace: reverseExtractBirthplace(codiceFiscale),

    // Extract and reverse the birthplace initials
    birthplaceInitials: reverseExtractBirthplaceInitials(codiceFiscale),
  };
};
/**
 * Extract the last name from the codice fiscale.
 * @param codiceFiscale - The codice fiscale from which to extract the last name.
 * @Example: 'RSSMRA99B11F205I'
 * @returns The extracted last name. 'RSS'
 */
export const reverseExtractLastName = (codiceFiscale: string): string => {
  if (!codiceFiscale || codiceFiscale.length !== 16) {
    throw new InvalidInputError("Invalid codice fiscale.");
  }

  // Extract the first 3 characters from the codice fiscale
  return codiceFiscale.slice(0, 3);
};
/** 
 * Extract the first name from the codice fiscale.
 * @param codiceFiscale 
 * @Example: 'RSSMRA99B11F205I'
 * @returns 'MRA'
 */
export const reverseExtractFirstName = (codiceFiscale: string): string => {
  if (!codiceFiscale || codiceFiscale.length !== 16) throw new InvalidInputError("Invalid codice fiscale.");


  return codiceFiscale.slice(3, 6);
}
/** 
 * Extract the month of birthday from the codice fiscale.
 * @param codiceFiscale - The codice fiscale from which to extract the month of birthday.
 * @returns The extracted month of birthday.
 */
export const reverseExtractMonthOfBirth = (codiceFiscale: string): string => {
  if (!codiceFiscale || codiceFiscale.length !== 16) {
    throw new InvalidInputError("Invalid codice fiscale.");
  }

  const reverseMonthMap = new Map();
  reverseMonthMap.set("A", "01"); // Gennaio
  reverseMonthMap.set("B", "02"); // Febbraio
  reverseMonthMap.set("C", "03"); // Marzo
  reverseMonthMap.set("D", "04"); // Aprile
  reverseMonthMap.set("E", "05"); // Maggio
  reverseMonthMap.set("H", "06"); // Giugno
  reverseMonthMap.set("L", "07"); // Luglio
  reverseMonthMap.set("M", "08"); // Agosto
  reverseMonthMap.set("P", "09"); // Settembre
  reverseMonthMap.set("R", "10"); // Ottobre
  reverseMonthMap.set("S", "11"); // Novembre
  reverseMonthMap.set("T", "12"); // Dicembre

  // Extract the character at index 8 (9th character) from the codice fiscale
  const month = codiceFiscale.slice(8, 9);
  return reverseMonthMap.get(month);
};

/** 
 * Extract the gender from the codice fiscale.
 * @param codiceFiscale - The codice fiscale from which to extract the gender.
 * @Example: 'RSSMRA99B11F205I'
 * @returns The extracted gender ('M' or 'F').
 */
export const reverseExtractGender = (codiceFiscale: string): string => {
  if (!codiceFiscale || codiceFiscale.length !== 16) {
    throw new InvalidInputError("Invalid codice fiscale.");
  }
  const day = Number(codiceFiscale.slice(9, 11));
  if (day > 31) return "F";
  return "M";
};

/** 
* Extract the day of birthday from the codice fiscale.
* @param codiceFiscale - The codice fiscale from which to extract the day of birthday.
* @Example: 'RSSMRA99B11F205I'
* @returns The extracted day of birthday.
*/
export const reverseExtractDayOfBirth = (codiceFiscale: string): string => {
 if (!codiceFiscale || codiceFiscale.length !== 16) {
   throw new InvalidInputError("Invalid codice fiscale.");
 }

 // Extract characters from index 9 to 11 (exclusive) from the codice fiscale
 const day = Number(codiceFiscale.slice(9, 11));

 // Check if day is greater than 31 and adjust it accordingly
 if (day > 31) {
   return (day - 40).toString();
 }
 return day.toString();
};

/** 
* Extract the year of birthday from the codice fiscale.
* @param codiceFiscale - The codice fiscale from which to extract the year of birthday.
* @Example: 'RSSMRA99B11F205I'
* @returns The extracted year of birthday.
*/
export const reverseExtractYearOfBirth = (codiceFiscale: string): string => {
 if (!codiceFiscale || codiceFiscale.length !== 16) {
   throw new InvalidInputError("Invalid codice fiscale.");
 }

 // Extract characters from index 6 to 8 (exclusive) from the codice fiscale
 const year = codiceFiscale.slice(6, 8);

 // Check if the extracted year is greater than the current year and adjust it
 if (Number(year) > Number(new Date().getFullYear().toString().slice(-2))) {
   return `19${year}`;
 }
 return `20${year}`;
};

/** 
* Extract the birth place from the codice fiscale.
* @param codiceFiscale - The codice fiscale from which to extract the birth place.
* @Example: 'RSSMRA99B11F205I'
* @returns The extracted birth place.
*/
export const reverseExtractBirthplace = (codiceFiscale: string): string => {
 if (!codiceFiscale || codiceFiscale.length !== 16) {
   throw new InvalidInputError("Invalid codice fiscale.");
 }

 // Extract characters from index 11 to 15 (exclusive) from the codice fiscale
 const fisco = codiceFiscale.slice(11, 15);
 let cod_comune = "";

 // Iterate through the provinces data to find the matching birth place
 Object.values(getProvinces()).forEach((sottostruttura) => {
   Object.values(sottostruttura).forEach((province) => {
     const comune = province.find((el) => el.cod_fisco === fisco);
     if (comune) {
       cod_comune = comune.comune;
     }
   });
 });

 if (cod_comune) {
   return cod_comune;
 }
 return "";
};

/** 
* Extract the birth place's initials from the codice fiscale.
* @param codiceFiscale - The codice fiscale from which to extract the birth place's initials.
* @Example: 'RSSMRA99B11F205I'
* @returns The extracted birth place's initials.
*/
export const reverseExtractBirthplaceInitials = (
 codiceFiscale: string
): string => {
 if (!codiceFiscale || codiceFiscale.length !== 16) {
   throw new InvalidInputError("Invalid codice fiscale.");
 }

 // Extract characters from index 11 to 15 (exclusive) from the codice fiscale
 const fisco = codiceFiscale.slice(11, 15);
 let cod_comune = "";

 // Iterate through the provinces data to find the matching birth place
 Object.values(getProvinces()).forEach((sottostruttura) => {
   Object.values(sottostruttura).forEach((province) => {
     const comune = province.find((el) => el.cod_fisco === fisco);
     if (comune) {
       cod_comune = comune.provincia;
     }
   });
 });

 if (cod_comune) {
   return cod_comune;
 }
 return "";
}