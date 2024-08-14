import React, {useEffect, useState} from "react"

const useLocalStorageState = (key, initialState) => {
  const savedState = localStorage.getItem(key);

  try {
    if(savedState)
      initialState = JSON.parse(savedState);
  }
  catch(error) {}

  const [state, setState] = useState(initialState);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

export default useLocalStorageState;
