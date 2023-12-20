import { Link, useNavigate } from "react-router-dom";
import useInput from "../../hooks/useInput";
import { useEffect, useRef, useState } from "react";
import usePersist from "../../hooks/usePersist";
import * as yup from "yup";
import getError from "../../utilities/getError";
import { useLoginMutation } from "./authApiSlice";
import { setCredentials } from "./authSlice";
import { useAppDispatch } from "../../app/store";
import { Box, Stack } from "@mui/system";
import {
  Alert,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const userRef = useRef<HTMLInputElement>(null!);

  const [user, userAttribs] = useInput("user", "");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [persist, setPersist] = usePersist();
  const [errors, setErrors] = useState<string[]>();

  const handlePwdInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  const handleToggle = () => setPersist((prev: boolean) => !prev);

  let schema = yup.object().shape({
    username: yup.string().required(),
    password: yup.string().required(),
  });

  async function validate() {
    try {
      await schema.validate(
        { username: user, password },
        { abortEarly: false }
      );
      setErrors([]);
      return true;
    } catch (err) {
      console.log(user,password,err);
      setErrors(getError(err));
      return false;
    }
  }

  useEffect(() => {
    userRef.current.focus();
  }, []);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValid = await validate();
    try {
      if (isValid) {
        setErrMsg("");
        const {
          data: { accessToken },
        } = await login({
          username: user,
          password,
        }).unwrap();
        dispatch(setCredentials({ token: accessToken }));

        navigate("/home");
      }
    } catch (error) {
      const err = error as { status: number };
      if (!err.status) {
        setErrMsg("No Server Response");
      } else if (err.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg(JSON.stringify(err));
      }
    } finally {
      if (isValid) {
        setPassword("");
      }
    }
  };

  if (isLoading) return <h1>...isLoading</h1>;

  const content = (
    <>
      <Stack direction="column" mx={1} my={1}>
        <Stack mb={1}>
          {errMsg && (
            <Alert variant="filled" severity="error">
              {errMsg}
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
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container>
            <Grid mb={1} item>
              <TextField label="Username" ref={userRef} {...userAttribs} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                onChange={handlePwdInput}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={persist}
                    onChange={handleToggle}
                    size="small"
                    color="secondary"
                  />
                }
                label="Trust This Device"
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" style={{textTransform: 'none'}} variant="contained">
                Sign In
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Box>
          <Typography>
            <Link to="/"> Back to Home</Link>
          </Typography>
        </Box>
        <Box>
          <Typography>Need an Account?</Typography>
        </Box>
        <Box>
          <Typography>
            <Link to="/register">Sign Up</Link>
          </Typography>
        </Box>
      </Stack>
    </>
  );
  return content;
};

export default Login;
