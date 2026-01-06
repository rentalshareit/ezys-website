/* eslint-disable indent */
import { FilterOutlined, ShoppingOutlined } from "@ant-design/icons";
import * as ROUTE from "@/constants/routes";
import logo from "@/images/ezys-logo.png";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Select, Button } from "antd";
import UserAvatar from "@/views/account/components/UserAvatar";
import HideOOSToggle from "@/components/misc/HideOOSToggle";
import BasketToggle from "../basket/BasketToggle";
import Badge from "./Badge";
import MobileNavigation from "./MobileNavigation";
import SearchBar from "./SearchBar";
import Signin from "./SignIn";
import LocationDisplay from "./LocationDisplay";

const ADMIN_ROUTES = [
  ROUTE.ADMIN_DASHBOARD,
  ROUTE.ADMIN_PRODUCTS,
  ROUTE.ADMIN_USERS,
  ROUTE.ADD_PRODUCT,
  ROUTE.EDIT_PRODUCT,
];

const Navigation = () => {
  const navbar = useRef(null);
  const { pathname } = useLocation();
  const [show, setShow] = useState(false);

  const store = useSelector((state) => ({
    basketLength: state.basket.length,
    user: state.auth,
    isAuthenticating: state.app.isAuthenticating,
    authStatus: state.app.authStatus,
    isLoading: state.app.loading,
  }));

  const scrollHandler = () => {
    if (navbar.current && window.screen.width > 480) {
      if (window.pageYOffset >= 70) {
        navbar.current.classList.add("is-nav-scrolled");
      } else {
        navbar.current.classList.remove("is-nav-scrolled");
      }
    }
  };

  useEffect(() => {
    if (store.authStatus?.success && show) {
      setShow(false);
    }
  }, [store.authStatus]);

  useEffect(() => {
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, []);

  const onSignInClick = (e) => {
    e.preventDefault();
    setShow(true);
  };

  const allowedPathPatternsForStockToggle = [
    { path: ROUTE.HOME, exact: true },
    { path: ROUTE.PRODUCTS_BY_CATEGORY, pattern: /^\/products\/.+/ },
    { path: ROUTE.SEARCH, pattern: /^\/search\/.+/ },
  ];

  const isPathAllowedForStockToggle = (currentPath) => {
    return allowedPathPatternsForStockToggle.some(({ path, pattern, exact }) =>
      exact
        ? path === currentPath
        : pattern
        ? pattern.test(currentPath)
        : path === currentPath
    );
  };

  // disable the basket toggle to these pathnames
  const basketDisabledpathnames = [
    ROUTE.CHECKOUT_STEP_1,
    ROUTE.CHECKOUT_STEP_2,
    ROUTE.CHECKOUT_STEP_3,
  ];

  // No navigation for admin routes
  if (ADMIN_ROUTES.includes(pathname)) return null;

  if (window.screen.width <= 800) {
    return (
      <MobileNavigation
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...store}
        disabledPaths={basketDisabledpathnames}
        pathname={pathname}
      />
    );
  }
  return (
    <nav className="navigation" ref={navbar}>
      <div className="logo">
        <Link to="/">
          <svg
            width="60"
            height="60"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="10"
              y1="10"
              x2="80"
              y2="10"
              stroke="#1C8C80"
              stroke-width="10"
              stroke-linecap="round"
            />

            <line
              x1="10"
              y1="190"
              x2="80"
              y2="190"
              stroke="#1C8C80"
              stroke-width="10"
              stroke-linecap="round"
            />
            <line
              x1="120"
              y1="190"
              x2="190"
              y2="190"
              stroke="#1C8C80"
              stroke-width="10"
              stroke-linecap="round"
            />

            <line
              x1="10"
              y1="10"
              x2="10"
              y2="80"
              stroke="#1C8C80"
              stroke-width="10"
              stroke-linecap="round"
            />
            <line
              x1="10"
              y1="120"
              x2="10"
              y2="190"
              stroke="#1C8C80"
              stroke-width="10"
              stroke-linecap="round"
            />

            <line
              x1="190"
              y1="120"
              x2="190"
              y2="190"
              stroke="#1C8C80"
              stroke-width="10"
              stroke-linecap="round"
            />
            <image
              href={logo}
              x="35"
              y="35"
              width="130"
              height="130"
              preserveAspectRatio="xMidYMid meet"
            />
          </svg>
        </Link>
      </div>
      <ul className="navigation-menu-main">
        {!!store.user && store.user.role === "ADMIN" && (
          <li>
            <NavLink
              activeClassName="navigation-menu-active"
              to={ROUTE.ADMIN_DASHBOARD}
            >
              Admin Dashboard
            </NavLink>
          </li>
        )}
      </ul>

      <SearchBar />
      <ul className="navigation-menu">
        <li className="navigation-menu-item">
          <BasketToggle>
            {({ onClickToggle }) => (
              <button
                id="btn-basket-toggle"
                className="button-link navigation-menu-link basket-toggle"
                disabled={basketDisabledpathnames.includes(pathname)}
                onClick={onClickToggle}
                type="button"
              >
                <Badge count={store.basketLength}>
                  <ShoppingOutlined style={{ fontSize: "2.4rem" }} />
                </Badge>
              </button>
            )}
          </BasketToggle>
        </li>
        {store.user ? (
          <li className="navigation-menu-item">
            <UserAvatar />
          </li>
        ) : (
          <li className="navigation-action">
            <Button type="primary" onClick={onSignInClick}>
              Sign In
            </Button>
          </li>
        )}
        <li className="navigation-action" style={{ marginLeft: "1rem" }}>
          <LocationDisplay />
        </li>
        {isPathAllowedForStockToggle(pathname) && (
          <li className="navigation-action" style={{ marginLeft: "1rem" }}>
            <HideOOSToggle />
          </li>
        )}
      </ul>
      <Signin
        show={show}
        onClose={() => {
          window.confirmationResult = null; // Clear confirmation result
          setShow(false);
        }}
      />
    </nav>
  );
};

export default Navigation;
