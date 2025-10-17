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
  if (!product || !product.price || !rentalPeriod) return [0, 0];

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

export const calculateTotal = (basket, rentalPeriod, format = false) => {
  if (!basket || basket?.length === 0) return format ? displayMoney(0) : 0;

  const prices = basket.map((product) => {
    const [original, discounted] = calculateProductPrice(product, rentalPeriod);
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

export function formatCategory(category) {
  // 1. Convert to lowercase
  let normalized = category.toLowerCase();

  // 2. Replace spaces with underscores
  normalized = normalized.replace(/ /g, "_");

  // 3. Remove any characters that are NOT lowercase letters (a-z), digits (0-9), or underscores (_)
  //    This step also takes care of converting non-alphanumeric special characters
  //    that might become underscores (like multiple hyphens becoming multiple underscores)
  //    into a single underscore after the next step.
  normalized = normalized.replace(/[^a-z0-9_]/g, "");

  // 4. Reduce multiple consecutive underscores to a single underscore
  //    The regex /__+/g means:
  //    - __: Matches two underscores literally
  //    - +: Matches one or more of the preceding character (so, two or more underscores)
  //    - g: Global flag (replace all occurrences)
  normalized = normalized.replace(/__+/g, "_");

  // Optional: Remove leading/trailing underscores if you don't want them
  // This is often desired for clean "slugs"
  // normalized = normalized.replace(/^_|_$/g, '');

  return normalized;
}

export function calculateElementsThatFit(
  elementWidth,
  gapBetweenElements = 0, // New parameter for the gap
  category
) {
  const viewportWidth = document.querySelector(
    `#${formatCategory(category)}_display`
  )?.clientWidth;

  // 1. Calculate the total occupied width of a single element (excluding the gap)
  // This is the content width + left padding + right padding + left margin + right margin
  const individualElementVisualWidth = elementWidth;

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

export function formatProductPrice(price) {
  return price
    .replace(/\[|\]/g, "")
    .split(",")
    .map((a) => parseInt(a.trim()));
}

/**
 * Checks if a product name contains at least three consecutive characters from a search text,
 * maintaining their relative order. The comparison is case-insensitive.
 *
 * @param {string} productName The name of the product.
 * @param {string} searchText The text to search for within the product name.
 * @returns {boolean} True if at least three consecutive characters from the search text
 * are found in order within the product name, false otherwise.
 */
export function containsThreeConsecutiveOrderedChars(productName, searchText) {
  // Convert both strings to lowercase for case-insensitive comparison
  const productLower = productName.toLowerCase();
  const searchLower = searchText.toLowerCase();

  // If the search text itself is shorter than 3 characters, it's impossible to find 3 consecutive matches.
  if (searchLower.length < 3) {
    return false;
  }

  let consecutiveMatchCount = 0;
  let searchIndex = 0;

  // Iterate through each character of the product name
  for (let i = 0; i < productLower.length; i++) {
    const pChar = productLower[i];

    // Check if the current product character matches the character we're looking for
    // in the search text's current position.
    if (
      searchIndex < searchLower.length &&
      pChar === searchLower[searchIndex]
    ) {
      consecutiveMatchCount++;
      searchIndex++;
    } else {
      // If the match breaks, reset the consecutive count and search index.
      // Then, immediately check if the current product character can start a new sequence
      consecutiveMatchCount = 0;
      searchIndex = 0;

      // If the current product character matches the first character of the search text,
      // start a new consecutive count.
      if (pChar === searchLower[0]) {
        consecutiveMatchCount = 1;
        searchIndex = 1;
      }
    }

    // If we've found 3 or more consecutive matching characters, return true
    if (consecutiveMatchCount >= 3) {
      return true;
    }
  }

  // If the loop finishes and we haven't found at least 3 consecutive matches, return false
  return false;
}
