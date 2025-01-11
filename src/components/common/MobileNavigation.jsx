import { BasketToggle } from "@/components/basket";
import { HOME } from "@/constants/routes";
import PropType from "prop-types";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import UserNav from "@/views/account/components/UserAvatar";
import Badge from "./Badge";
import SearchBar from "./SearchBar";
import Signin from "./SignIn";

const Navigation = (props) => {
  const [show, setShow] = useState(false);
  const { isAuthenticating, basketLength, disabledPaths, user } = props;
  const { pathname } = useLocation();

  const onClickLink = (e) => {
    if (isAuthenticating) e.preventDefault();
  };

  const onSignInClick = (e) => {
    e.preventDefault();
    setShow(true);
  };

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
                <i
                  className="fa fa-shopping-bag"
                  style={{ fontSize: "2rem" }}
                />
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
              <Link className="navigation-menu-link" onClick={onSignInClick}>
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
};

export default Navigation;
