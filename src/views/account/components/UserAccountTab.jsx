/* eslint-disable indent */
import { ImageLoader } from "@/components/common";
import { ACCOUNT_EDIT } from "@/constants/routes";
import { displayDate } from "@/helpers/utils";
import PropType from "prop-types";
import React from "react";
import { useSelector } from "react-redux";
import { withRouter } from "react-router-dom";

const UserProfile = (props) => {
  const profile = useSelector((state) => state.profile);

  return (
    <div className="user-profile">
      <div className="user-profile-block">
        <div className="user-profile-banner">
          <div className="user-profile-banner-wrapper">
            <ImageLoader
              alt="Banner"
              className="user-profile-banner-img"
              src={profile.banner}
            />
          </div>
          <div className="user-profile-avatar-wrapper">
            <ImageLoader
              alt="Avatar"
              className="user-profile-img"
              src={profile.avatar}
            />
          </div>
          <button
            className="button button-small user-profile-edit"
            onClick={() => props.history.push(ACCOUNT_EDIT)}
            type="button"
          >
            Edit Account
          </button>
        </div>
        <div className="user-profile-details">
          <h3 className="user-profile-name">{profile.fullname}</h3>
          <span>Email</span>
          <h6 className="text-subtle">{profile.email}</h6>
          <br />

          <span>Address</span>
          <br />
          {profile.address ? (
            <h6 className="text-subtle">{profile.address}</h6>
          ) : (
            <h6 className="text-subtle text-italic">Address not set</h6>
          )}
          <br />

          <span>Mobile</span>
          <br />
          {profile.mobile ? (
            <h6 className="text-subtle">{profile.mobile.value}</h6>
          ) : (
            <h6 className="text-subtle text-italic">Mobile not set</h6>
          )}
          <br />

          <span>Date Joined</span>
          <br />
          {profile.dateJoined ? (
            <h6 className="text-subtle">{displayDate(profile.dateJoined)}</h6>
          ) : (
            <h6 className="text-subtle text-italic">Not available</h6>
          )}
        </div>
      </div>
    </div>
  );
};

UserProfile.propTypes = {
  history: PropType.shape({
    push: PropType.func,
  }).isRequired,
};

export default withRouter(UserProfile);
