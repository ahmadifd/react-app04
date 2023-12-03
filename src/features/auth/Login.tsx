import { Link } from "react-router-dom";
import useInput from "../../hooks/useInput";
import { useEffect, useRef, useState } from "react";
import usePersist from "../../hooks/usePersist";
import * as yup from "yup";
import getError from "../../utilities/getError";

const Login = () => {
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
    user: yup.string().required(),
    password: yup.string().required(),
  });

  async function validate() {
    try {
      await schema.validate({ user, password }, { abortEarly: false });
      setErrors([]);
    } catch (err) {
      setErrors(getError(err));
    }
  }

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
    setErrors([]);
  }, [user, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // try {
    await validate().then(async (res) => {});

    // } catch (err) {}
  };

  const content = (
    <div className="container">
      <div>
        <div>Login-Header</div>
        <div>
          {errMsg && (
            <div className="alert alert-danger">
              <p>{errMsg}</p>
            </div>
          )}

          {errors && errors.length > 0 && (
            <div className="alert alert-danger">
              {errors.map((e, i) => {
                return <li key={i}>{e}</li>;
              })}
            </div>
          )}
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
          <div>
            Login-Footer
            <Link to="/"> Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
  return content;
};

export default Login;
