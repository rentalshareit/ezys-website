import { BasketToggle } from "@/components/basket";
import { ShoppingOutlined } from "@ant-design/icons";
import { HOME } from "@/constants/routes";
import PropType from "prop-types";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import UserNav from "@/views/account/components/UserAvatar";
import logo from "@/images/ezys-logo.png";
import Badge from "./Badge";
import SearchBar from "./SearchBar";
import Signin from "./SignIn";
import LocationDisplay from "./LocationDisplay";

const Navigation = (props) => {
  const [show, setShow] = useState(false);
  const { isAuthenticating, basketLength, disabledPaths, user, authStatus } =
    props;
  const { pathname } = useLocation();

  const onClickLink = (e) => {
    if (isAuthenticating) e.preventDefault();
  };

  const onSignInClick = (e) => {
    e.preventDefault();
    setShow(true);
  };

  useEffect(() => {
    if (authStatus?.success && show) {
      setShow(false);
    }
  }, [authStatus]);

  return (
    <nav className="mobile-navigation">
      <div className="mobile-navigation-main">
        <div className="mobile-navigation-logo">
          <div className="logo">
            <Link to="/">
              <svg
                width="50"
                height="50"
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
        </div>

        <BasketToggle>
          {({ onClickToggle }) => (
            <button
              id="btn-basket-toggle"
              className="button-link navigation-menu-link basket-toggle"
              onClick={onClickToggle}
              disabled={disabledPaths.includes(pathname)}
              type="button"
            >
              <Badge count={basketLength}>
                <ShoppingOutlined style={{ fontSize: "2.4rem" }} />
              </Badge>
            </button>
          )}
        </BasketToggle>
        <ul className="mobile-navigation-menu">
          {user ? (
            <li className="mobile-navigation-item">
              <UserNav />
            </li>
          ) : (
            <li className="mobile-navigation-item">
              <Link
                className="button button-small button-muted margin-left-s"
                onClick={onSignInClick}
              >
                Sign In
              </Link>
            </li>
          )}
          <li className="navigation-action" style={{ marginLeft: "1rem" }}>
            <LocationDisplay />
          </li>
        </ul>
      </div>
      <div className="mobile-navigation-sec">
        <SearchBar />
      </div>
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

Navigation.propTypes = {
  isAuthenticating: PropType.bool.isRequired,
  basketLength: PropType.number.isRequired,
  disabledPaths: PropType.arrayOf(PropType.string).isRequired,
  user: PropType.oneOfType([PropType.bool, PropType.object]).isRequired,
  authStatus: PropType.objectOf({}).isRequired,
};

export default Navigation;
