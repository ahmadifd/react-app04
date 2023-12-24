import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
} from "@mui/material";
import { ROLES } from "../../config/roles";
import { useEffect, useState } from "react";
import useInput from "../../hooks/useInput";

interface IRoleCheckBox {
  [index: string]: boolean;
}

const Test2 = () => {
  const initialState = Object.values(ROLES).map((item) => {
    let c1: IRoleCheckBox = {};
    c1[item] = false;
    return c1;
  });

  const [roles, rolesAttribs, , onChange] = useInput("roles", initialState);
  //  const [roles, setroles] = useState<IRoleCheckBox[]>(initialState);

  // const onChange = (
  //   event: React.ChangeEvent<HTMLInputElement>,
  //   index: number,
  //   item: string
  // ) => {
  //   let temp = [...roles];
  //   temp[index][item] = event.target.checked;
  //   setroles(temp);

  //   console.log("temp", temp);
  // };

  return (
    <>
      <FormControl>
        <FormLabel>Roles</FormLabel>
        <FormGroup sx={{ position: "flex", flexDirection: "row" }}>
          {Object.values(ROLES).map((item, index) => {
            return (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    size="small"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      onChange(event, index, item);
                    }}
                    checked={roles[index][item]}
                  />
                }
                label={item}
              />
            );
          })}
        </FormGroup>
      </FormControl>
    </>
  );
};

export default Test2;
