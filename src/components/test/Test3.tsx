import { useState } from "react";
import { useGetUserQuery } from "../../features/users/usersApiSlice";
import { Button } from "@mui/material";

const Test3 = () => {
  const [editId, setEditId] = useState<string>("");
  const result = useGetUserQuery({
    id: editId,
  });
  console.log(result);

  return (
    <>
      <Button
        onClick={() => {
          setEditId((prev) => {
            return prev === "" ? "6587b57d00e96b35a4d0c026" : "";
          });
        }}
      >
        Set EditId
      </Button>
    </>
  );
};

export default Test3;
