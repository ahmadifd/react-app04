import { useEffect, useState } from "react";
import { useGetDataGridUsersMutation } from "./usersApiSlice";
import { User } from "../../models/User";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";

const UsersList = () => {
  const [GetDataGridUsers, { isLoading, isSuccess, isError, error }] =
    useGetDataGridUsersMutation();

  const [datarows, setDatarows] = useState<User[]>([]);
  const [next, setNext] = useState<number>();
  const [totalcount, setTotalcount] = useState<number>();

  useEffect(() => {
    const fetchData = async () => {
      const result = await GetDataGridUsers({
        pagenumber: 1,
        filter: "",
        sort: "",
        quichsearch: "",
      });
      const response = result as {
        data: {
          data: {
            totalCount: number;
            next: number;
            users: User[];
          };
        };
      };
      console.log(response.data.data);
      setDatarows(response.data.data.users);
    };

    fetchData();
  }, []);

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 100,
    },
    {
      field: "_id",
      headerName: "_ID",
      width: 100,
      sortable: false,
      filterable: false,
    },
    {
      field: "firstname",
      headerName: "FirstName",
      width: 100,
    },
    {
      field: "lastname",
      headerName: "LastName",
      width: 100,
    },
    {
      field: "email",
      headerName: "Email",
      width: 100,
      sortable: false,
    },
    {
      field: "username",
      headerName: "Username",
      width: 100,
    },
    {
      field: "roles",
      headerName: "Roles",
      width: 100,
      sortable: false,
    },
    {
      field: "active",
      headerName: "Active",
      width: 100,
    },
  ];

  let content;
  if (isError) {
    content = (
      <div className="container">
        <div className="alert alert-danger">
          {`${(error as { data: { message: string } })?.data?.message} - `}
        </div>
      </div>
    );
  } else if (isSuccess) {
    content = (
      <div>
        <>
          <DataGrid
            rows={datarows}
            columns={columns}
            // pageSizeOptions={[PAGE_SIZE]}
            // rowCount={rowCountState}
            // paginationMode="server"
            // onPaginationModelChange={handlePaginationModelChange}
            // slots={{
            //   pagination: CustomPagination,
            //   toolbar: EditToolbar,
            // }}
            // slotProps={{
            //   toolbar: {
            //     quicksearch,
            //     setQuickSearch,
            //     showQuickFilter: true,
            //   },
            // }}
            // checkboxSelection
            // paginationModel={paginationModel}
            loading={isLoading}
            // filterMode="server"
            // onFilterModelChange={onFilterChange}
            // sortingMode="server"
            // onSortModelChange={handleSortModelChange}
            // onRowSelectionModelChange={(
            //   newRowSelectionModel: GridRowSelectionModel
            // ) => {
            //   console.log(newRowSelectionModel);
            //   setRowSelectionModel(newRowSelectionModel);
            // }}
            // rowSelectionModel={rowSelectionModel}
            // keepNonExistentRowsSelected
            // disableRowSelectionOnClick
          />
        </>
      </div>
    );
  }

  return content;
};

export default UsersList;
