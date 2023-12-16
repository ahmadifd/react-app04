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
} from "@mui/x-data-grid";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  gridFilteredTopLevelRowCountSelector,
  gridPageSizeSelector,
  useGridApiContext,
  useGridSelector,
  useGridRootProps,
} from "@mui/x-data-grid";
import MuiPagination from "@mui/material/Pagination";
import { TablePaginationProps } from "@mui/material/TablePagination";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import Box from "@mui/material/Box";
//////////////////////////////////////////////////////////////////
interface UserType {
  id: number;
  _id: number;
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  roles: string[];
  active: boolean;
}

interface PageInfo {
  totalRowCount?: number;
  nextCursor?: number;
  pageSize?: number;
}

type Row = (typeof UsersData)[number];
const UsersData: UserType[] = [
  {
    id: 1,
    _id: 1,
    firstname: "farshid",
    lastname: "1",
    email: "1@gmail.com",
    username: "1",
    roles: ["User", "Admin"],
    active: true,
  },
  {
    id: 2,
    _id: 2,
    firstname: "farshad",
    lastname: "2",
    email: "2@gmail.com",
    username: "2",
    roles: ["User"],
    active: true,
  },
  {
    id: 3,
    _id: 3,
    firstname: "reza",
    lastname: "3",
    email: "3@gmail.com",
    username: "3",
    roles: ["User"],
    active: true,
  },
  {
    id: 4,
    _id: 4,
    firstname: "mahshid",
    lastname: "4",
    email: "4@gmail.com",
    username: "4",
    roles: ["User"],
    active: false,
  },
  {
    id: 5,
    _id: 5,
    firstname: "5",
    lastname: "5",
    email: "5@gmail.com",
    username: "5",
    roles: ["User"],
    active: true,
  },
  {
    id: 6,
    _id: 6,
    firstname: "6",
    lastname: "6",
    email: "6@gmail.com",
    username: "6",
    roles: ["User"],
    active: true,
  },
  {
    id: 7,
    _id: 7,
    firstname: "7",
    lastname: "7",
    email: "7@gmail.com",
    username: "7",
    roles: ["User"],
    active: false,
  },
  {
    id: 8,
    _id: 8,
    firstname: "8",
    lastname: "8",
    email: "8@gmail.com",
    username: "8",
    roles: ["User"],
    active: true,
  },
  {
    id: 9,
    _id: 9,
    firstname: "9",
    lastname: "9",
    email: "9@gmail.com",
    username: "9",
    roles: ["User"],
    active: false,
  },
  {
    id: 10,
    _id: 10,
    firstname: "10",
    lastname: "10",
    email: "10@gmail.com",
    username: "10",
    roles: ["User"],
    active: true,
  },

  {
    id: 11,
    _id: 11,
    firstname: "11",
    lastname: "11",
    email: "11@gmail.com",
    username: "11",
    roles: ["User", "Manager"],
    active: false,
  },
];

enum FilterType {
  contains = "contains",
  equals = "equals",
  startsWith = "startsWith",
  endsWith = "endsWith",
  isEmpty = "isEmpty",
  isNotEmpty = "isNotEmpty",
  isAnyOf = "isAnyOf",
}

interface FilterKeyValue {
  key: keyof UserType;
  value: any;
  filterType: FilterType;
}

interface KeyValue {
  key: keyof UserType;
  value: string;
}

///////////////////////////////////////////////////////////////////

