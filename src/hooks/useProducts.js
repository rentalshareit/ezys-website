import { useDidMount } from "@/hooks";
import { useEffect, useState } from "react";
import firebase from "@/services/firebase";
import { formatProductPrice } from "@/helpers/utils";
import { productsSkeleton } from "@/constants";

const useProducts = (category) => {
  const [products, setProducts] = useState(productsSkeleton);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const didMount = useDidMount(true);

  const getProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const docs = await firebase.getProducts();

      if (docs.empty) {
        if (didMount) {
          setError("No products found.");
          setLoading(false);
        }
      } else {
        const items = {};

        docs
          .filter((d) => d.category === category || !category)
          .forEach((data) => {
            const { category } = data;
            items[category] = items[category] || [];
            items[category].push({
              ...data,
              price: formatProductPrice(data.price),
            });
          });

        if (didMount) {
          setProducts(items);
          setLoading(false);
        }
      }
    } catch (e) {
      if (didMount) {
        setError("Failed to fetch products");
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (
      products[Object.keys(products)[0]].some((p) => p.skeleton) &&
      didMount
    ) {
      getProducts();
    }
  }, []);

  return {
    products,
    getProducts,
    isLoading,
    error,
  };
};

export default useProducts;
