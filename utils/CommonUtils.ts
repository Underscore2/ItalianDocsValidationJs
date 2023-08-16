import { ProvincesList } from "../interfaces/CodiceFiscale.interface";
const PROVINCE: ProvincesList = require("./province.json");
/** 
 * Extract the province's data from the library, categorized from alphabetical order by the first char of the province
 * and, in the second level, by the second.
 * 
 * @returns  ProvinceList object
 */
   export const getProvinces = (): ProvincesList => {
    return PROVINCE;
  }

  