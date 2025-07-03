import { useDidMount } from "@/hooks";
import { useEffect, useState } from "react";
import firebase from "@/services/firebase";
import { formatProductPrice } from "@/helpers/utils";
import { productsSkeleton } from "@/constants";

const useRecommendedProducts = () => {
  const [recommendedProducts, setRecommendedProducts] = useState(
    productsSkeleton[Object.keys(productsSkeleton)[0]]
  );
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const didMount = useDidMount(true);

  const fetchRecommendedProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const docs = await firebase.getRecommendedProducts();

      if (docs.empty) {
        if (didMount) {
          setError("No recommended products found.");
          setLoading(false);
        }
      } else {
        const items = [];

        docs.forEach((snap) => {
          const data = snap.data();
          items.push({
            id: snap.ref.id,
            ...data,
            price: formatProductPrice(data.price),
          });
        });

        if (didMount) {
          setRecommendedProducts(items);
          setLoading(false);
        }
      }
    } catch (e) {
      if (didMount) {
        setError("Failed to fetch recommended products");
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (
      (recommendedProducts.length === 0 ||
        recommendedProducts.some((p) => p.skeleton)) &&
      didMount
    ) {
      fetchRecommendedProducts();
    }
  }, []);

  return {
    recommendedProducts,
    fetchRecommendedProducts,
    isLoading,
    error,
  };
};

export default useRecommendedProducts;
