import {
  Alert,
  AlertColor,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Modal,
  Switch,
  TextField,
  Typography,
  colors,
} from "@mui/material";
import { Stack } from "@mui/system";
import { FC, useEffect, useState } from "react";
import useInput from "../../hooks/useInput";
import { ROLES } from "../../config/roles";
import * as yup from "yup";
import getError from "../../utilities/getError";
import { useAddNewUserMutation, useGetUserQuery } from "./usersApiSlice";
import { User } from "../../models/User";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: colors.grey[50], //"white",
  boxShadow: 24,
  pt: 2,
  px: 3,
  pb: 2,
  borderRadius: 1,
};

interface IProps {
  userModalTitle: string;
  setShowUserModal: React.Dispatch<React.SetStateAction<boolean>>;
  showUserModal: boolean;
  editId: string;
  setEditId: React.Dispatch<React.SetStateAction<string>>;
}

interface IRoleCheckBox {
  [index: string]: boolean;
}

const UserModal: FC<IProps> = ({
  setShowUserModal,
  showUserModal,
  userModalTitle,
  editId,
  setEditId,
}) => {
  const [addUser] = useAddNewUserMutation();

  const { data, isLoading } = useGetUserQuery({ id: editId });
  //console.log("1-editId",editId);

  const initialRolesState = Object.values(ROLES).map((item) => {
    let c1: IRoleCheckBox = {};
    c1[item] = false;
    return c1;
  });
  const {
    value: firstName,
    attributeObj: firstNameAttribs,
    reset: resetFirstName,
    setValue: setFirstName,
  } = useInput("");
  const {
    value: lastName,
    attributeObj: lastNameAttribs,
    reset: resetLastName,
    setValue: setLastName,
  } = useInput<string>("");
  const {
    value: email,
    attributeObj: emailAttribs,
    reset: resetEmail,
    setValue: setEmail,
  } = useInput<string>("");
  const {
    value: userName,
    attributeObj: userNameAttribs,
    reset: resetUserName,
    setValue: setUserName,
  } = useInput<string>("");
  const {
    value: active,
    reset: resetActive,
    onChange: onChangeActive,
    setValue: setActive,
  } = useInput<boolean>(false);
  const {
    value: roles,
    reset: resetRoles,
    onChange: onChangeRoles,
    setValue: setRoles,
  } = useInput<IRoleCheckBox[]>(initialRolesState);

  const arrRoles = Object.values(ROLES).filter((x, index) => roles[index][x]);

  const [errors, setErrors] = useState<string[]>();
  const [msg, setMsg] = useState<{ msgType: AlertColor; msg: string }>();
  const [password, setPassword] = useState("");

  useEffect(() => {
    //console.log("editId changed", isLoading, data);
    if (editId === "") {
      resetFirstName();
      resetLastName();
      resetEmail();
      resetUserName();
      resetActive();
      resetRoles();
      setPassword("");
    }
  }, [editId]);

  useEffect(() => {
    //console.log("data changed", isLoading, data);
    if (data && editId != "") {
      //console.log("2-editId",editId);

      const user = data as { data: User };
      //console.log(user.data.firstName);
      setFirstName(user.data.firstName);
      setLastName(user.data.lastName);
      setEmail(user.data.email);
      setUserName(user.data.userName);
      setActive(user.data.active);
    }
  }, [data]);

  let schema = yup.object().shape({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().required(),
    userName: yup.string().required(),
    password: yup.string().required(),
    roles: yup.array().min(1).required(),
  });

  async function validate() {
    try {
      await schema.validate(
        { firstName, lastName, email, roles: arrRoles, userName, password },
        { abortEarly: false }
      );
      setErrors([]);
      return true;
    } catch (err) {
      setErrors(getError(err));
      return false;
    }
  }

  const handlePwdInput = (_event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(_event.target.value);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValid = await validate();
    try {
      setMsg(undefined);
      if (isValid) {
        await addUser({
          firstName,
          lastName,
          email,
          roles: arrRoles,
          userName,
          password,
          active,
        }).unwrap();

        resetFirstName();
        resetLastName();
        resetEmail();
        resetUserName();
        resetActive();
        resetRoles();

        setMsg({ msg: "New User successfully added", msgType: "success" });

        // navigate("/home");
        setPassword("");
      }
    } catch (error) {
      const err = error as { status: number };
      if (!err.status) {
        setMsg({ msg: "No Server Response", msgType: "error" });
      } else if (err.status === 401) {
        setMsg({ msg: "Unauthorized", msgType: "error" });
      } else {
        setMsg({ msg: JSON.stringify(err), msgType: "error" });
      }
    } finally {
      if (isValid) {
        setPassword("");
      }
    }
  };

  return (
    <>
      <Modal open={showUserModal}>
        <Stack sx={{ ...style }} component="form" onSubmit={handleSubmit}>
          <Stack mb={2}>
            <Typography color={colors.grey[700]} fontWeight={"bold"}>
              {userModalTitle}
            </Typography>
          </Stack>
          <Stack mb={1}>
            {msg && (
              <Alert variant="filled" severity={msg.msgType}>
                {msg.msg}
              </Alert>
            )}

            {errors && errors.length > 0 && (
              <Alert variant="filled" severity="error">
                {errors.map((e, i) => {
                  return <li key={i}>{e}</li>;
                })}
              </Alert>
            )}
          </Stack>
          <Grid spacing={1} container>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth={true}
                size="small"
                label="FirstName"
                {...firstNameAttribs}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth={true}
                size="small"
                label="LastName"
                {...lastNameAttribs}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth={true}
                size="small"
                label="Email"
                {...emailAttribs}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth={true}
                size="small"
                label="UserName"
                {...userNameAttribs}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth={true}
                onChange={handlePwdInput}
                size="small"
                type="password"
                label="Password"
                value={password}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      onChangeActive(event);
                    }}
                    checked={active}
                  />
                }
                label="Active"
              />
            </Grid>
            <Grid item xs={12}>
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
                            name={item}
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              onChangeRoles(event, index, item);
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
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row" justifyContent="end">
                <Button
                  onClick={() => {
                    setShowUserModal(false);
                    setErrors([]);
                    setMsg(undefined);
                    if (editId && editId !== "") {
                      //console.log("23423");
                      setEditId("");
                      //console.log("3-editId",editId);
                    }
                  }}
                >
                  Close
                </Button>
                <Button
                  type="submit"
                  style={{ textTransform: "none" }}
                  variant="contained"
                >
                  Confirm
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Modal>
    </>
  );
};

export default UserModal;
