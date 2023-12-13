import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  GridPaginationModel,
  GridRowId,
  GridSortModel,
} from "@mui/x-data-grid";
import { useEffect, useRef, useState } from "react";

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

const UsersData: UserType[] = [
  {
    id: 1,
    _id: 1,
    firstname: "1",
    lastname: "1",
    email: "1@gmail.com",
    username: "1",
    roles: ["User"],
    active: true,
  },
  {
    id: 2,
    _id: 2,
    firstname: "2",
    lastname: "2",
    email: "2@gmail.com",
    username: "2",
    roles: ["User"],
    active: true,
  },
  {
    id: 3,
    _id: 3,
    firstname: "3",
    lastname: "3",
    email: "3@gmail.com",
    username: "3",
    roles: ["User"],
    active: true,
  },
  {
    id: 4,
    _id: 4,
    firstname: "4",
    lastname: "4",
    email: "4@gmail.com",
    username: "4",
    roles: ["User"],
    active: true,
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
    active: true,
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
    active: true,
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
    roles: ["User"],
    active: true,
  },
];

interface KeyValue {
  key: keyof UserType;
  value: string;
}

const useUsersApi = (pagesize: number) => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [next, setNext] = useState<number>();
  const [totalcount, setTotalCount] = useState<number>();

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "_id", headerName: "_ID", width: 50 },
    { field: "firstname", headerName: "FirstName", width: 100 },
    { field: "lastname", headerName: "LastName", width: 100 },
    { field: "email", headerName: "Email", width: 100 },
    { field: "username", headerName: "Username", width: 100 },
    { field: "roles", headerName: "Roles", width: 100 },
    { field: "active", headerName: "Active", width: 60 },
  ];

  useEffect(() => {
    fetchUsers(0);
  }, []);

  function fetchUsers(pagenumber: number, filter?: KeyValue, sort?: KeyValue) {
    setisLoading(true);
    let filterUsersData = UsersData.slice();

    if (filter) {
      filterUsersData = UsersData.filter(
        (x) => x[filter.key] === filter?.value
      );
    }

    if (sort) {
      if (sort.key == "id") {
        if (sort.value == "asc")
          filterUsersData = filterUsersData.sort((x) => x.id);
        else if (sort.value == "desc")
          filterUsersData = filterUsersData.sort((x) => x.id).reverse();
      }
    }

    console.log(filterUsersData);

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
    }, 1000);
  }
  return { rows: users, next, totalcount, columns, fetchUsers, isLoading };
};

///////////////////////////////////////////////////////////////////

const UserDataGrid = () => {
  const PAGE_SIZE = 5;

  const { rows, columns, next, totalcount, fetchUsers, isLoading } =
    useUsersApi(PAGE_SIZE);

  const [pageInfo, setpageInfo] = useState<PageInfo>({});
  const [rowCountState, setRowCountState] = useState(
    pageInfo?.totalRowCount || 0
  );
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  });
  const [filter, setFilter] = useState<KeyValue | undefined>(undefined);
  const [sort, setSort] = useState<KeyValue | undefined>(undefined);

  const mapPageToNextCursor = useRef<{ [page: number]: GridRowId }>({});

  useEffect(() => {
    setpageInfo({
      totalRowCount: totalcount,
      nextCursor: next,
      pageSize: PAGE_SIZE,
    });
  }, [rows, next]);

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

  const handlePaginationModelChange = (
    newPaginationModel: GridPaginationModel
  ) => {
    if (
      newPaginationModel.page === 0 ||
      mapPageToNextCursor.current[newPaginationModel.page - 1]
    ) {
      setPaginationModel(newPaginationModel);
      fetchUsers(newPaginationModel.page, filter);
    }
  };

  const onFilterChange = (filterModel: GridFilterModel) => {
    // Here you save the data you need from the filter model
    if (filterModel.items && filterModel.items.length > 0) {
      if (
        filterModel.items[0].value != undefined &&
        filterModel.items[0].value != ""
      ) {
        const result = {
          key: filterModel.items[0].field as keyof UserType,
          value: filterModel.items[0].value,
        };
        setFilter(result);
        fetchUsers(paginationModel.page, result);
      } else if (filter) {
        setFilter(undefined);
        fetchUsers(paginationModel.page);
      }
    } else if (filter) {
      setFilter(undefined);
      fetchUsers(paginationModel.page);
    }
  };

  const handleSortModelChange = (sortModel: GridSortModel) => {
    if (sortModel && sortModel[0]) {
      const result = {
        key: sortModel[0].field as keyof UserType,
        value: sortModel[0].sort!,
      };
      setSort(result);
      fetchUsers(paginationModel.page, undefined, result);
      console.log(result);
    } else {
      setSort(undefined);
      fetchUsers(paginationModel.page);
      console.log(undefined);
    }
  };

  return (
    <>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[PAGE_SIZE]}
        rowCount={rowCountState}
        paginationMode="server"
        onPaginationModelChange={handlePaginationModelChange}
        paginationModel={paginationModel}
        loading={isLoading}
        filterMode="server"
        onFilterModelChange={onFilterChange}
        sortingMode="server"
        onSortModelChange={handleSortModelChange}
      />
    </>
  );
};

export default UserDataGrid;
