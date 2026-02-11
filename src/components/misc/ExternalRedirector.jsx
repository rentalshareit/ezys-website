import React, { useEffect, useState } from "react";
import dayjs, { formatDate, parseDate } from "@/helpers/dayjs";
import { useLocation, useHistory, useParams } from "react-router-dom";
import { updateRentalPeriod } from "@/redux/actions/miscActions";
import { useDispatch } from "react-redux";
import useProductAvailability from "@/hooks/useProductAvailability";
import useProduct from "@/hooks/useProduct";
import { Spin } from "antd";

function splitByFirstZero(num) {
  const str = String(num);
  const zeroIndex = str.indexOf("0");
  if (zeroIndex === -1) {
    return [str, ""];
  }
  return [str.slice(0, zeroIndex), str.slice(zeroIndex + 1)];
}

// Function to normalize URL key
const normalizeKey = (key) => {
  if (!key) return "";
  return key
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[+]/g, "_")
    .replace(/\./g, "_");
};

// Allowed transport domains
const TRANSPORT_DOMAINS = ["rapido", "uber", "porter"];

// Allowed payment domains
const PAYMENT_DOMAINS = ["paypal", "stripe", "rzp"];

// External redirect keys (no days logic needed)
const EXTERNAL_KEYS = ["psn", "mp", "eap"];

// Mapping of URL keys to target URLs or internal routes with product IDs
const redirectMap = {
  // External URLs (no days setting)
  psn: "https://ezyshare.in/psn-games-catalog",
  mp: "https://www.meta.com/en-gb/experiences/meta-horizon-plus/",
  eap: "https://www.ea.com/ea-play/games#playstation",

  // Internal game routes (ps4/ps5 + 100 games)
  41: {
    route: "/product/playstation4-slim-1-controller-100-games",
    productId: "playstation4-slim-1-controller-100-games",
  },
  42: {
    route: "/product/playstation4-slim-2-controllers-100-games",
    productId: "playstation4-slim-2-controllers-100-games",
  },
  51: {
    route: "/product/playstation5-slim-digital-edition-1-controller-100-games",
    productId: "playstation5-slim-digital-edition-1-controller-100-games",
  },
  52: {
    route: "/product/playstation5-slim-digital-2-controllers-100-games",
    productId: "playstation5-slim-digital-2-controllers-100-games",
  },
  mgc: "/products/gaming-consoles",
  mq3: {
    route: "/product/meta-quest-3s-128gb-mixed-reality-headset-all-in-one",
    productId: "meta-quest-3s-128gb-mixed-reality-headset-all-in-one",
  },
  fc24: {
    route: "/product/ea-sports-fc-24",
    productId: "ea-sports-fc-24",
  },
  gtav: {
    route: "/product/grand-theft-auto-v-ps4",
    productId: "grand-theft-auto-v-ps4",
  },
  gac: "/products/games-controllers",
};

const isAbsoluteTransportUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return TRANSPORT_DOMAINS.some((domain) =>
      urlObj.hostname.toLowerCase().includes(domain),
    );
  } catch {
    return false;
  }
};

const isAbsolutePaymentUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return PAYMENT_DOMAINS.some((domain) =>
      urlObj.hostname.toLowerCase().includes(domain),
    );
  } catch {
    return false;
  }
};

