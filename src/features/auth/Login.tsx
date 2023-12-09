import { Link, useNavigate } from "react-router-dom";
import useInput from "../../hooks/useInput";
import { useEffect, useRef, useState } from "react";
import usePersist from "../../hooks/usePersist";
import * as yup from "yup";
import getError from "../../utilities/getError";
import { useLoginMutation } from "./authApiSlice";
import { setCredentials } from "./authSlice";
import { useAppDispatch } from "../../app/store";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const userRef = useRef<HTMLInputElement>(null!);

  const [user, resetUser, userAttribs] = useInput("user", "");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [persist, setPersist] = usePersist();
  const [errors, setErrors] = useState<string[]>();

  const handlePwdInput = (e: React.FormEvent<HTMLInputElement>) =>
    setPassword(e.currentTarget.value);

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
      setErrors(getError(err));
      return false;
    }
  }

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {}, [user, password]);

  const handleSubmit = async (e: React.FormEvent) => {
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
    <div className="container">
      <div>
        {errMsg && <div className="alert alert-danger">{errMsg}</div>}

        {errors && errors.length > 0 && (
          <div className="alert alert-danger">
            {errors.map((e, i) => {
              return <li key={i}>{e}</li>;
            })}
          </div>
        )}
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              {...userAttribs}
              id="username"
              className="form-control"
              autoComplete="off"
              ref={userRef}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              className="form-control"
              onChange={handlePwdInput}
            />
          </div>
          <div>
            <button className="btn btn-primary">Sign In</button>
            <label htmlFor="persist">
              <input
                type="checkbox"
                id="persist"
                onChange={handleToggle}
                checked={persist}
              />
              Trust This Device
            </label>
          </div>
        </form>
      </div>

      <div>
        <Link to="/"> Back to Home</Link>
        <p>
          Need an Account?
          <br />
          <span className="line">
            <Link to="/register">Sign Up</Link>
          </span>
        </p>
      </div>
    </div>
  );
  return content;
};

export default Login;
