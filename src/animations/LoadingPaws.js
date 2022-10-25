import React from "react";
import Lottie from "lottie-react";
import catPawLoading from "./cat-paw-loading.json";
import pawsAnimation from "./paws-animation.json";

const LoadingPaws = ({ style }) => (
  <Lottie animationData={catPawLoading} style={style} loop={true} />
);

export default LoadingPaws;
