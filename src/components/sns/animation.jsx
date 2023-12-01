import FlowJson from "./Flow.json"
import Lottie from "lottie-react";
import styled from "styled-components";
import { useEffect, useRef, useState } from "react";

const Box = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

const OuterBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`
export default function Animation(){
  const divRef = useRef(null);

  const [width,setWidth] = useState(0);
  const [height,setHeight] = useState(0);

  useEffect(() => {
    switchWindow();
    window.addEventListener("resize",  switchWindow);
    return () =>{
      window.removeEventListener("resize",  switchWindow);
    }
  }, []);

  const switchWindow = () =>{
    let adHeight =0;
    let adWidth =0;

    if (divRef.current) {
      const divHeight = divRef.current.offsetHeight;
      const divWidth = divRef.current.offsetWidth;
      if (divWidth/divHeight > 1.5){
        adWidth = divWidth;
        adHeight = divWidth / 1.5;
      }else{
        adHeight = divHeight;
        adWidth = adHeight * 1.5;
      }
      setWidth(adWidth);
      setHeight(adHeight);
    }
  }

  const style={
    width,
    height
  }

  return <Box ref={divRef}>
    <OuterBox>
      <div>
        <Lottie animationData={FlowJson} loop={true} style={style}  />
      </div>

    </OuterBox>
  </Box>
}
