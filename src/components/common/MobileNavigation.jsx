import { BasketToggle } from "@/components/basket";
import { ShoppingOutlined } from "@ant-design/icons";
import { HOME } from "@/constants/routes";
import PropType from "prop-types";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import UserNav from "@/views/account/components/UserAvatar";
import Badge from "./Badge";
import SearchBar from "./SearchBar";
import Signin from "./SignIn";

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
          <Link onClick={onClickLink} to={HOME}>
            <h2>Ezys</h2>
          </Link>
        </div>

        <BasketToggle>
          {({ onClickToggle }) => (
            <button
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
        </ul>
      </div>
      <div className="mobile-navigation-sec">
        <SearchBar />
      </div>
      <Signin show={show} onClose={() => setShow(false)} />
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
