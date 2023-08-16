import { EsteroList, ProvincesList } from "../interfaces/CodiceFiscale.interface";
import { InvalidInputError } from "./Errors";
const PROVINCE: ProvincesList = require("./province.json");
const ESTERO:EsteroList=require("./estero.json");
/** 
 * Extract the province's data from the library, categorized from alphabetical order by the first char of the province
 * and, in the second level, by the second.
 * 
 * @returns  ProvinceList object
 */
   export const getProvinces = (): ProvincesList => {
    return PROVINCE;
  }
/** 
 * Extract the estero's data from the library
 * 
 * @returns  EsteroList array
 */
  export const getEstero=():EsteroList=>{
    return ESTERO
  }

 export const removeAccentsAndSpaces = (input:string) => {
    if (!input) {
      throw new InvalidInputError('Invalid input')
    }
  
    const accentsMap = {
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
    .map((char) => (accentsMap[char] !== undefined ? accentsMap[char] : char))
    .filter((char) => char !== " " && char !== "'")
    .join("");
};
  