const useUsersApi = (pagesize: number) => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [next, setNext] = useState<number>();
  const [totalcount, setTotalCount] = useState<number>();

  function fetchUsers(
    pagenumber: number,
    filter?: FilterKeyValue,
    sort?: KeyValue,
    quicksearch?: string
  ) {
    setisLoading(true);
    let filterUsersData = UsersData.slice();

    //filter
    if (filter) {
      switch (filter.filterType) {
        case FilterType.contains:
          {
            filterUsersData = filterUsersData.filter((x) => {
              console.log(
                x[filter.key],
                x[filter.key].toString().includes(filter?.value)
              );
              return x[filter.key].toString().includes(filter?.value);
            });
          }
          break;
        case FilterType.equals:
          filterUsersData = filterUsersData.filter(
            (x) => x[filter.key].toString() === filter?.value
          );
          break;
        case FilterType.startsWith:
          filterUsersData = filterUsersData.filter((x) =>
            x[filter.key].toString().startsWith(filter?.value)
          );
          break;
        case FilterType.endsWith:
          filterUsersData = filterUsersData.filter((x) =>
            x[filter.key].toString().endsWith(filter?.value)
          );
          break;
        case FilterType.isEmpty:
          filterUsersData = filterUsersData.filter(
            (x) => x[filter.key].toString().trim() === ""
          );
          break;
        case FilterType.isNotEmpty:
          filterUsersData = filterUsersData.filter(
            (x) => x[filter.key].toString().trim() !== ""
          );
          break;
        case FilterType.isAnyOf:
          filterUsersData = filterUsersData.filter((x) =>
            filter?.value.includes(x[filter.key].toString())
          );
      }
    }
    //sort
    if (sort) {
      //number
      if (sort.key === "id") {
        if (sort.value == "asc")
          filterUsersData = filterUsersData.sort((x, y) => x.id - y.id);
        else if (sort.value == "desc")
          filterUsersData = filterUsersData.sort((x, y) => y.id - x.id);
      }
      //boolean
      else if (sort.key === "active") {
        if (sort.value == "asc")
          filterUsersData = filterUsersData.sort(
            (x, y) => (x.active ? 1 : 0) - (y.active ? 1 : 0)
          );
        else if (sort.value == "desc")
          filterUsersData = filterUsersData.sort(
            (x, y) => (y.active ? 1 : 0) - (x.active ? 1 : 0)
          );
      }
      //string
      else if (
        ["firstname", "lastname", "username", "email"].includes(sort.key)
      ) {
        if (sort.value == "asc") {
          filterUsersData = filterUsersData.sort((x, y) =>
            x[sort.key].toString().localeCompare(y[sort.key].toString())
          );
        } else if (sort.value == "desc") {
          filterUsersData = filterUsersData.sort((x, y) =>
            y[sort.key].toString().localeCompare(x[sort.key].toString())
          );
        }
      }
    }
    //quicksearch
    if (quicksearch) {
      filterUsersData = filterUsersData.filter(
        (x) =>
          x.firstname.includes(quicksearch) ||
          x.lastname.includes(quicksearch) ||
          x.username.includes(quicksearch) ||
          x.email.includes(quicksearch)
      );
    }

    console.log(
      "pagenumber",
      pagenumber,
      "\n",
      "filter",
      filter,
      "\n",
      "sort",
      sort,
      "\n",
      "quicksearch",
      quicksearch
    );

    setTimeout(() => {
      const fromindex = pagenumber * pagesize;
      if (filterUsersData.length >= fromindex + pagesize) {
        const result = filterUsersData.slice(fromindex, fromindex + pagesize);
        setUsers(result);

        const nextCursor = filterUsersData[fromindex + pagesize];
        if (nextCursor) {
          setNext(nextCursor.id);
        }
      } else {
        const endindex = filterUsersData.length;
        const result = filterUsersData.slice(fromindex, endindex);
        setUsers(result);
      }
      setTotalCount(filterUsersData.length);
      setisLoading(false);
    }, 100);
  }
  return { datarows: users, next, totalcount, fetchUsers, isLoading };
};

///////////////////////////////////////////////////////////////////

function CustomPagination(props: any) {
  return <GridPagination ActionsComponent={Pagination} {...props} />;
}

const getPageCount = (rowCount: number, pageSize: number): number => {
  if (pageSize > 0 && rowCount > 0) {
    return Math.ceil(rowCount / pageSize);
  }

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
}

const EditToolbar = (props: EditToolbarProps) => {
  const { setQuickSearch, quicksearch } = props;
  const handleClick = () => {
    console.log("Add record");
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

///////////////////////////////////////////////////////////////////

const UserDataGrid = () => {
  const PAGE_SIZE = 5;
  const columns: GridColDef<Row>[] = [
    {
      field: "id",
      headerName: "ID",
      width: 100,
      renderCell: RenderClick,
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
    {
      field: "actions",
      type: "actions",
      width: 80,
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
  const mapPageToNextCursor = useRef<{ [page: number]: GridRowId }>({});

  const { datarows, next, totalcount, fetchUsers, isLoading } =
    useUsersApi(PAGE_SIZE);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  });
  const [quicksearch, setQuickSearch] = useState<string | undefined>(undefined);
  const [filter, setFilter] = useState<FilterKeyValue | undefined>(undefined);
  const [sort, setSort] = useState<KeyValue | undefined>(undefined);
  const [pageInfo, setpageInfo] = useState<PageInfo>({});
  const [rowCountState, setRowCountState] = useState(
    pageInfo?.totalRowCount || 0
  );
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);

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
    const { hasFocus, value } = props;
    return (
      <>
        {value}
        <Button
          onClick={() => {
            console.log("clickUser", value);
          }}
        >
          Click
        </Button>
      </>
    );
  }

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
    fetchUsers(paginationModel.page, filter, sort, quicksearch);
  }, [quicksearch, filter, sort, paginationModel.page]);

  const handlePaginationModelChange = (
    newPaginationModel: GridPaginationModel
  ) => {
    setPaginationModel(newPaginationModel);
    //fetchUsers(newPaginationModel.page, filter, sort, quicksearch);
  };

  const onFilterChange = (filterModel: GridFilterModel) => {
    if (filterModel.items && filterModel.items.length > 0) {
      if (
        filterModel.items[0].value != undefined &&
        filterModel.items[0].value != ""
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

  return (
    <>
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
          console.log(newRowSelectionModel);
          setRowSelectionModel(newRowSelectionModel);
        }}
        rowSelectionModel={rowSelectionModel}
        keepNonExistentRowsSelected
        disableRowSelectionOnClick
      />
    </>
  );
};

export default UserDataGrid;

// const userType: UserType = {
//   id: 0,
//   _id: 0,
//   firstname: "",
//   lastname: "",
//   username: "",
//   roles: [],
//   active: false,
//   email: "",
// };

// console.log('Object.keys');
// Object.keys(userType).forEach((key) => {
//   //if (typeof key === "number" && sort.key === key) {
//     console.log(typeof key);
//   //}
// });
// console.log(keys);
// const userType: UserType = {id:1,_id:1};
// const headers = Object.keys(userType).map((key) => {
//   return { text: key, value: key };
// });
