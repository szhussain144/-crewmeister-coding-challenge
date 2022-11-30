import { useEffect, useState } from "react";
import { ApiService } from "../utils/api-service";
import {
  DataGrid,
  GridApi,
  GridCellValue,
  GridColDef,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { RequestDTO, SearchDTO } from "../models/Absence";
import { Theme } from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
import DialogBox from "../common/dialog-box";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: "rgba(255,255,255,0.8)",
      padding: 10,
      borderRadius: 15,
      boxShadow: "2px 2px 5px 0 rgb(0 0 0 / 30%)",
      margin: "4% 10%",
    },
    header: {
      width: "100%",
      height: 50,
      borderRadius: 4,
      background: "rgba(237,234,235,0.85)",
    },
    textInput: {
      width: 200,
      fontSize: 16,
      margin: "10px 10px 0px 10px",
      padding: 5,
      background: "rgba(237,234,235,0)",
      border: "none",
      borderBottom: "1px solid",
    },
    selectBox: {
      width: 200,
      fontSize: 16,
      margin: "10px 10px 0px 10px",
      padding: 5,
      background: "rgba(237,234,235,0)",
      border: "none",
      borderBottom: "1px solid",
    },
    submitButton: {
      width: 100,
      fontSize: 16,
      padding: 5,
      margin: "10px 10px 0px 10px",
      color: "#fff",
      background: "rgba(255,148,25,0.85)",
      border: "none",
      borderRadius: 4,
      boxShadow: "2px 2px 5px 0 rgb(0 0 0 / 30%)",
      cursor: "pointer",
    },
    approve: {
      background: "rgb(102, 187, 106)",
      fontSize: 14,
      margin: "0px 10px 0px 10px",
    },
    reject: {
      background: "rgb(244, 67, 54)",
      fontSize: 14,
      margin: "0px 10px 0px 10px",
    },
  })
);
const Absence = () => {
  let searchBy: string;
  let searchValue: string;
  let startDate: string;
  let endDate: string;
  let currentID: number;
  let status: boolean;
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [searchQuery, setSearchQuery] = useState<SearchDTO>();
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    getData(page, pageSize, searchQuery);
  }, [page, pageSize, searchQuery]);

  function getData(page: number, pageSize?: number, searchQuery?: SearchDTO) {
    setLoading(true);
    let res = ApiService.getAbsenceList(page, pageSize, searchQuery);
    res
      .then((response) => {
        response
          .json()
          .then((result) => {
            setTotalRows(result.payload.totalElements);
            setRows(result.payload.content);
            setLoading(false);
          })
          .catch((reason) => {
            setLoading(false);
            console.log(reason);
          });
      })
      .catch((reason) => {
        setLoading(false);
        console.log(reason);
      });
  }
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Member Name",
      width: 180,
      disableColumnMenu: true,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.user.name || ""}`,
    },
    {
      field: "type",
      headerName: "Type Of Absence",
      width: 150,
      disableColumnMenu: true,
    },
    {
      field: "period",
      headerName: "Period",
      width: 100,
      disableColumnMenu: true,
      valueGetter: (params: GridValueGetterParams) => getDate(params),
    },
    {
      field: "memberNote",
      headerName: "Member Note",
      width: 150,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (params: GridValueGetterParams) => getStatus(params),
    },
    {
      field: "admitterNote",
      headerName: "Admitter Note",
      width: 150,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        currentID = params.row.id;
        const doAction = (e: any,status:boolean):void => {
          e.stopPropagation(); // don't select this row after clicking
          status = status;
          setShow(true);
        };
        return (
          <>
            <button
              onClick={e=>doAction(e,true)}
              className={classes.submitButton + " " + classes.approve}
            >
              Approve
            </button>
            <button
              onClick={e=>doAction(e,false)}
              className={classes.submitButton + " " + classes.reject}
            >
              Reject
            </button>
          </>
        );
      },
    },
  ];
  function getConfirmation(confirmation: boolean,note:string): void {
    setShow(false);
    if(confirmation){
    var request: RequestDTO = {
      admitterNote: note,
      accepted: status,
    };
      ApiService.updateAbsence(currentID, request).then((response) => {
        response.json().then((result) => {
          if (result.status) {
            console.log(result);
          }
        }).catch(reason=>{
          console.log(reason);
        });
      }).catch(reason=>{
        console.log(reason);
      });
    }
    
  }
  function getDate(params: GridValueGetterParams) {
    if (params.row.endDate && params.row.startDate) {
      let endDate = new Date(params.row.endDate).getTime();
      let startDate = new Date(params.row.startDate).getTime();
      let days = (endDate - startDate) / (1000 * 3600 * 24);
      if (days === 0) {
        return 1;
      } else {
        return days;
      }
    } else {
      return "-";
    }
  }
  function getStatus(params: GridValueGetterParams) {
    if (params.row.confirmationDate) {
      return "Confirmed";
    } else if (params.row.rejectedAt) {
      return "Rejected";
    } else {
      return "Requested";
    }
  }
  const onSubmit = (event: any) => {
    event.preventDefault();
    setSearchQuery({
      searchBy: searchBy ?? null,
      searchValue: searchValue ?? null,
      startDate: startDate ?? null,
      endDate: endDate ?? null,
    });
  };
  return (
    <div className={classes.root}>
      <div data-testid="absence-test-1">
        <h2>Absencec List</h2>
      </div>
      <div className={classes.header}>
        <form onSubmit={onSubmit}>
          <input
            className={classes.textInput}
            type="text"
            onChange={(e) => (searchValue = e.target.value)}
            required
          />
          <select
            className={classes.selectBox}
            onChange={(e) => (searchBy = e.target.value)}
          >
            <option value="">Search By</option>
            <option value="type">Type</option>
            <option value="crewId">Crew ID</option>
            <option value="admitterId">Admitter ID</option>
          </select>
          <input
            className={classes.textInput}
            type="date"
            onChange={(e) => (startDate = e.target.value)}
          />
          <input
            className={classes.textInput}
            type="date"
            onChange={(e) => (endDate = e.target.value)}
          />
          <input
            className={classes.submitButton}
            type="submit"
            value="Search"
          />
        </form>
      </div>
      <div style={{ height: 400 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          rowCount={totalRows}
          pageSize={pageSize}
          rowsPerPageOptions={[5, 10, 20]}
          initialState={{
            pagination: {
              page: 0,
              pageSize: 10,
            },
          }}
          onPageChange={(page) => setPage(page)}
          onPageSizeChange={(size) => setPageSize(size)}
          paginationMode={"server"}
        />
      </div>
      {show ? <DialogBox props={show} getConfirmation={getConfirmation} /> : ""}
    </div>
  );
};
export default Absence;
