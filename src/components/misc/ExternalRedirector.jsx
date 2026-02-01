import React, { useEffect, useState } from "react";
import dayjs, { formatDate, parseDate } from "@/helpers/dayjs";
import { useLocation, useHistory } from "react-router-dom";
import { updateRentalPeriod } from "@/redux/actions/miscActions";
import { useDispatch } from "react-redux";
import useProductAvailability from "@/hooks/useProductAvailability";
import useProduct from "@/hooks/useProduct";
import { Spin } from "antd";

// Function to normalize URL key
const normalizeKey = (key) => {
  if (!key) return "";
  return key
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_") // Spaces → underscores
    .replace(/[+]/g, "_") // + → underscore
    .replace(/\./g, "_"); // Dots → underscores
};

// Allowed transport domains
const TRANSPORT_DOMAINS = ["rapido", "uber", "porter"];

// Allowed payment domains
const PAYMENT_DOMAINS = ["paypal", "stripe", "rzp"];

// Mapping of URL keys to target URLs or internal routes with product IDs
const redirectMap = {
  // External URLs
  psndeluxe:
    "https://www.playstation.com/en-in/ps-plus/games/?category=GAME_CATALOG&category=CLASSICS_CATALOG#plus-container",
  metaplus: "https://www.meta.com/en-gb/experiences/meta-horizon-plus/",
  eaplay: "https://www.ea.com/ea-play/games#playstation",

  // Internal game routes (ps4/ps5 + 100 games)
  ps4_400_games: {
    route: "/product/playstation4-slim-1-controller-100-games",
    productId: "playstation4-slim-1-controller-100-games",
  },
  ps5_400_games: {
    route: "/product/playstation5-slim-digital-edition-1-controller-100-games",
    productId: "playstation5-slim-digital-edition-1-controller-100-games",
  },
  more_consoles: "/products/gaming-consoles",
  meta_quest_3s: {
    route: "/product/meta-quest-3s-128gb-mixed-reality-headset-all-in-one",
    productId: "meta-quest-3s-128gb-mixed-reality-headset-all-in-one",
  },

  // Specific games
  fc24: {
    route: "/product/ea-sports-fc-24",
    productId: "ea-sports-fc-24",
  },
  gta_v: {
    route: "/product/grand-theft-auto-v-ps4",
    productId: "grand-theft-auto-v-ps4",
  },
  more_games: "/products/games-controllers",
};

const isAbsoluteTransportUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return TRANSPORT_DOMAINS.some((domain) =>
      urlObj.hostname.toLowerCase().includes(domain)
    );
  } catch {
    return false;
  }
};

const isAbsolutePaymentUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return PAYMENT_DOMAINS.some((domain) =>
      urlObj.hostname.toLowerCase().includes(domain)
    );
  } catch {
    return false;
  }
};

