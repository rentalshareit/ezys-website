import { useLayoutEffect } from "react";

const useDocumentTitle = (title) => {
  useLayoutEffect(() => {
    if (title) {
      document.title = title;
    } else {
      document.title = "Ezys - Rent With Ease";
    }
  }, [title]);
};

export default useDocumentTitle;
