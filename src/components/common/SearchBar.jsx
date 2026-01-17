/* eslint-disable react/no-array-index-key */
import { SearchOutlined } from "@ant-design/icons";
import React, {
  useRef,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import * as ROUTE from "@/constants/routes";
import { DatePicker, Divider, Space, Input, Tag } from "antd";
import { updateRentalPeriod } from "@/redux/actions/miscActions";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import dayjs, {
  formatDate,
  parseDate,
  DEFAULT_DATE_FORMAT,
} from "@/helpers/dayjs";
import {
  clearRecentSearch,
  removeSelectedRecent,
} from "@/redux/actions/filterActions";

const { RangePicker } = DatePicker;

const SAME_DAY_DELIVERY_CUTOFF_HOUR = 17; // 5 PM
const SAME_DAY_DELIVERY_CHARGE = 199;

const disabledDate = (current) => {
  // Get today's date in IST
  const today = dayjs().startOf("day");
  // Get max allowed date (2 months from today for advance booking)
  const maxAdvanceDate = dayjs().startOf("day").add(2, "month");

  // Normalize current date to start of day
  const normalizedCurrent = current?.startOf("day");

  // Disable dates before today and after max advance date
  return (
    normalizedCurrent &&
    (normalizedCurrent < today || normalizedCurrent > maxAdvanceDate)
  );
};

const allowedPathPatterns = [
  { path: ROUTE.HOME, exact: true },
  { path: ROUTE.PRODUCTS_BY_CATEGORY, pattern: /^\/products\/.+/ },
  { path: ROUTE.SEARCH, pattern: /^\/search\/.+/ },
  { path: ROUTE.VIEW_PRODUCT, pattern: /^\/product\/.+/ },
];

const isPathAllowed = (currentPath) => {
  return allowedPathPatterns.some(({ path, pattern, exact }) =>
    exact
      ? path === currentPath
      : pattern
      ? pattern.test(currentPath)
      : path === currentPath
  );
};

const SearchBar = () => {
  const [searchInput, setSearchInput] = useState("");
  const { pathname } = useLocation();
  const [customDisabledDate, setCustomDisabledDate] = useState(
    () => disabledDate
  );
  const { filter, isLoading, rentalPeriod } = useSelector((state) => ({
    filter: state.filter,
    isLoading: state.app.loading,
    rentalPeriod: state.app.rentalPeriod,
  }));
  const searchbarRef = useRef(null);
  const history = useHistory();

  const dispatch = useDispatch();
  const isMobile = window.screen.width <= 800;

  // Check if same-day delivery is available
  const isSameDayDeliveryAvailable = useCallback(() => {
    const now = dayjs();
    return now.hour() < SAME_DAY_DELIVERY_CUTOFF_HOUR;
  }, []);

  const onSearchChange = (e) => {
    const val = e.target.value.trimStart();
    setSearchInput(val);
  };

  const onKeyUp = (e) => {
    if (e.keyCode === 13) {
      e.target.blur();
      searchbarRef.current.classList.remove("is-open-recent-search");

      if (isMobile) {
        history.push("/");
      }

      history.push(`/search/${searchInput.trim().toLowerCase()}`);
    }
  };

  const recentSearchClickHandler = (e) => {
    const searchBar = e.target.closest(".searchbar");

    if (!searchBar) {
      searchbarRef.current.classList.remove("is-open-recent-search");
      document.removeEventListener("click", recentSearchClickHandler);
    }
  };

  const onFocusInput = (e) => {
    e.target.select();

    if (filter.recent.length !== 0) {
      searchbarRef.current.classList.add("is-open-recent-search");
      document.addEventListener("click", recentSearchClickHandler);
    }
  };

  // Initialize the default start date
  useEffect(() => {
    const today = dayjs().startOf("day");
    const maxRentalDate = today.clone().add(30, "day").endOf("day");

    setCustomDisabledDate(() => (current) => {
      const normalizedCurrent = current?.startOf("day");
      return (
        disabledDate(normalizedCurrent) || // Apply original disabled date rules
        (normalizedCurrent &&
          (normalizedCurrent < today || // Disable dates before today
            normalizedCurrent > maxRentalDate || // Disable dates beyond 30 days from today
            (normalizedCurrent.isSame(today) && !isSameDayDeliveryAvailable()))) // Disable today if cutoff time has passed
      );
    });
  }, [isSameDayDeliveryAvailable]);

  const onRangeChange = useCallback(
    (dates, dateStrings) => {
      if (!dates || dates.length === 0) {
        setCustomDisabledDate(disabledDate);
        return;
      }

      const [startDate, endDate] = dates.map((date) =>
        date ? date.startOf("day") : null
      );

      if (startDate) {
        const maxRentalDate = startDate.clone().add(30, "day").endOf("day");

        setCustomDisabledDate(() => (current) => {
          const normalizedCurrent = current?.startOf("day");
          return (
            disabledDate(normalizedCurrent) || // Apply original disabled date rules
            (normalizedCurrent &&
              (normalizedCurrent < startDate.clone().subtract(30, "day") || // Disable dates before 30 days prior
                normalizedCurrent > maxRentalDate || // Disable dates beyond 30 days from startDate
                (normalizedCurrent.isSame(startDate) &&
                  !isSameDayDeliveryAvailable()))) // Disable today if cutoff time has passed
          );
        });
      }

      if (startDate && endDate) {
        // Check if same-day delivery is selected
        const today = dayjs().startOf("day");
        const isSameDayDeliverySelected = startDate.isSame(today);

        dispatch(
          updateRentalPeriod({
            dates: [
              formatDate(startDate.startOf("day")),
              formatDate(endDate.startOf("day")),
            ],
            days: Math.abs(
              endDate.startOf("day").diff(startDate.startOf("day"), "days")
            ),
            isSameDayDelivery: isSameDayDeliverySelected,
            sameDayDeliveryCharge: isSameDayDeliverySelected
              ? SAME_DAY_DELIVERY_CHARGE
              : 0,
          })
        );
      }
    },
    [isSameDayDeliveryAvailable]
  );

  const onClickRecentSearch = (keyword) => {
    searchbarRef.current.classList.remove("is-open-recent-search");
    history.push(`/search/${keyword.trim().toLowerCase()}`);
  };

  const onClearRecent = () => {
    dispatch(clearRecentSearch());
  };

  const memoizedDisabledDate = useMemo(
    () => customDisabledDate,
    [customDisabledDate]
  );

  const cellRender = (current, info) => {
    if (info.type !== "date") {
      return info.originNode;
    }
    if (typeof current === "number" || typeof current === "string") {
      return <div className="ant-picker-cell-inner">{current}</div>;
    }

    const today = dayjs().startOf("day");
    const isSameDayDeliveryAvail = isSameDayDeliveryAvailable();
    return (
      <div
        className="ant-picker-cell-inner"
        style={
          current.date() === today.date() && isSameDayDeliveryAvail
            ? { color: "rgb(228, 165, 31)", position: "relative" }
            : {}
        }
      >
        {current.date()}
        {current.date() === today.date() && isSameDayDeliveryAvail && (
          <div
            style={{
              fontSize: "8px",
              position: "absolute",
              left: 2,
              top: 17,
            }}
          >{`₹${SAME_DAY_DELIVERY_CHARGE}`}</div>
        )}
      </div>
    );
  };

  if (!isPathAllowed(pathname)) return null;

  return (
    <div className="searchbar" ref={searchbarRef}>
      <Space.Compact block style={{ zIndex: 0 }}>
        <RangePicker
          style={{ flex: 3.5 }}
          dropdownClassName="responsive-range-picker"
          allowClear={false}
          value={
            rentalPeriod.dates
              ? [
                  parseDate(rentalPeriod.dates[0]),
                  parseDate(rentalPeriod.dates[1]),
                ]
              : null
          }
          prefix="Rental Period"
          disabledDate={memoizedDisabledDate}
          format="DD-MMM"
          onChange={onRangeChange}
          onCalendarChange={onRangeChange}
          cellRender={cellRender}
        />

        <Input.Search
          onChange={onSearchChange}
          style={{ flex: 2 }}
          onKeyUp={onKeyUp}
          onFocus={onFocusInput}
          placeholder="Search product..."
          readOnly={isLoading}
          value={searchInput}
        />
      </Space.Compact>

      {filter.recent.length !== 0 && (
        <div className="searchbar-recent">
          <div className="searchbar-recent-header">
            <h5>Recent Search</h5>
            <h5
              className="searchbar-recent-clear text-subtle"
              onClick={onClearRecent}
              role="presentation"
            >
              Clear
            </h5>
          </div>
          {filter.recent.map((item, index) => (
            <div
              className="searchbar-recent-wrapper"
              key={`search-${item}-${index}`}
            >
              <h5
                className="searchbar-recent-keyword margin-0"
                onClick={() => onClickRecentSearch(item)}
                role="presentation"
              >
                {item}
              </h5>
              <span
                className="searchbar-recent-button text-subtle"
                onClick={() => dispatch(removeSelectedRecent(item))}
                role="presentation"
              >
                X
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
