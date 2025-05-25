import { useEffect } from "react";
import { useRefreshOnISTDateChangeMoment } from "@/hooks";

const PageRefreshOnDateChange = () => {
  useRefreshOnISTDateChangeMoment();
  return null;
};

export default PageRefreshOnDateChange;
