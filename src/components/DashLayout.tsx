import { Outlet, useNavigate } from "react-router-dom";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import { Box, Stack } from "@mui/system";
import { Button } from "@mui/material";

const DashLayout = () => {
  const navigate = useNavigate();

  const [sendLogout] = useSendLogoutMutation();

  const signOut = async () => {
    await sendLogout(null);
    navigate("/");
  };

  return (
    <>
      <Stack direction="column" mx={1}  spacing={1}>
        <Box>
          <Button style={{textTransform: 'none'}} onClick={signOut} variant="contained" color="error">
            Sign Out
          </Button>
        </Box>
        <Stack>
          <Outlet />
        </Stack>
      </Stack>
    </>
  );
};
export default DashLayout;
