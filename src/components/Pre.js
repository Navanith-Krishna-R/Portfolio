import React from "react";
import Logo from "./Logo";

function Pre({ load }) {
  return (
    <div id={load ? "preloader" : "preloader-none"} aria-hidden={!load}>
      <Logo size={74} className="preloader-mark" title="Loading" />
    </div>
  );
}

export default Pre;
