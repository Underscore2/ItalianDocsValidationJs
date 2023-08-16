"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reverseExtractBirthplaceInitials = exports.reverseExtractBirthplace = exports.reverseExtractYearOfBirth = exports.reverseExtractDayOfBirth = exports.reverseExtractGender = exports.reverseExtractMonthOfBirth = exports.reverseExtractFirstName = exports.reverseExtractLastName = exports.reverseCodiceFiscale = exports.isFirstNameValid = exports.isLastNameValid = exports.extractControlCode = exports.extractBirthplace = exports.extractDayOfBirth = exports.extractMonthOfBirth = exports.extractYearOfBirth = exports.extractFirstName = exports.extractLastName = exports.generateCodiceFiscale = void 0;
var CommonUtils_1 = require("../utils/CommonUtils");
var Errors_1 = require("../utils/Errors");
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
var generateCodiceFiscale = function (person) {
    // Check if all required fields are present in the person object
    Object.entries(person).map(function (_a) {
        var key = _a[0], value = _a[1];
        if (!value) {
            throw new Errors_1.InvalidInputError('Invalid input');
        }
    });
    // Extract necessary information
    var firstName = (0, exports.extractFirstName)(person.firstName);
    var lastName = (0, exports.extractLastName)(person.lastName);
    var year = (0, exports.extractYearOfBirth)(person.birthday);
    var month = (0, exports.extractMonthOfBirth)(person.birthday);
    var day = (0, exports.extractDayOfBirth)(person.birthday, person.gender);
    var comune = (0, exports.extractBirthplace)(person.birthplace, person.birthplaceInitials);
    var partialCdf = "".concat(lastName).concat(firstName).concat(year).concat(month).concat(day).concat(comune);
    var controlCode = (0, exports.extractControlCode)(partialCdf);
    var cdf = "".concat(partialCdf).concat(controlCode);
    return cdf;
};
exports.generateCodiceFiscale = generateCodiceFiscale;
/**
 * Extracts the first, second, and third consonants from the surname.
 * If there are not enough consonants, it proceeds with the vowels.
 *
 * @param lastName - The last name from which to extract consonants and vowels.
 * @returns The extracted consonants or a combination of consonants and vowels according to the rules.
 * @throws InvalidInputError if the last name is missing or invalid.
 * @throws InvalidRegexError for various regex-based validation errors.
 */
var extractLastName = function (lastName) {
    if (!lastName) {
        throw new Errors_1.InvalidInputError('Last name is required.');
    }
    // Validate last name using regex patterns
    var maxChars = /^[A-Za-z\s]{2,40}$/;
    if (!maxChars.test(lastName)) {
        throw new Errors_1.InvalidRegexError("Last name must be between 2 and 40 characters and only contain letters.");
    }
    // Normalize and convert to uppercase
    lastName = lastName.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
    // Count consonants and vowels
    var consonantCount = 0;
    var vowelCount = 0;
    var firstNameConsonants = "";
    var firstNameVowels = "";
    // Iterate through the characters of the last name
    Array.from(lastName).forEach(function (char) {
        if (/[a-zA-Z]/.test(char)) {
            if ("AEIOUaeiou".includes(char)) {
                vowelCount++;
                firstNameVowels += char;
            }
            else {
                consonantCount++;
                firstNameConsonants += char;
            }
        }
    });
    // Generate the result based on consonant and vowel counts
    var result = "";
    if (consonantCount >= 3) {
        result = firstNameConsonants.slice(0, 3);
    }
    else {
        if (consonantCount === 1) {
            result = firstNameConsonants[0];
            result += vowelCount === 0 ? "XX" : (vowelCount === 1 ? firstNameVowels[0] + "X" : firstNameVowels.slice(0, 2));
        }
        else if (consonantCount === 2) {
            result = firstNameConsonants.slice(0, 2);
            result += vowelCount === 0 ? "X" : firstNameVowels[0];
        }
    }
    return result;
};
exports.extractLastName = extractLastName;
/**
 * Extracts the first, third, and fourth consonants from the first name.
 * If there are not enough consonants, it proceeds with the vowels.
 *
 * @param firstName - The first name from which to extract consonants and vowels.
 * @returns The extracted consonants or a combination of consonants and vowels according to the rules.
 * @throws InvalidInputError if the first name is missing or invalid.
 * @throws InvalidRegexError for various regex-based validation errors.
 */
