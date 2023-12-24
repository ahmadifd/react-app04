import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { Box, Stack } from "@mui/system";
import { Typography } from "@mui/material";

const Welcome = () => {
  const { userName } = useAuth();

  const content = (
    <>
      <Stack direction="column">
        <Box>
          <Typography>Welcome {userName}!</Typography>
        </Box>
        <Box>
          <Typography>
            <Link to="/dash/users">View User Settings</Link>
          </Typography>
        </Box>
      </Stack>
    </>
  );
  return content;
};

export default Welcome;
