import React, { useEffect } from "react";
import dayjs, { formatDate } from "@/helpers/dayjs";
import { useLocation, useHistory } from "react-router-dom";
import { updateRentalPeriod } from "@/redux/actions/miscActions";
import { useDispatch } from "react-redux";

// Function to normalize URL key
const normalizeKey = (key) => {
  if (!key) return "";
  return key
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_") // Spaces → underscores
    .replace(/[+]/g, "_") // + → underscore ezys_webhook_penguin_bot
    .replace(/\./g, "_"); // Dots → underscores (optional)
};

// Mapping of URL keys to target URLs or internal routes
const redirectMap = {
  // External URLs
  psndeluxe:
    "https://www.playstation.com/en-in/ps-plus/games/?category=GAME_CATALOG&category=CLASSICS_CATALOG#plus-container",
  metaplus: "https://www.meta.com/en-gb/experiences/meta-horizon-plus/",
  eaplay: "https://www.ea.com/ea-play/games#playstation",

  // Internal game routes (ps4/ps5 + 100 games)
  ps4_400_games: "/product/playstation4-slim-1-controller-100-games",
  ps5_400_games:
    "/product/playstation5-slim-digital-edition-1-controller-100-games",
  more_consoles: "/products/gaming-consoles",
  meta_quest_3s:
    "/product/meta-quest-3s-128gb-mixed-reality-headset-all-in-one",

  // Specific games (append game name)
  fc24: "/product/ea-sports-fc-24",
  gta_v: "/product/grand-theft-auto-v-ps4",
  more_games: "/products/games-controllers",
};

function ExternalRedirector() {
  const location = useLocation();
  const dispatch = useDispatch();
  const searchParams = new URLSearchParams(location.search);
  const history = useHistory();
  const urlKey = normalizeKey(searchParams.get("p"));
  const days = parseInt(searchParams.get("d")) || 7;

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

  // Perform redirect based on urlKey
  useEffect(() => {
    if (urlKey && redirectMap[urlKey]) {
      const target = redirectMap[urlKey];

      // External URLs use full redirect, internal use navigate
      if (target.startsWith("http")) {
        window.location.href = target;
      } else {
        history.push(target, { days });
      }
    } else {
      // If no valid key, redirect to home
      history.push("/");
    }
  }, [urlKey, history, days]);

  return null;
}

export default ExternalRedirector;