var extractFirstName = function (firstName) {
    if (!firstName) {
        throw new Errors_1.InvalidInputError('First name is required.');
    }
    // Regular expression constants
    var maxCharsRegex = /^[A-Za-z\s]{2,40}$/;
    if (!maxCharsRegex.test(firstName)) {
        throw new Errors_1.InvalidRegexError("First name must be between 2 and 40 characters and only contain letters.");
    }
    firstName = firstName
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase();
    var letters = Array.from(firstName).filter(function (char) { return /[a-zA-Z]/.test(char); });
    var vowels = letters.filter(function (char) { return "AEIOUaeiou".includes(char); });
    var consonants = letters.filter(function (char) { return !"AEIOUaeiou".includes(char); });
    var result = "";
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
exports.extractFirstName = extractFirstName;
/**
 * Extracts the year of birth from various input formats including Date, string, or number.
 *
 * @param {Date|string|number} dateOfBirth - The input representing the date of birth.
 * @returns {string} The extracted year of birth.
 * @throws {InvalidInputError} If the input format is not supported or invalid.
 */
var extractYearOfBirth = function (dateOfBirth) {
    var DATE_FORMAT_REGEX = /^\d{2}[-/]\d{2}[-/]\d{4}$/;
    var DDMMYYYY_REGEX = /^\d{8}$/;
    if (!dateOfBirth) {
        throw new Errors_1.InvalidInputError('Date of birth is required.');
    }
    if (typeof dateOfBirth === "string") {
        if (DATE_FORMAT_REGEX.test(dateOfBirth)) {
            var delimiter = dateOfBirth.includes("/") ? "/" : "-";
            var splittedDate = dateOfBirth.split(delimiter);
            if (splittedDate.length === 3 && splittedDate[2].length === 4) {
                return splittedDate[2].slice(2);
            }
        }
        else if (DDMMYYYY_REGEX.test(dateOfBirth)) {
            return dateOfBirth.slice(6, 8);
        }
        throw new Errors_1.InvalidInputError('Unsupported date format');
    }
    if (typeof dateOfBirth === "number") {
        if (dateOfBirth < 0) {
            throw new Errors_1.InvalidInputError('Invalid timestamp');
        }
        var year = new Date(dateOfBirth).getFullYear().toString().slice(2, 4);
        return year;
    }
    if (dateOfBirth instanceof Date) {
        var year = dateOfBirth.getFullYear().toString().slice(2, 4);
        return year;
    }
    throw new Errors_1.InvalidInputError('Invalid input');
};
exports.extractYearOfBirth = extractYearOfBirth;
/**
 * Extracts the month of birth code from a given date of birth.
 *
 * @param {Date | string | number} dateOfBirth - The date of birth to extract the month code from.
 * @returns {string} The extracted month code.
 * @throws {InvalidInputError} If the input is invalid or in an unsupported format.
 */
var extractMonthOfBirth = function (dateOfBirth) {
    // Check if input is empty
    if (!dateOfBirth)
        throw new Errors_1.InvalidInputError('Invalid input.');
    // Mapping of month numbers to corresponding letters
    var monthMap = new Map([
        ['01', 'A'],
        ['02', 'B'],
        ['03', 'C'],
        ['04', 'D'],
        ['05', 'E'],
        ['06', 'H'],
        ['07', 'L'],
        ['08', 'M'],
        ['09', 'P'],
        ['10', 'R'],
        ['11', 'S'],
        ['12', 'T'], // December
    ]);
    // Handle string input
    if (typeof dateOfBirth === 'string') {
        // Check if input matches the format xx-xx-xxxx or xx/xx/xxxx
        if (/^\d{2}[-/]\d{2}[-/]\d{4}$/.test(dateOfBirth)) {
            var delimiter = dateOfBirth.includes('/') ? '/' : '-';
            var month = dateOfBirth.split(delimiter)[1];
            if (!month)
                throw new Errors_1.InvalidInputError('Invalid input.');
            return monthMap.get(month);
        }
        else if (/^\d{8}$/.test(dateOfBirth)) {
            // Check if input is in the format of eight digits
            var month = dateOfBirth.slice(2, 4);
            if (!month)
                throw new Errors_1.InvalidInputError('Invalid input.');
            return monthMap.get(month);
        }
    }
    // Handle numeric input
    else if (typeof dateOfBirth === 'number') {
        // Check if input is a positive number
        if (dateOfBirth < 0)
            throw new Errors_1.InvalidInputError('Invalid input.');
        var date = new Date(dateOfBirth);
        var month = (date.getMonth() + 1).toString().padStart(2, '0');
        return monthMap.get(month);
    }
    // Handle Date object input
    else if (dateOfBirth instanceof Date) {
        var month = (dateOfBirth.getMonth() + 1).toString().padStart(2, '0');
        return monthMap.get(month);
    }
    // Invalid input type
    throw new Errors_1.InvalidInputError('Invalid input.');
};
exports.extractMonthOfBirth = extractMonthOfBirth;
/**
 * Extracts the day from the date of birth and converts it according to gender convention (F+40)
 *
 * @param {Date|string} dateOfBirth - The date of birth to extract the day from.
 * @param {string} gender - The gender of the individual ('M' or 'F').
 * @returns {string} The extracted day of birth according to gender convention.
 * @throws {InvalidInputError} If date of birth or gender is not provided.
 * @throws {InvalidRegexError} If the gender is not 'M' or 'F'.
 */
var extractDayOfBirth = function (dateOfBirth, gender) {
    // Check if date of birth and gender are provided
    if (!dateOfBirth) {
        throw new Errors_1.InvalidInputError('Date of birth is required.');
    }
    if (!gender) {
        throw new Errors_1.InvalidInputError('Gender is required.');
    }
    // Convert gender to uppercase for comparison
    var _gender = gender.toUpperCase();
    // Validate gender
    if (_gender !== "M" && _gender !== "F") {
        throw new Errors_1.InvalidRegexError("Gender must be 'M' or 'F'.");
    }
    // Check if the individual is female based on gender
    var isFemale = _gender === "F";
    // Check if date of birth is a string
    var isString = typeof dateOfBirth === "string";
    // Handle string input
    if (isString) {
        // Split date of birth if it contains '/'
        if (dateOfBirth.includes("/")) {
            var splittedDate = dateOfBirth.split("/");
            var day = isFemale ? 40 + Number(splittedDate.splice(0, 2)[0]) : splittedDate.splice(0, 2)[0];
            return day.toString();
        }
    }
    else {
        // Get the day from the date object
        var day = new Date(dateOfBirth).toLocaleDateString("it-IT", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }).split("/")[1];
        // Calculate the converted day if the individual is female
        if (isFemale) {
            var convertedDay = 40 + Number(day);
            return convertedDay.toString();
        }
        return day;
    }
};
exports.extractDayOfBirth = extractDayOfBirth;
/**
 * Find the fisco_code using data from the library
 *
 * @param {string} birthPlace - The birthplace of the individual.
 * @param {string} birthplaceInitials - The initials of the birthplace.
 * @returns {string} The fisco_code associated with the birthplace.
 * @throws {InvalidInputError} If birthplace or birthplaceInitials are not provided, or if they are invalid.
 */
