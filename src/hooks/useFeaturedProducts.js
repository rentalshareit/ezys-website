import { useDidMount } from "@/hooks";
import { useEffect, useState } from "react";
import firebase from "@/services/firebase";
import { formatProductPrice } from "@/helpers/utils";
import { productsSkeleton } from "@/constants";

const useFeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState(
    productsSkeleton[Object.keys(productsSkeleton)[0]]
  );
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const didMount = useDidMount(true);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const docs = await firebase.getFeaturedProducts();

      if (docs.empty) {
        if (didMount) {
          setError("No featured products found.");
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
          setFeaturedProducts(items);
          setLoading(false);
        }
      }
    } catch (e) {
      if (didMount) {
        setError("Failed to fetch featured products");
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (
      (featuredProducts.length === 0 ||
        featuredProducts.some((p) => p.skeleton)) &&
      didMount
    ) {
      fetchFeaturedProducts();
    }
  }, []);

  return {
    featuredProducts,
    fetchFeaturedProducts,
    isLoading,
    error,
  };
};

export default useFeaturedProducts;
