import { useState } from "react";
//import useLocalStorage from "./useLocalStorage";

//type KeyState = string;

function useInput<T>(
  // key: KeyState,
  initValue: T
  //index?: number,
  //item?: string
) {
  const [value, setValue] = useState<T>(initValue); //useLocalStorage(key, initValue);

  function reset() {
    setValue(initValue);
  }

  function onChange(
    e: React.ChangeEvent<HTMLInputElement>,
    index?: number,
    item?: string
  ) {
    if (Array.isArray(value)) {
      let temp = [...value];
      temp[index!][item!] = e.target.checked;
      setValue(temp as T);
    } else if (typeof initValue === "boolean") {
      setValue(e.target.checked as T);
      //console.log(key, e.target.checked);
    } else {
      setValue(e.target.value as T);
      //console.log(key, e.target.value);
    }
  }

  const attributeObj = {
    value,
    onChange: onChange,
  };

  return { value, attributeObj, reset, onChange, setValue };
}

export default useInput;
