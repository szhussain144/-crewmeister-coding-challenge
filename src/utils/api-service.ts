import { apiBaseUrl } from "../constants/constants";
import { RequestDTO, SearchDTO } from "../models/Absence";

  const  getAbsenceList = (page?:number,pageSize?:number,data?: SearchDTO) => {
    return fetch(
      `${apiBaseUrl}absence?page=${page}&size=${pageSize}`,{
        method:'post',
        headers:{
          'Content-Type': 'application/json'
        },
        body:JSON.stringify(data)
    }
    );
  }

  const updateAbsence = (id:number,requestData:RequestDTO) =>{
    return fetch(
      `${apiBaseUrl}absence/${id}`,{
        method:'put',
        headers:{
          'Content-Type': 'application/json'
        },
        body:JSON.stringify(requestData)
    }
    );
  }

  export const ApiService = {
    getAbsenceList,
    updateAbsence
  }