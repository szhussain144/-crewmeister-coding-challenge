export interface SearchDTO {
  searchBy?: string;
  searchValue?: string;
  startDate?: string;
  endDate?: string;
}

export interface RequestDTO {
  admitterNote:string;
  accepted:boolean;
}
