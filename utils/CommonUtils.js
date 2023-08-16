"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeAccentsAndSpaces = exports.getEstero = exports.getProvinces = void 0;
var Errors_1 = require("./Errors");
var PROVINCE = require("./province.json");
var ESTERO = require("./estero.json");
/**
 * Extract the province's data from the library, categorized from alphabetical order by the first char of the province
 * and, in the second level, by the second.
 *
 * @returns  ProvinceList object
 */
var getProvinces = function () {
    return PROVINCE;
};
exports.getProvinces = getProvinces;
/**
 * Extract the estero's data from the library
 *
 * @returns  EsteroList array
 */
var getEstero = function () {
    return ESTERO;
};
exports.getEstero = getEstero;
var removeAccentsAndSpaces = function (input) {
    if (!input) {
        throw new Errors_1.InvalidInputError('Invalid input');
    }
    var accentsMap = {
        À: "A", Á: "A", Â: "A", Ã: "A", Ä: "A", Å: "A",
        à: "a", á: "a", â: "a", ã: "a", ä: "a", å: "a",
        È: "E", É: "E", Ê: "E", Ë: "E",
        è: "e", é: "e", ê: "e", ë: "e",
        Ì: "I", Í: "I", Î: "I", Ï: "I",
        ì: "i", í: "i", î: "i", ï: "i",
        Ò: "O", Ó: "O", Ô: "O", Õ: "O", Ö: "O", Ø: "O",
        ò: "o", ó: "o", ô: "o", õ: "o", ö: "o", ø: "o",
        Ù: "U", Ú: "U", Û: "U", Ü: "U",
        ù: "u", ú: "u", û: "u", ü: "u",
        Ñ: "N",
        ñ: "n",
        Ç: "C",
        ç: "c",
    };
    return input
        .split("")
        .map(function (char) { return (accentsMap[char] !== undefined ? accentsMap[char] : char); })
        .filter(function (char) { return char !== " " && char !== "'"; })
        .join("");
};
exports.removeAccentsAndSpaces = removeAccentsAndSpaces;
