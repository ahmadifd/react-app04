import {
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
import {  Stack } from "@mui/system";
import { FC } from "react";
import useInput from "../../hooks/useInput";
import { ROLES } from "../../config/roles";

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
}

const UserModal: FC<IProps> = ({
  setShowUserModal,
  showUserModal,
  userModalTitle,
}) => {
  const [, firstnameAttribs] = useInput("firstname", "");
  const [, lastnameAttribs] = useInput("lastname", "");
  const [, emailAttribs] = useInput("email", "");
  const [, usernameAttribs] = useInput("username", "");
  //let password = "";
  const handlePwdInput = (_event: React.ChangeEvent<HTMLInputElement>) => {
    //password = e.target.value;
  };
  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  // };
  return (
    <>
      <Modal open={showUserModal}>
        <Stack sx={{ ...style }}>
          <Stack mb={2}>
            <Typography color={colors.grey[700]} fontWeight={"bold"}>
              {userModalTitle}
            </Typography>
          </Stack>
          <Grid spacing={1} container>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth={true}
                size="small"
                label="FirstName"
                {...firstnameAttribs}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth={true}
                size="small"
                label="LastName"
                {...lastnameAttribs}
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
                {...usernameAttribs}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth={true}
                onChange={handlePwdInput}
                size="small"
                type="password"
                label="Password"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch size="small" />}
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
                        control={<Checkbox size="small" name={item} />}
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
