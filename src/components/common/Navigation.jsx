/* eslint-disable indent */
import { FilterOutlined, ShoppingOutlined } from "@ant-design/icons";
import * as ROUTE from "@/constants/routes";
import logo from "@/images/logo.png";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, NavLink, useLocation } from "react-router-dom";
import UserAvatar from "@/views/account/components/UserAvatar";
import BasketToggle from "../basket/BasketToggle";
import Badge from "./Badge";
import FiltersToggle from "./FiltersToggle";
import MobileNavigation from "./MobileNavigation";
import SearchBar from "./SearchBar";
import Signin from "./SignIn";

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
          <img alt="Logo" src={logo} />
        </Link>
      </div>
      <ul className="navigation-menu-main">
        <li>
          <NavLink
            activeClassName="navigation-menu-active"
            exact
            to={ROUTE.HOME}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            activeClassName="navigation-menu-active"
            to={ROUTE.FEATURED_PRODUCTS}
          >
            Featured
          </NavLink>
        </li>
        <li>
          <NavLink
            activeClassName="navigation-menu-active"
            to={ROUTE.RECOMMENDED_PRODUCTS}
          >
            Recommended
          </NavLink>
        </li>
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
      {pathname === ROUTE.SEARCH && (
        <FiltersToggle>
          <button className="button-muted button-small" type="button">
            Filters &nbsp;
            <FilterOutlined />
          </button>
        </FiltersToggle>
      )}
      <SearchBar />
      <ul className="navigation-menu">
        <li className="navigation-menu-item">
          <BasketToggle>
            {({ onClickToggle }) => (
              <button
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
            <Link
              className="button button-small button-muted margin-left-s"
              onClick={onSignInClick}
            >
              Sign In
            </Link>
          </li>
        )}
      </ul>
      <Signin show={show} onClose={() => setShow(false)} />
    </nav>
  );
};

export default Navigation;
