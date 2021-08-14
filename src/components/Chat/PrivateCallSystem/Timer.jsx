import React from "react";

const Timer = ({ timer }) => {
  return (
    <div className="d-flex justify-content-center align-items-center text-light text-center">
      <h6 className="m-2">{timer.h > 9 ? timer.h : "0" + timer.h}h</h6>
      <h6 className="m-2">{timer.m > 9 ? timer.m : "0" + timer.m}m</h6>
      <h6 className="m-2">{timer.s > 9 ? timer.s : "0" + timer.s}s</h6>
    </div>
  );
};

export default Timer;
