import { Button } from "@mui/material";

const useTest1 = () => {
  let y1 = 10;
  const changeY1 = () => {
    console.log("y1", y1);
    y1 = y1 + 1;
  };
  return { y1, changeY1 };
};

const Test1 = () => {
  const { y1, changeY1 } = useTest1();
  let y3 = 1;
  const click1 = () => {
    console.log("y1", y1, "***", "y3", y3);
    changeY1();
    y3 = y3 + 1;
  };

  return (
    <>
      <Button onClick={click1}>
        {y3}
        <br />
        {y1}
      </Button>
    </>
  );
};

export default Test1;
