import useLocalStorage from "./useLocalStorage";

type KeyState = string;
type ValueState = string;

const useInput = (key: KeyState, initValue: ValueState) => {
  const [value, setValue] = useLocalStorage(key, initValue);

  const reset = () => setValue(initValue);

  const attributeObj = {
    value,
    onChange: (e: React.FormEvent<HTMLInputElement>) =>
      setValue(e.currentTarget.value),
  };

  return [value, reset, attributeObj];
};

export default useInput;
