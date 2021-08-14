import {
  setCallTimer,
  setInterVal,
} from "../../../app/actions/privateCallAction";

const run = (timer, dispatch) => {
  if (timer.m === 60) {
    timer.h++;
    timer.m = 0;
  } else if (timer.s === 60) {
    timer.m++;
    timer.s = 0;
  }
  dispatch(
    setCallTimer({
      s: timer.s,
      m: timer.m,
      h: timer.h,
    })
  );
  timer.s++;
};

export const start = (timer, dispatch) => {
  run(timer, dispatch);
  dispatch(setInterVal(setInterval(() => run(timer, dispatch), 1000)));
};

export const end = (interVal) => {
  clearInterval(interVal);
};
