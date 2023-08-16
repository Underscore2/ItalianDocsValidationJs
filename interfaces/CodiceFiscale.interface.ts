export type ProvincesList = Record<string, Record<string, Province[]>>

export interface Province {
  comune: string;
  regione: string;
  provincia: string;
  cod_fisco: string;
}

export interface Person {
  firstName: string;
  lastName: string;
  birthday: Date | string;
  gender: string;
  birthplace: string;
  birthplaceInitials: string;
}

