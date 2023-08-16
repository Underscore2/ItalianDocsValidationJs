export type ProvincesList = Record<string, Record<string, Province[]>>
export type EsteroList=Estero[];
export interface Province {
  comune: string;
  regione: string;
  provincia: string;
  cod_fisco: string;
}

export interface Estero{
  name:string,
  code_at:string
}

export interface Person {
  firstName: string;
  lastName: string;
  birthday: Date | string;
  gender: string;
  birthplace: string;
  birthplaceInitials?: string;
}