var extractBirthplace = function (birthPlace, birthplaceInitials) {
    var _a, _b;
    // Check if birthPlace and birthplaceInitials are provided
    if (!birthPlace || !birthplaceInitials) {
        throw new Errors_1.InvalidInputError('Invalid input');
    }
    // Convert initials to uppercase
    var fKey = birthplaceInitials[0].toUpperCase();
    var sKey = birthplaceInitials[1].toUpperCase();
    // Error messages
    var birthplaceInitialsNotAssociatedWithBirthplaceException = "Birth place initials ".concat(birthplaceInitials, " are not associated with birthplace ").concat(birthPlace);
    var siglaNotValid = "".concat(birthplaceInitials, " is not valid");
    // Check if initials are valid
    if (!fKey || !sKey) {
        throw new Errors_1.InvalidInputError(siglaNotValid);
    }
    try {
        // Check if the province exists in the data
        (_a = (0, CommonUtils_1.getProvinces)()[fKey][sKey]) === null || _a === void 0 ? void 0 : _a.length;
    }
    catch (_c) {
        throw new Errors_1.InvalidInputError(siglaNotValid);
    }
    // Find the birthplace using initials and birthplace name
    var _birthPlace = (_b = (0, CommonUtils_1.getProvinces)()[fKey][sKey]) === null || _b === void 0 ? void 0 : _b.find(function (el) { return el.provincia === birthplaceInitials && el.comune === birthPlace; });
    // Throw an error if birthplace is not found
    if (!_birthPlace) {
        throw new Errors_1.InvalidInputError(birthplaceInitialsNotAssociatedWithBirthplaceException);
    }
    return _birthPlace.cod_fisco; // Return the fisco_code
};
exports.extractBirthplace = extractBirthplace;
/**
 * Extracts the control character of a partial codice fiscale.
 * @param partialCdf - Partial codice fiscale (15 characters)
 * @returns The control character
 */
