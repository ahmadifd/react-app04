import { useCallback, useEffect, useRef, useState } from "react";
import { useGetDataGridUsersMutation } from "./usersApiSlice";
import { User } from "../../models/User";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridFilterModel,
  GridPagination,
  GridPaginationModel,
  GridRenderCellParams,
  GridRowId,
  GridRowModesModel,
  GridRowSelectionModel,
  GridRowsProp,
  GridSortModel,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  gridFilteredTopLevelRowCountSelector,
  gridPageSizeSelector,
  useGridApiContext,
  useGridRootProps,
  useGridSelector,
} from "@mui/x-data-grid";
import MuiPagination from "@mui/material/Pagination";
import { Box, Button, TablePaginationProps } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import UserDialog from "./UserDialog";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

interface FilterKeyValue {
  key: keyof UserType;
  value: any;
  filterType: FilterType;
}
interface UserType {
  rownumber: number;
  id: string;
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  roles: string[];
  active: boolean;
}

enum FilterType {
  contains = "contains",
  equals = "equals",
  startsWith = "startsWith",
  endsWith = "endsWith",
  isEmpty = "isEmpty",
  isNotEmpty = "isNotEmpty",
  isAnyOf = "isAnyOf",
  is = "is",
  eq = "=",
  ne = "!=",
  gt = ">",
  gte = ">=",
  lt = "<",
  lte = "<=",
}
interface KeyValue {
  key: keyof UserType;
  value: string;
}

interface PageInfo {
  totalRowCount?: number;
  nextCursor?: number;
  pageSize?: number;
}

function CustomPagination(props: any) {
  return <GridPagination ActionsComponent={Pagination} {...props} />;
}

const getPageCount = (rowCount: number, pageSize: number): number => {
  if (pageSize > 0 && rowCount > 0) return Math.ceil(rowCount / pageSize);
  return 0;
};

function Pagination({
  page,
  onPageChange,
  className,
}: Pick<TablePaginationProps, "page" | "onPageChange" | "className">) {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();

  const pageSize = useGridSelector(apiRef, gridPageSizeSelector);
  const visibleTopLevelRowCount = useGridSelector(
    apiRef,
    gridFilteredTopLevelRowCountSelector
  );
  const pageCount = getPageCount(
    rootProps.rowCount ?? visibleTopLevelRowCount,
    pageSize
  );

  return (
    <MuiPagination
      color="primary"
      className={className}
      count={pageCount}
      page={page + 1}
      onChange={(event, newPage) => {
        onPageChange(event as any, newPage - 1);
      }}
    />
  );
}

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
  setQuickSearch: React.Dispatch<React.SetStateAction<string | undefined>>;
  quicksearch: string;
  setShowUserDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditToolbar = (props: EditToolbarProps) => {
  const { setQuickSearch, quicksearch, setShowUserDialog } = props;
  const handleClick = () => {
    console.log("Add record");
    setShowUserDialog(true);
  };

  return (
    <Box
      sx={{
        p: 0.5,
        pb: 0,
      }}
    >
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
          Add record
        </Button>
      </GridToolbarContainer>
      <GridToolbarQuickFilter
        quickFilterParser={(searchInput: string) => {
          if (!searchInput || searchInput.trim() === "") {
            if (quicksearch) setQuickSearch(undefined);
          } else {
            setQuickSearch(searchInput.trim());
          }
          return searchInput
            .split(",")
            .map((value) => value.trim())
            .filter((value) => value !== "");
        }}
      />
    </Box>
  );
};

type Row = User[][number];

