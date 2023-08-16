"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProvinces = void 0;
var PROVINCE = require("./province.json");
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