var extractControlCode = function (partialCdf) {
    // Input validation
    if (!partialCdf) {
        throw new Errors_1.InvalidInputError("Partial codice fiscale is required.");
    }
    if (partialCdf.length !== 15) {
        throw new Errors_1.InvalidInputError("Partial codice fiscale must contain exactly 15 characters.");
    }
    var characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var even = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
        13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
    ];
    var odd = [
        1, 0, 5, 7, 9, 13, 15, 17, 19, 21, 1, 0, 5, 7, 9, 13, 15, 17, 19, 21, 2,
        4, 18, 20, 11, 3, 6, 8, 12, 14, 16, 10, 22, 25, 24, 23,
    ];
    var cont = 0;
    // Calculate the sum using even and odd arrays based on character indexes
    Array.from(partialCdf).forEach(function (char, i) {
        var index = characters.indexOf(partialCdf.charAt(i));
        if (index !== -1) {
            cont += i % 2 === 0 ? odd[index] : even[index];
        }
    });
    // Calculate control character index and return it from the characters string
    var controlIndex = ((cont % 26) + 10) % 36;
    return characters.charAt(controlIndex);
};
exports.extractControlCode = extractControlCode;
/**
 * Check if the last name is valid according to specific rules.
 * @param lastName - The last name to validate.
 * @returns True if the last name is valid, otherwise false.
 */
var isLastNameValid = function (lastName) {
    if (!lastName)
        throw new Errors_1.InvalidInputError('Last name is required.');
    // Regular expression patterns
    var atLeastVowelPattern = /^(?=.*[aeiouAEIOU])/;
    var atLeastConsonantPattern = /^(?=.*[^aeiouAEIOU])/;
    var maxCharsPattern = /^[A-Za-z\s]{2,40}$/;
    // Test against the regular expression patterns
    var hasAtLeastVowel = atLeastVowelPattern.test(lastName);
    var hasAtLeastConsonant = atLeastConsonantPattern.test(lastName);
    var hasValidLength = maxCharsPattern.test(lastName);
    var isNotEmpty = lastName.trim() !== '';
    // Check if the last name is valid based on the rules
    if (hasAtLeastVowel || hasAtLeastConsonant || !hasValidLength || !isNotEmpty) {
        return false;
    }
    return true;
};
exports.isLastNameValid = isLastNameValid;
/**
 * Check if the first name is valid according to specific rules.
 * @param firstName - The first name to validate.
 * @returns True if the first name is valid, otherwise false.
 */