const UsersList = () => {
  let userDialogTitle = "AddUser";
  const PAGE_SIZE = 5;
  const [quicksearch, setQuickSearch] = useState<string | undefined>(undefined);
  const [filter, setFilter] = useState<FilterKeyValue | undefined>(undefined);
  const [sort, setSort] = useState<KeyValue | undefined>(undefined);
  const [pageInfo, setpageInfo] = useState<PageInfo>({});
  const [rowCountState, setRowCountState] = useState(
    pageInfo?.totalRowCount || 0
  );
  const [datarows, setDatarows] = useState<User[]>([]);
  const [next, setNext] = useState<number>();
  const [totalcount, setTotalcount] = useState<number>();
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  });
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);
  const [showUserDialog, setShowUserDialog] = useState<boolean>(false);

  const mapPageToNextCursor = useRef<{ [page: number]: GridRowId }>({});

  const [GetDataGridUsers, { isLoading, isError, error }] =
    useGetDataGridUsersMutation();

  const fetchData = async () => {
    const result = await GetDataGridUsers({
      pagenumber: paginationModel.page,
      filter: filter,
      sort: sort,
      quicksearch: quicksearch,
      pagesize: paginationModel.pageSize,
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
    console.log(response.data.data.users);
    setDatarows(response.data.data.users);
    setNext(response.data.data.next);
    setTotalcount(response.data.data.totalCount);
  };

  useEffect(() => {
    //fetchData();
  }, []);

  useEffect(() => {
    setpageInfo({
      totalRowCount: totalcount,
      nextCursor: next,
      pageSize: PAGE_SIZE,
    });
  }, [datarows, next, totalcount]);

  useEffect(() => {
    if (pageInfo?.nextCursor) {
      // We add nextCursor when available
      mapPageToNextCursor.current[paginationModel.page] = pageInfo?.nextCursor;
    }
  }, [paginationModel.page, pageInfo?.nextCursor]);

  useEffect(() => {
    setRowCountState((prevRowCountState) =>
      pageInfo?.totalRowCount !== undefined
        ? pageInfo?.totalRowCount
        : prevRowCountState
    );
  }, [pageInfo?.totalRowCount, setRowCountState]);

  useEffect(() => {
    fetchData();
  }, [quicksearch, filter, sort, paginationModel]);

  const columns: GridColDef<Row>[] = [
    {
      field: "rownumber",
      headerName: "RowNumber",
      width: 100,
      type: "number",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "firstname",
      headerName: "FirstName",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "lastname",
      headerName: "LastName",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      sortable: false,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "username",
      headerName: "Username",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "roles",
      headerName: "Roles",
      width: 100,
      sortable: false,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "active",
      headerName: "Active",
      width: 100,
      type: "boolean",
      headerAlign: "center",
      align: "center",
      renderCell: RenderClick,
    },
    // {
    //   field: "id",
      
    //   headerName: "",
    //   filterable: false,
    //   sortable: false,
    //   align: "left",
    //   renderCell: RenderClick,
    // },
    {
      field: "actions",
      type: "actions",
      width: 80,
      headerName: "",
      headerAlign: "center",
      align: "center",
      getActions: (params) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={deleteUser(params.id)}
          // showInMenu
        />,
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={editUser(params.id)}
          // showInMenu
        />,
      ],
    },
  ];

  const deleteUser = useCallback(
    (id: GridRowId) => () => {
      console.log("deleteUser", id);
    },
    []
  );

  const editUser = useCallback(
    (id: GridRowId) => () => {
      console.log("editUser", id);
    },
    []
  );

  function RenderClick(props: GridRenderCellParams<any, Number>) {
    const { row } = props;
    return (
      <>
        {/* {value} */}
        <Button size="large" startIcon={row["active"] && row["active"]===true ? <DoneIcon /> :<CloseIcon/> }
          onClick={() => {
            console.log("clickUser", row["id"]);
          }}
        >
         
        </Button>
      </>
    );
  }

  const handlePaginationModelChange = (
    newPaginationModel: GridPaginationModel
  ) => {
    setPaginationModel(newPaginationModel);
    //fetchUsers(newPaginationModel.page, filter, sort, quicksearch);
  };

  const onFilterChange = (filterModel: GridFilterModel) => {
    if (filterModel.items && filterModel.items.length > 0) {
      if (
        filterModel.items[0].operator === "isEmpty" ||
        filterModel.items[0].operator === "isNotEmpty" ||
        (filterModel.items[0].value != undefined &&
          filterModel.items[0].value != "")
      ) {
        const result: FilterKeyValue = {
          key: filterModel.items[0].field as keyof UserType,
          value: filterModel.items[0].value,
          filterType: filterModel.items[0].operator as FilterType,
        };
        setFilter(result);
        //(paginationModel.page, result, sort, quicksearch);
      } else if (filter) {
        setFilter(undefined);
        //fetchUsers(paginationModel.page, undefined, sort, quicksearch);
      }
    } else if (filter) {
      setFilter(undefined);
      //fetchUsers(paginationModel.page, undefined, sort, quicksearch);
    }
  };

  const handleSortModelChange = (sortModel: GridSortModel) => {
    if (sortModel && sortModel[0]) {
      const result = {
        key: sortModel[0].field as keyof UserType,
        value: sortModel[0].sort!,
      };
      setSort(result);
      //fetchUsers(paginationModel.page, filter, result, quicksearch);
    } else {
      setSort(undefined);
      //fetchUsers(paginationModel.page, filter, undefined, quicksearch);
    }
  };

  let content;
  if (isError) {
    content = (
      <div>
        <div className="alert alert-danger">
          {`${(error as { data: { message: string } })?.data?.message} - `}
        </div>
      </div>
    );
  } else {
    content = (
      <>
        <UserDialog
          userDialogTitle={userDialogTitle}
          setShowUserDialog={setShowUserDialog}
          showUserDialog={showUserDialog}
        />
        <DataGrid
          rows={datarows}
          columns={columns}
          pageSizeOptions={[PAGE_SIZE]}
          rowCount={rowCountState}
          paginationMode="server"
          onPaginationModelChange={handlePaginationModelChange}
          slots={{
            pagination: CustomPagination,
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: {
              quicksearch,
              setQuickSearch,
              setShowUserDialog,
              showQuickFilter: true,
            },
          }}
          checkboxSelection
          paginationModel={paginationModel}
          loading={isLoading}
          filterMode="server"
          onFilterModelChange={onFilterChange}
          sortingMode="server"
          onSortModelChange={handleSortModelChange}
          onRowSelectionModelChange={(
            newRowSelectionModel: GridRowSelectionModel
          ) => {
            setRowSelectionModel(newRowSelectionModel);
          }}
          rowSelectionModel={rowSelectionModel}
          keepNonExistentRowsSelected
          disableRowSelectionOnClick
        />
      </>
    );
  }
  return content;
};

export default UsersList;
