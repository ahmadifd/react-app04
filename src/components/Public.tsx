import { Stack } from "@mui/system";
import { Link } from "react-router-dom";

const Public = () => {
  const content = (
    <>
      <Stack direction="column" mx={5}>
        <Stack>Public-Header</Stack>
        <Stack>Public-Main</Stack>
        <Stack>
          Public-Footer
          <Link to="/login"> Login</Link>
        </Stack>
      </Stack>
    </>
  );

  return content;
};

export default Public;
