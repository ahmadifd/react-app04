import { Outlet, useNavigate } from "react-router-dom";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import { Box, Stack } from "@mui/system";
import { Button } from "@mui/material";

const ShoppingLayout = () => {
  const navigate = useNavigate();

  const [sendLogout] = useSendLogoutMutation();

  const signOut = async () => {
    await sendLogout(null);
    navigate("/");
  };

  return (
    <>
      <Stack direction="column" mx={5}>
        <Stack direction="column">
          <Outlet />
        </Stack>
        <Box>
          <Button onClick={signOut} variant="contained" color="error">
            Sign Out
          </Button>
        </Box>
      </Stack>
    </>
  );
};
export default ShoppingLayout;