var isFirstNameValid = function (firstName) {
    if (!firstName)
        throw new Errors_1.InvalidInputError('First name is required.');
    // Regular expression patterns
    var atLeastVowelPattern = /^(?=.*[aeiouAEIOU])/;
    var atLeastConsonantPattern = /^(?=.*[^aeiouAEIOU])/;
    var maxCharsPattern = /^[A-Za-z\s]{2,40}$/;
    // Test against the regular expression patterns
    var hasAtLeastVowel = atLeastVowelPattern.test(firstName);
    var hasAtLeastConsonant = atLeastConsonantPattern.test(firstName);
    var hasValidLength = maxCharsPattern.test(firstName);
    var isNotEmpty = firstName.trim() !== '';
    // Check if the first name is valid based on the rules
    if (hasAtLeastVowel || hasAtLeastConsonant || !hasValidLength || !isNotEmpty) {
        return false;
    }
    return true;
};
exports.isFirstNameValid = isFirstNameValid;
// CODICE FISCALE REVERSE
/**
 * Extract data from a codice fiscale and return a Person object.
 * @param codiceFiscale - The codice fiscale to reverse.
 * @returns A Person object containing extracted data.
 */
var reverseCodiceFiscale = function (codiceFiscale) {
    if (!codiceFiscale || codiceFiscale.length !== 16) {
        throw new Errors_1.InvalidInputError("Invalid codice fiscale.");
    }
    return {
        // Extract and reverse the first name
        firstName: (0, exports.reverseExtractFirstName)(codiceFiscale),
        // Extract and reverse the last name
        lastName: (0, exports.reverseExtractLastName)(codiceFiscale),
        // Extract and reverse the birthday in DD/MM/YYYY format
        birthday: "".concat((0, exports.reverseExtractDayOfBirth)(codiceFiscale), "/").concat((0, exports.reverseExtractMonthOfBirth)(codiceFiscale), "/").concat((0, exports.reverseExtractYearOfBirth)(codiceFiscale)),
        // Extract and reverse the gender
        gender: (0, exports.reverseExtractGender)(codiceFiscale),
        // Extract and reverse the birthplace
        birthplace: (0, exports.reverseExtractBirthplace)(codiceFiscale),
        // Extract and reverse the birthplace initials
        birthplaceInitials: (0, exports.reverseExtractBirthplaceInitials)(codiceFiscale),
    };
};
exports.reverseCodiceFiscale = reverseCodiceFiscale;
/**
 * Extract the last name from the codice fiscale.
 * @param codiceFiscale - The codice fiscale from which to extract the last name.
 * @Example: 'RSSMRA99B11F205I'
 * @returns The extracted last name. 'RSS'
 */
var reverseExtractLastName = function (codiceFiscale) {
    if (!codiceFiscale || codiceFiscale.length !== 16) {
        throw new Errors_1.InvalidInputError("Invalid codice fiscale.");
    }
    // Extract the first 3 characters from the codice fiscale
    return codiceFiscale.slice(0, 3);
};
exports.reverseExtractLastName = reverseExtractLastName;
/**
 * Extract the first name from the codice fiscale.
 * @param codiceFiscale
 * @Example: 'RSSMRA99B11F205I'
 * @returns 'MRA'
 */
var reverseExtractFirstName = function (codiceFiscale) {
    if (!codiceFiscale || codiceFiscale.length !== 16)
        throw new Errors_1.InvalidInputError("Invalid codice fiscale.");
    return codiceFiscale.slice(3, 6);
};
exports.reverseExtractFirstName = reverseExtractFirstName;
/**
 * Extract the month of birthday from the codice fiscale.
 * @param codiceFiscale - The codice fiscale from which to extract the month of birthday.
 * @returns The extracted month of birthday.
 */
var reverseExtractMonthOfBirth = function (codiceFiscale) {
    if (!codiceFiscale || codiceFiscale.length !== 16) {
        throw new Errors_1.InvalidInputError("Invalid codice fiscale.");
    }
    var reverseMonthMap = new Map();
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
    var month = codiceFiscale.slice(8, 9);
    return reverseMonthMap.get(month);
};
exports.reverseExtractMonthOfBirth = reverseExtractMonthOfBirth;
/**
 * Extract the gender from the codice fiscale.
 * @param codiceFiscale - The codice fiscale from which to extract the gender.
 * @Example: 'RSSMRA99B11F205I'
 * @returns The extracted gender ('M' or 'F').
 */