function ExternalRedirector() {
  const { urlKey: unnormalizedUrlKeyParam } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();
  const searchParams = new URLSearchParams(location.search);

  // Get external URL from query param 'p' if urlKey is 'ext'
  const isExternalUrlCase = normalizeKey(unnormalizedUrlKeyParam) === "ext";
  const externalUrlFromQuery = searchParams.get("p");
  const unnormalizedUrlKey =
    isExternalUrlCase && externalUrlFromQuery
      ? externalUrlFromQuery
      : unnormalizedUrlKeyParam
        ? splitByFirstZero(unnormalizedUrlKeyParam)[0] || ""
        : "";

  // Parse days ONLY for product/internal routes
  const urlKey = isExternalUrlCase ? null : normalizeKey(unnormalizedUrlKey);
  const isExternalRedirect =
    isExternalUrlCase || (urlKey && EXTERNAL_KEYS.includes(urlKey));

  const daysParam =
    !isExternalRedirect && unnormalizedUrlKeyParam
      ? splitByFirstZero(unnormalizedUrlKeyParam)[1]
      : null;
  const days = daysParam ? parseInt(daysParam) : 7;

  const [isChecking, setIsChecking] = useState(false);
  const [redirected, setRedirected] = useState(false);
  const [productId, setProductId] = useState(null);

  const {
    getAvailableSlots,
    isProductAvailable,
    isLoading: isLoadingAvailability,
  } = useProductAvailability();
  const { product, isLoading: isProductLoading } = useProduct(productId);

  // Update rental period ONLY for product routes (skip external redirects)
  useEffect(() => {
    if (
      isExternalRedirect ||
      isNaN(days) ||
      days <= 0 ||
      days > 30 ||
      days === 7
    ) {
      return;
    }

    dispatch(
      updateRentalPeriod({
        dates: [
          formatDate(dayjs().add(1, "day")),
          formatDate(dayjs().add(days + 1, "day")),
        ],
        days,
      }),
    );
  }, [days, dispatch, isExternalRedirect]);

  // Check availability and perform redirect
  useEffect(() => {
    const performRedirect = async () => {
      if (redirected) {
        return;
      }

      // Case 1: External whitelisted payment/transport URL via query param when path is 'ext'
      if (isExternalUrlCase && externalUrlFromQuery) {
        if (
          isAbsoluteTransportUrl(externalUrlFromQuery) ||
          isAbsolutePaymentUrl(externalUrlFromQuery)
        ) {
          window.location.href = externalUrlFromQuery;
          setRedirected(true);
          return;
        } else {
          history.push("/");
          setRedirected(true);
          return;
        }
      }

      // Case 2: Regular path param redirects
      if (!urlKey) {
        history.push("/");
        setRedirected(true);
        return;
      }

      if (!redirectMap[urlKey]) {
        history.push("/");
        setRedirected(true);
        return;
      }

      const targetConfig = redirectMap[urlKey];

      // External URLs like psn/mp/eap - immediate redirect, no days/availability
      if (typeof targetConfig === "string" && targetConfig.startsWith("http")) {
        window.location.href = targetConfig;
        setRedirected(true);
        return;
      }

      // Non-product routes (like /products/gaming-consoles) - immediate redirect
      if (typeof targetConfig === "string") {
        history.push(targetConfig);
        setRedirected(true);
        return;
      }

      // Product routes with availability check
      if (targetConfig.productId) {
        setProductId(targetConfig.productId);
      }
    };

    performRedirect();
  }, [
    urlKey,
    history,
    redirected,
    unnormalizedUrlKeyParam,
    externalUrlFromQuery,
    isExternalUrlCase,
  ]);

  // Handle product availability check when product is loaded (skip for external redirects)
  useEffect(() => {
    const handleAvailabilityCheck = async () => {
      if (
        isExternalRedirect ||
        !product ||
        isProductLoading ||
        isLoadingAvailability ||
        redirected
      ) {
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
          `Checking availability for product: ${product.name} (${product.id})`,
        );

        const isAvailable = isProductAvailable(product, startDate, endDate);

        if (isAvailable) {
          console.log(
            `Product ${product.name} is available for requested period`,
          );
          dispatch(updateRentalPeriod({ dates: [startDate, endDate], days }));
          history.push(targetConfig.route);
          setRedirected(true);
        } else {
          console.log(
            `Product ${product.name} not available. Finding next available date...`,
          );

          const availableSlots = await getAvailableSlots(product);

          if (availableSlots?.length > 0) {
            const nextAvailableStart = availableSlots[0].start;
            const nextAvailableStartDate = parseDate(nextAvailableStart);
            const nextAvailableEndDate = nextAvailableStartDate.add(
              days,
              "day",
            );

            console.log(
              `Next availability: ${formatDate(
                nextAvailableStartDate,
              )} to ${formatDate(nextAvailableEndDate)}`,
            );

            dispatch(
              updateRentalPeriod({
                dates: [
                  formatDate(nextAvailableStartDate),
                  formatDate(nextAvailableEndDate),
                ],
                days,
              }),
            );
            history.push(targetConfig.route);
            setRedirected(true);
          } else {
            console.warn(`No availability found for ${product.name}`);
            dispatch(updateRentalPeriod({ dates: [startDate, endDate], days }));
            history.push(targetConfig.route);
            setRedirected(true);
          }
        }
      } catch (error) {
        console.error("Error checking availability:", error);
        const startDate = formatDate(dayjs().add(1, "day"));
        const endDate = formatDate(dayjs().add(days + 1, "day"));
        dispatch(updateRentalPeriod({ dates: [startDate, endDate], days }));
        const targetConfig = redirectMap[urlKey];
        if (targetConfig?.route) {
          history.push(targetConfig.route);
        }
        setRedirected(true);
      } finally {
        setIsChecking(false);
      }
    };

    handleAvailabilityCheck();
  }, [
    product,
    isProductLoading,
    isLoadingAvailability,
    productId,
    urlKey,
    days,
    history,
    dispatch,
    redirected,
    isExternalRedirect,
  ]);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "60vh",
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
