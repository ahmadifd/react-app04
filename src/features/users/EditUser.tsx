import {
  Alert,
  AlertColor,
  Button,
  Checkbox,
  CircularProgress,
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
import { useEditUserMutation, useGetUserQuery } from "./usersApiSlice";
import { User } from "../../models/User";
import { LoadingButton } from "@mui/lab";

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
  width: '70%',
};

interface IProps {
  modalType: string;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  showModal: boolean;
  editId: string;
  fetchData: () => void;
  setEditId: React.Dispatch<React.SetStateAction<string>>;
}

interface IRoleCheckBox {
  [index: string]: boolean;
}

const EditUser: FC<IProps> = ({
  setShowModal,
  showModal,
  modalType,
  editId,
  fetchData,
  setEditId,
}) => {
  const [editUser, { isLoading: isEditLoading }] = useEditUserMutation();

  const { data, isLoading, refetch, isFetching } = useGetUserQuery({
    id: editId,
  });
  console.log("EditUser", isLoading, editId);

  const initialRolesState = Object.values(ROLES).map((item) => {
    let c1: IRoleCheckBox = {};
    c1[item] = false;
    return c1;
  });
  const {
    value: firstName,
    attributeObj: firstNameAttribs,
    setValue: setFirstName,
  } = useInput("");
  const {
    value: lastName,
    attributeObj: lastNameAttribs,
    setValue: setLastName,
  } = useInput<string>("");
  const {
    value: email,
    attributeObj: emailAttribs,
    setValue: setEmail,
  } = useInput<string>("");
  const {
    value: userName,
    attributeObj: userNameAttribs,
    setValue: setUserName,
  } = useInput<string>("");
  const {
    value: active,
    onChange: onChangeActive,
    setValue: setActive,
  } = useInput<boolean>(false);
  const {
    value: roles,
    onChange: onChangeRoles,
    setValue: setRoles,
  } = useInput<IRoleCheckBox[]>(initialRolesState);

  const arrRoles = Object.values(ROLES).filter((x, index) => roles[index][x]);

  const [errors, setErrors] = useState<string[]>();
  const [msg, setMsg] = useState<{ msgType: AlertColor; msg: string }>();
  const [password, setPassword] = useState("");

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (data && editId != "") {
      const user = data as { data: User };
      setFirstName(user.data.firstName);
      setLastName(user.data.lastName);
      setEmail(user.data.email);
      setUserName(user.data.userName);
      setActive(user.data.active);
      const userRoles = user.data.roles;
      let temp: IRoleCheckBox[] = [];
      Object.values(ROLES).map((item) => {
        let arr1: IRoleCheckBox = {};
        arr1[item] = userRoles.includes(item);
        temp.push(arr1);
        setRoles(temp);
      });
    }
  }, [data]);

  let schema = yup.object().shape({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().email().required(),
    userName: yup.string().required(),
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
        await editUser({
          id: editId,
          firstName,
          lastName,
          email,
          roles: arrRoles,
          userName,
          password,
          active,
        }).unwrap();

        // resetFirstName();
        // resetLastName();
        // resetEmail();
        // resetUserName();
        // resetActive();
        // resetRoles();
        setPassword("");

        setMsg({
          msg: "The User has successfully updated",
          msgType: "success",
        });

        fetchData();

        // navigate("/home");
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
      <Modal open={showModal}>
        <Stack sx={{ ...style }} component="form" onSubmit={handleSubmit}>
          {isLoading || isFetching ? (
            <CircularProgress />
          ) : (
            <Stack>
              <Stack mb={2}>
                <Typography color={colors.grey[700]} fontWeight={"bold"}>
                  {modalType}
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
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => {
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
                        setShowModal(false);
                        setEditId("");
                        setErrors([]);
                        setMsg(undefined);
                      }}
                    >
                      Close
                    </Button>
                    <LoadingButton
                      loading={isEditLoading}
                      type="submit"
                      style={{ textTransform: "none" }}
                      variant="contained"
                    >
                      Confirm
                    </LoadingButton>
                  </Stack>
                </Grid>
              </Grid>
            </Stack>
          )}
        </Stack>
      </Modal>
    </>
  );
};

export default EditUser;