function ExternalRedirector() {
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();
  const searchParams = new URLSearchParams(location.search);
  const unnormalizedUrlKey = searchParams.get("p");
  const urlKey = normalizeKey(unnormalizedUrlKey);
  const days = parseInt(searchParams.get("d")) || 7;

  const [isChecking, setIsChecking] = useState(false);
  const [redirected, setRedirected] = useState(false);
  const [productId, setProductId] = useState(null);

  const {
    getAvailableSlots,
    isProductAvailable,
    isLoading: isLoadingAvailability,
  } = useProductAvailability();
  const { product, isLoading: isProductLoading } = useProduct(productId);

  // Update rental period if days param is valid and not default 7
  useEffect(() => {
    if (!isNaN(days) && days > 0 && days <= 30 && days !== 7) {
      dispatch(
        updateRentalPeriod({
          dates: [
            formatDate(dayjs().add(1, "day")),
            formatDate(dayjs().add(days + 1, "day")),
          ],
          days,
        })
      );
    }
  }, [days, dispatch]);

  // Check availability and perform redirect
  useEffect(() => {
    const performRedirect = async () => {
      if (!urlKey || redirected) {
        history.push("/");
        return;
      }

      if (
        isAbsoluteTransportUrl(unnormalizedUrlKey) ||
        isAbsolutePaymentUrl(unnormalizedUrlKey)
      ) {
        window.location.href = unnormalizedUrlKey;
        return;
      }

      if (!redirectMap[urlKey]) {
        history.push("/");
        return;
      }

      const targetConfig = redirectMap[urlKey];

      // External URLs - redirect immediately
      if (typeof targetConfig === "string" && targetConfig.startsWith("http")) {
        window.location.href = targetConfig;
        return;
      }

      // Non-product routes (like /products/gaming-consoles)
      if (typeof targetConfig === "string") {
        history.push(targetConfig);
        setRedirected(true);
        return;
      }

      // Product routes with availability check
      if (targetConfig.productId) {
        // Set product ID to fetch the actual product
        setProductId(targetConfig.productId);
      }
    };

    performRedirect();
  }, [urlKey, history, redirected]);

  // Handle product availability check when product is loaded
  useEffect(() => {
    const handleAvailabilityCheck = async () => {
      if (!product || isProductLoading || isLoadingAvailability || redirected) {
        return;
      }

      const targetConfig = redirectMap[urlKey];
      if (!targetConfig || typeof targetConfig === "string") {
        return;
      }

      setIsChecking(true);
      try {
        const startDate = formatDate(dayjs().add(1, "day"));
        const endDate = formatDate(dayjs().add(days + 1, "day"));

        console.log(
          `Checking availability for product: ${product.name} (${product.id})`
        );

        // Check if product is available for the requested period using actual product
        const isAvailable = isProductAvailable(product, startDate, endDate);

        if (isAvailable) {
          // Product is available - redirect with original dates
          console.log(
            `Product ${product.name} is available for requested period`
          );
          dispatch(
            updateRentalPeriod({
              dates: [startDate, endDate],
              days,
            })
          );
          history.push(targetConfig.route);
          setRedirected(true);
        } else {
          // Product is NOT available - find next available dates
          console.log(
            `Product ${product.name} not available for requested period. Finding next available date...`
          );

          // Try to find next available slot
          const availableSlots = await getAvailableSlots(product);

          if (availableSlots && availableSlots.length > 0) {
            const nextAvailableStart = availableSlots[0].start;
            const nextAvailableStartDate = parseDate(nextAvailableStart);
            const nextAvailableEndDate = nextAvailableStartDate.add(
              days,
              "day"
            );

            console.log(
              `Found next availability for ${product.name}: ${formatDate(
                nextAvailableStartDate
              )} to ${formatDate(nextAvailableEndDate)}`
            );

            // Update rental period to next available dates
            dispatch(
              updateRentalPeriod({
                dates: [
                  formatDate(nextAvailableStartDate),
                  formatDate(nextAvailableEndDate),
                ],
                days,
              })
            );

            history.push(targetConfig.route);
            setRedirected(true);
          } else {
            // No availability found - redirect anyway but user will see "out of stock"
            console.warn(`No availability found for ${product.name}`);
            dispatch(
              updateRentalPeriod({
                dates: [startDate, endDate],
                days,
              })
            );
            history.push(targetConfig.route);
            setRedirected(true);
          }
        }
      } catch (error) {
        console.error("Error checking product availability:", error);
        // Proceed with redirect even if availability check fails
        const startDate = formatDate(dayjs().add(1, "day"));
        const endDate = formatDate(dayjs().add(days + 1, "day"));
        dispatch(
          updateRentalPeriod({
            dates: [startDate, endDate],
            days,
          })
        );
        const targetConfig = redirectMap[urlKey];
        if (targetConfig && targetConfig.route) {
          history.push(targetConfig.route);
        }
        setRedirected(true);
      } finally {
        setIsChecking(false);
      }
    };

    handleAvailabilityCheck();
  }, [product, isProductLoading, isLoadingAvailability, productId]);

  // Show loading spinner while checking product or availability

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="ezys-spinner"
        style={{ height: "unset", margin: "10px 0" }}
      >
        <Spin size="large" />
      </div>
    </div>
  );
}

export default ExternalRedirector;
