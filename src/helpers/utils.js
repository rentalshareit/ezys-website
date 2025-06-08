/* eslint-disable no-nested-ternary */
export const displayDate = (timestamp) => {
  const date = new Date(timestamp);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  // return day + ' ' + monthNames[monthIndex] + ' ' + year;
  return `${monthNames[monthIndex]} ${day}, ${year}`;
};

export const displayMoney = (n) => {
  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
  });

  // or use toLocaleString()
  return format.format(n);
};

export const calculateProductPrice = (
  product,
  rentalPeriod,
  format = false
) => {
  if (!product || !rentalPeriod) return 0;

  const price = parseInt(product.price[rentalPeriod - 1]);
  const discount = product.discount || 0;

  // Calculate the final price after discount
  const finalPrice = price - (price * discount) / 100;

  const originalPrice = price * product.quantity;
  const discountedPrice = finalPrice * product.quantity;

  if (format) {
    return [
      displayMoney(originalPrice.toFixed(2)),
      displayMoney(discountedPrice.toFixed(2)),
    ];
  }

  return [Number(originalPrice.toFixed(2)), Number(discountedPrice.toFixed(2))];
};

export const calculateTotal = (basket, format = false) => {
  if (!basket || basket?.length === 0) return format ? displayMoney(0) : 0;

  const prices = basket.map((product) => {
    const [original, discounted] = calculateProductPrice(
      product,
      product.period.days
    );
    if (product.discount) return discounted;
    return original;
  });

  const total = prices.reduce((acc, val) => acc + val, 0);

  if (format) {
    return displayMoney(total.toFixed(2));
  }
  return Number(total.toFixed(2));
};

export function waitForGlobal(name, timeout = 300) {
  return new Promise((resolve, reject) => {
    let waited = 0;

    function wait(interval) {
      setTimeout(() => {
        waited += interval;
        // some logic to check if script is loaded
        // usually it something global in window object
        if (window[name] !== undefined) {
          return resolve();
        }
        if (waited >= timeout * 1000) {
          return reject({ message: "Timeout" });
        }
        wait(interval * 2);
      }, interval);
    }

    wait(30);
  });
}

export function calculateElementsThatFit(
  elementWidth,
  elementPaddingLeft = 0,
  elementPaddingRight = 0,
  elementMarginLeft = 0,
  elementMarginRight = 0,
  gapBetweenElements = 0 // New parameter for the gap
) {
  const viewportWidth = window.innerWidth;

  // 1. Calculate the total occupied width of a single element (excluding the gap)
  // This is the content width + left padding + right padding + left margin + right margin
  const individualElementVisualWidth =
    elementWidth +
    elementPaddingLeft +
    elementPaddingRight +
    elementMarginLeft +
    elementMarginRight;

  // If there's no gap, or if the individual element already includes all spacing,
  // we might want to handle it slightly differently.
  // For this function, `gapBetweenElements` is distinct from individual margins.

  let numberOfElements = 0;

  // Edge case: If an element is wider than the viewport, 0 or 1 element can fit
  if (individualElementVisualWidth > viewportWidth) {
    return individualElementVisualWidth <= viewportWidth ? 1 : 0;
  }

  // Calculate based on the idea that each element takes its width + a gap,
  // except for the last one.
  // Let 'N' be the number of elements.
  // Total space = N * individualElementVisualWidth + (N - 1) * gapBetweenElements
  // Total space = N * individualElementVisualWidth + N * gapBetweenElements - gapBetweenElements
  // Total space = N * (individualElementVisualWidth + gapBetweenElements) - gapBetweenElements

  // We want to find N such that:
  // N * (individualElementVisualWidth + gapBetweenElements) - gapBetweenElements <= viewportWidth
  // N * (individualElementVisualWidth + gapBetweenElements) <= viewportWidth + gapBetweenElements
  // N <= (viewportWidth + gapBetweenElements) / (individualElementVisualWidth + gapBetweenElements)

  // This formula accounts for the fact that the last element doesn't have a gap *after* it.
  numberOfElements = Math.floor(
    (viewportWidth + gapBetweenElements) /
      (individualElementVisualWidth + gapBetweenElements)
  );

  // One final check: Ensure we don't return a negative number if viewport is tiny or elements are huge.
  return Math.max(0, numberOfElements);
}
