import useLocalStorage from "./useLocalStorage";

type KeyState = string;
type ValueState = string;

const useInput = (key: KeyState, initValue: ValueState) => {
  const [value, setValue] = useLocalStorage(key, initValue);

  const reset = () => setValue(initValue);

  const attributeObj = {
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value), console.log(e.target.value);
    },
  };

  return [value, attributeObj, reset];
};

export default useInput;