var reverseExtractGender = function (codiceFiscale) {
    if (!codiceFiscale || codiceFiscale.length !== 16) {
        throw new Errors_1.InvalidInputError("Invalid codice fiscale.");
    }
    var day = Number(codiceFiscale.slice(9, 11));
    if (day > 31)
        return "F";
    return "M";
};
exports.reverseExtractGender = reverseExtractGender;
/**
* Extract the day of birthday from the codice fiscale.
* @param codiceFiscale - The codice fiscale from which to extract the day of birthday.
* @Example: 'RSSMRA99B11F205I'
* @returns The extracted day of birthday.
*/
var reverseExtractDayOfBirth = function (codiceFiscale) {
    if (!codiceFiscale || codiceFiscale.length !== 16) {
        throw new Errors_1.InvalidInputError("Invalid codice fiscale.");
    }
    // Extract characters from index 9 to 11 (exclusive) from the codice fiscale
    var day = Number(codiceFiscale.slice(9, 11));
    // Check if day is greater than 31 and adjust it accordingly
    if (day > 31) {
        return (day - 40).toString();
    }
    return day.toString();
};
exports.reverseExtractDayOfBirth = reverseExtractDayOfBirth;
/**
* Extract the year of birthday from the codice fiscale.
* @param codiceFiscale - The codice fiscale from which to extract the year of birthday.
* @Example: 'RSSMRA99B11F205I'
* @returns The extracted year of birthday.
*/
var reverseExtractYearOfBirth = function (codiceFiscale) {
    if (!codiceFiscale || codiceFiscale.length !== 16) {
        throw new Errors_1.InvalidInputError("Invalid codice fiscale.");
    }
    // Extract characters from index 6 to 8 (exclusive) from the codice fiscale
    var year = codiceFiscale.slice(6, 8);
    // Check if the extracted year is greater than the current year and adjust it
    if (Number(year) > Number(new Date().getFullYear().toString().slice(-2))) {
        return "19".concat(year);
    }
    return "20".concat(year);
};
exports.reverseExtractYearOfBirth = reverseExtractYearOfBirth;
/**
* Extract the birth place from the codice fiscale.
* @param codiceFiscale - The codice fiscale from which to extract the birth place.
* @Example: 'RSSMRA99B11F205I'
* @returns The extracted birth place.
*/
var reverseExtractBirthplace = function (codiceFiscale) {
    if (!codiceFiscale || codiceFiscale.length !== 16) {
        throw new Errors_1.InvalidInputError("Invalid codice fiscale.");
    }
    // Extract characters from index 11 to 15 (exclusive) from the codice fiscale
    var fisco = codiceFiscale.slice(11, 15);
    var cod_comune = "";
    // Iterate through the provinces data to find the matching birth place
    Object.values((0, CommonUtils_1.getProvinces)()).forEach(function (sottostruttura) {
        Object.values(sottostruttura).forEach(function (province) {
            var comune = province.find(function (el) { return el.cod_fisco === fisco; });
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
exports.reverseExtractBirthplace = reverseExtractBirthplace;
/**
* Extract the birth place's initials from the codice fiscale.
* @param codiceFiscale - The codice fiscale from which to extract the birth place's initials.
* @Example: 'RSSMRA99B11F205I'
* @returns The extracted birth place's initials.
*/
var reverseExtractBirthplaceInitials = function (codiceFiscale) {
    if (!codiceFiscale || codiceFiscale.length !== 16) {
        throw new Errors_1.InvalidInputError("Invalid codice fiscale.");
    }
    // Extract characters from index 11 to 15 (exclusive) from the codice fiscale
    var fisco = codiceFiscale.slice(11, 15);
    var cod_comune = "";
    // Iterate through the provinces data to find the matching birth place
    Object.values((0, CommonUtils_1.getProvinces)()).forEach(function (sottostruttura) {
        Object.values(sottostruttura).forEach(function (province) {
            var comune = province.find(function (el) { return el.cod_fisco === fisco; });
            if (comune) {
                cod_comune = comune.provincia;
            }
        });
    });
    if (cod_comune) {
        return cod_comune;
    }
    return "";
};
exports.reverseExtractBirthplaceInitials = reverseExtractBirthplaceInitials;
