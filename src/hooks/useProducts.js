import { useDidMount } from "@/hooks";
import { useEffect, useState } from "react";
import firebase from "@/services/firebase";
import { formatProductPrice } from "@/helpers/utils";
import { productsSkeleton } from "@/constants";
import useProductAvailability from "./useProductAvailability";

const useProducts = (category) => {
  const [products, setProducts] = useState(productsSkeleton);
  const [isLoading, setLoading] = useState(false);
  const { isProductAvailable, isLoading: isProductAvailabilityLoading } =
    useProductAvailability();
  const [error, setError] = useState("");
  const [rawProducts, setRawProducts] = useState({});
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
        return;
      }

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

      setRawProducts(items);
    } catch (e) {
      if (didMount) {
        setError("Failed to fetch products");
        setLoading(false);
      }
    }
  };

  // Process products once availability is ready
  useEffect(() => {
    if (
      Object.keys(rawProducts).length > 0 &&
      !isProductAvailabilityLoading &&
      didMount
    ) {
      const processedProducts = {};

      Object.entries(rawProducts).forEach(([cat, catProducts]) => {
        processedProducts[cat] = catProducts.map((product) => ({
          ...product,
          isProductAvailable: (...args) => isProductAvailable(product, ...args),
        }));
      });

      setProducts(processedProducts);
      setLoading(false);
    }
  }, [rawProducts, isProductAvailabilityLoading, isProductAvailable]);

  // Initial fetch
  useEffect(() => {
    if (
      products[Object.keys(products)[0]]?.some((p) => p.skeleton) &&
      didMount
    ) {
      getProducts();
    }
  }, []);

  // Overall loading state
  const overallLoading = isProductAvailabilityLoading || isLoading;

  return {
    products,
    getProducts,
    isLoading: overallLoading,
    error,
  };
};

export default useProducts;
