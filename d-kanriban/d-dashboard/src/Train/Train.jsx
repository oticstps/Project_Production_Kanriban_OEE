import { useState } from "react";
import ButtonActualPcsUp from "./components/ButtonActualPcsUp";
import ButtonActualPcsDown from "./components/ButtonActualPcsDown";

const Train = () => {
  const [count, setCount] = useState(0);

  return (
    <>


    <p>Count: {count}</p>


        <ButtonActualPcsUp onClick={() => setCount(count + 1)} /> 
        <ButtonActualPcsDown onClick={() => setCount(count - 1)} />


    </>
  );
};

export default Train;