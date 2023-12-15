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
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
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
import { TouchRippleActions } from "@mui/material/ButtonBase/TouchRipple";
import { string } from "yup";

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

const useUsersApi = (pagesize: number) => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [next, setNext] = useState<number>();
  const [totalcount, setTotalCount] = useState<number>();

  useEffect(() => {
    fetchUsers(0);
  }, []);

  function fetchUsers(
    pagenumber: number,
    filter?: FilterKeyValue,
    sort?: KeyValue,
    quicksearch?: string
  ) {
    setisLoading(true);
    let filterUsersData = UsersData.slice();

    if (filter) {
      switch (filter.filterType) {
        case FilterType.contains:
          filterUsersData = UsersData.filter((x) => {
            console.log(x[filter.key]);
            return x[filter.key].toString().includes(filter?.value);
          });
          console.log(filter.value);
          break;
        case FilterType.equals:
          filterUsersData = UsersData.filter(
            (x) => x[filter.key].toString() === filter?.value
          );
          break;
        case FilterType.startsWith:
          filterUsersData = UsersData.filter((x) =>
            x[filter.key].toString().startsWith(filter?.value)
          );
          break;
        case FilterType.endsWith:
          filterUsersData = UsersData.filter((x) =>
            x[filter.key].toString().endsWith(filter?.value)
          );
          break;
        case FilterType.isEmpty:
          filterUsersData = UsersData.filter(
            (x) => x[filter.key].toString().trim() === ""
          );
          break;
        case FilterType.isNotEmpty:
          filterUsersData = UsersData.filter(
            (x) => x[filter.key].toString().trim() !== ""
          );
          break;
        case FilterType.isAnyOf:
          filterUsersData = UsersData.filter((x) =>
            filter?.value.includes(x[filter.key].toString())
          );
      }
    }

    if (sort) {
      if (sort.key === "id") {
        if (sort.value == "asc")
          filterUsersData = filterUsersData.sort((x, y) => x.id - y.id);
        else if (sort.value == "desc")
          filterUsersData = filterUsersData.sort((x, y) => y.id - x.id);
      }
      if (sort.key === "active") {
        if (sort.value == "asc")
          filterUsersData = filterUsersData.sort(
            (x, y) => (x.active ? 1 : 0) - (y.active ? 1 : 0)
          );
        else if (sort.value == "desc")
          filterUsersData = filterUsersData.sort(
            (x, y) => (y.active ? 1 : 0) - (x.active ? 1 : 0)
          );
      }

      if (typeof sort.key === "string") {
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

    if (quicksearch) {
      filterUsersData = UsersData.filter(
        (x) =>
          x.firstname.includes(quicksearch) ||
          x.lastname.includes(quicksearch) ||
          x.username.includes(quicksearch) ||
          x.email.includes(quicksearch)
      );
    }

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
  x:number;
}

function EditToolbar(props: EditToolbarProps) {
  const { x } = props;
  const { setQuickSearch } = useGridStates();
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
          console.log("quickFilter", searchInput, "x", x);
          setQuickSearch(searchInput);

          return searchInput
            .split(",")
            .map((value) => value.trim())
            .filter((value) => value !== "");
        }}
      />
    </Box>
  );
}

const useGridStates = () => {
  const PAGE_SIZE = 5;

  const [pagesize, setPageSize] = useState<number>(PAGE_SIZE);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  });
  const [quicksearch, setQuickSearch] = useState<string | undefined>(undefined);
  const [filter, setFilter] = useState<FilterKeyValue | undefined>(undefined);
  const [sort, setSort] = useState<KeyValue | undefined>(undefined);

  return {
    paginationModel,
    setPaginationModel,
    pagesize,
    quicksearch,
    setQuickSearch,
    filter,
    setFilter,
    sort,
    setSort,
  };
};

const UserDataGrid = () => {
  const {
    paginationModel,
    setPaginationModel,
    quicksearch,
    filter,
    setFilter,
    sort,
    setSort,
  } = useGridStates();
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

  const PAGE_SIZE = 5;

  const { datarows, next, totalcount, fetchUsers, isLoading } =
    useUsersApi(PAGE_SIZE);

  const [pageInfo, setpageInfo] = useState<PageInfo>({});
  const [rowCountState, setRowCountState] = useState(
    pageInfo?.totalRowCount || 0
  );
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);

  const mapPageToNextCursor = useRef<{ [page: number]: GridRowId }>({});

  useEffect(() => {
    setpageInfo({
      totalRowCount: totalcount,
      nextCursor: next,
      pageSize: PAGE_SIZE,
    });
  }, [datarows, next]);

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
    console.log("quicksearch", quicksearch);
    fetchUsers(paginationModel.page, filter, sort, quicksearch);
  }, [quicksearch]);

  const handlePaginationModelChange = (
    newPaginationModel: GridPaginationModel
  ) => {
    setPaginationModel(newPaginationModel);
    console.log(newPaginationModel.page);
    fetchUsers(newPaginationModel.page, filter, sort, quicksearch);
  };

  const onFilterChange = (filterModel: GridFilterModel) => {
    if (filterModel.items && filterModel.items.length > 0) {
      if (
        filterModel.items[0].value != undefined &&
        filterModel.items[0].value != ""
      ) {
        const result = {
          key: filterModel.items[0].field as keyof UserType,
          value: filterModel.items[0].value,
          filterType: filterModel.items[0].operator,
        };
        console.log(result);
        setFilter(result);
        fetchUsers(paginationModel.page, result, sort, quicksearch);
      } else if (filter) {
        setFilter(undefined);
        fetchUsers(paginationModel.page, undefined, sort, quicksearch);
      }
    } else if (filter) {
      setFilter(undefined);
      fetchUsers(paginationModel.page, undefined, sort, quicksearch);
    }
  };

  const handleSortModelChange = (sortModel: GridSortModel) => {
    if (sortModel && sortModel[0]) {
      const result = {
        key: sortModel[0].field as keyof UserType,
        value: sortModel[0].sort!,
      };
      setSort(result);
      fetchUsers(paginationModel.page, filter, result, quicksearch);
    } else {
      setSort(undefined);
      fetchUsers(paginationModel.page, filter, undefined, quicksearch);
    }
  };

  const x = 10;

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
        slotProps={{ toolbar: { showQuickFilter: true } }}
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
          console.log(datarows, newRowSelectionModel);
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
