import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { Box, Stack } from "@mui/system";

const Welcome = () => {
  const { username } = useAuth();

  const content = (
    <>
      <Stack direction="column" >
        <Box>Welcome {username}!</Box>
        <Box>
          <Link to="/dash/users">View User Settings</Link>
        </Box>
      </Stack>
    </>
  );
  return content;
};

export default Welcome;
