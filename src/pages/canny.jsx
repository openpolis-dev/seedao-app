import React, { useEffect } from "react";
import styled from "styled-components";
import { ContainerPadding } from "../assets/styles/global.tsx";
import { AppActionType, useAuthContext } from "../providers/authProvider.tsx";

// const BoardToken = 'a4cd1234-51cf-5333-fef6-af0b26a3e8e7';
const BoardToken = "9adfb174-5898-2265-ea68-cdc3f23e9168";

const OuterBox = styled.div`
  min-height: 100%;
  ${ContainerPadding};
`;

const InnerBox = styled.div`
  background: #fff;
  padding: 20px;
  min-height: 100%;
`;

const Feedback = () => {
  const {
    dispatch
  } = useAuthContext();





  useEffect(() => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    (function(w, d, i, s) {
      function l() {
        if (!d.getElementById(i)) {
          var f = d.getElementsByTagName(s)[0], e = d.createElement(s);
          e.type = "text/javascript", e.async = !0, e.src = "https://canny.io/sdk.js", f.parentNode.insertBefore(e, f);
        }

      }

      if ("function" != typeof w.Canny) {
        var c = function() {
          c.q.push(arguments);
        };
        c.q = [], w.Canny = c, "complete" === d.readyState ? l() : w.attachEvent ? w.attachEvent("onload", l) : w.addEventListener("load", l, !1);
      }
    })(window, document, "canny-jssdk", "script");


    window.Canny("render", {
      boardToken: BoardToken,
      basePath: null, // See step 2
      ssoToken: null, // See step 3,
      theme: "light" // options: light [default], dark, auto
    });
    setTimeout(()=>{
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
    },3000)
  }, []);



  return (
    <OuterBox>
      <InnerBox>
        <div data-canny id="aaa" />
      </InnerBox>
    </OuterBox>

  );
};

export default Feedback;
