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

import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import AddUser from "./AddUser";
import EditUser from "./EditUser";

interface FilterKeyValue {
  key: keyof UserType;
  value: any;
  filterType: FilterType;
}
interface UserType {
  rowNumber: number;
  id: string;
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
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
  quickSearch: string;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setModalType: React.Dispatch<React.SetStateAction<string>>;
  setEditId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const EditToolbar = (props: EditToolbarProps) => {
  const { setQuickSearch, quickSearch, setShowModal, setModalType } = props;
  const handleClick = () => {
    console.log("Add record");
    setShowModal(true);
    setModalType("AddUser");
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
            if (quickSearch) setQuickSearch(undefined);
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
  const PAGE_SIZE = 5;
  const [quickSearch, setQuickSearch] = useState<string | undefined>(undefined);
  const [filter, setFilter] = useState<FilterKeyValue | undefined>(undefined);
  const [sort, setSort] = useState<KeyValue | undefined>(undefined);

  const [dataRows, setDataRows] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  });
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>("");
  const [editId, setEditId] = useState<string>("");

  const [GetDataGridUsers, { isLoading, isError, error }] =
    useGetDataGridUsersMutation();
  console.log("UsersList", isLoading);

  const fetchData = async () => {
    const result = await GetDataGridUsers({
      pageNumber: paginationModel.page,
      filter: filter,
      sort: sort,
      quickSearch: quickSearch,
      pageSize: paginationModel.pageSize,
    });
    const response = result as {
      data: {
        data: {
          totalCount: number;
          users: User[];
        };
      };
    };

    console.log("data - DataGrid :", response.data.data.users);
    setDataRows(response.data.data.users);
    setTotalCount(response.data.data.totalCount);
  };

  useEffect(() => {
    fetchData();
  }, [quickSearch, filter, sort, paginationModel]);

  const columns: GridColDef<Row>[] = [
    {
      field: "rowNumber",
      headerName: "RowNumber",
      width: 100,
      type: "number",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "firstName",
      headerName: "FirstName",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "lastName",
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
      field: "userName",
      headerName: "UserName",
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
      setShowModal(true);
      setModalType("EditUser");
      setEditId(id.toString());
    },
    []
  );

  function RenderClick(props: GridRenderCellParams<any, Number>) {
    const { row } = props;
    return (
      <>
        {/* {value} */}
        <Button
          size="large"
          startIcon={
            row["active"] && row["active"] === true ? (
              <DoneIcon />
            ) : (
              <CloseIcon />
            )
          }
          onClick={() => {
            console.log("clickUser", row["id"]);
          }}
        ></Button>
      </>
    );
  }

  const handlePaginationModelChange = (
    newPaginationModel: GridPaginationModel
  ) => {
    setPaginationModel(newPaginationModel);
    //fetchUsers(newPaginationModel.page, filter, sort, quickSearch);
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
        //(paginationModel.page, result, sort, quickSearch);
      } else if (filter) {
        setFilter(undefined);
        //fetchUsers(paginationModel.page, undefined, sort, quickSearch);
      }
    } else if (filter) {
      setFilter(undefined);
      //fetchUsers(paginationModel.page, undefined, sort, quickSearch);
    }
  };

  const handleSortModelChange = (sortModel: GridSortModel) => {
    if (sortModel && sortModel[0]) {
      const result = {
        key: sortModel[0].field as keyof UserType,
        value: sortModel[0].sort!,
      };
      setSort(result);
    } else {
      setSort(undefined);
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
        {showModal && modalType === "AddUser" ? (
          <AddUser
            modalType={modalType}
            setShowModal={setShowModal}
            showModal={showModal}
          />
        ) : showModal && modalType === "EditUser" ? (
          <EditUser
            modalType={modalType}
            setShowModal={setShowModal}
            showModal={showModal}
            editId={editId}
          />
        ) : (
          <></>
        )}

        <DataGrid
          rows={dataRows}
          columns={columns}
          pageSizeOptions={[PAGE_SIZE]}
          rowCount={totalCount}
          paginationMode="server"
          onPaginationModelChange={handlePaginationModelChange}
          slots={{
            pagination: CustomPagination,
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: {
              quickSearch,
              setQuickSearch,
              setShowModal,
              setModalType,
              setEditId,
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
