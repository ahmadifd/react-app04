import { Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { Link } from "react-router-dom";

const Public = () => {
  const content = (
    <>
      <Stack direction="column" mx={5}>
        <Stack>
          <Typography>Public-Header</Typography>
        </Stack>
        <Stack>
          {" "}
          <Typography>Public-Main</Typography>
        </Stack>
        <Stack>
          <Typography>Public-Footer</Typography>
          <Typography> <Link to="/login"> Login</Link></Typography>
        </Stack>
      </Stack>
    </>
  );

  return content;
};

export default Public;
