import * as Route from "@/constants/routes";
import {
  YoutubeFilled,
  InstagramFilled,
  LinkedinFilled,
  GoogleCircleFilled,
  FacebookFilled,
  PhoneFilled,
  WhatsAppOutlined,
  MailOutlined,
} from "@ant-design/icons";
import logo from "@/images/logo.png";
import React from "react";
import { useLocation, Link } from "react-router-dom";

const Footer = () => {
  const { pathname } = useLocation();
  return (
    <div className="container my-5">
      <div className="footer_head">
        <p>Get connected with us on social networks</p>
        <div className="icons">
          <a
            href="https://youtube.com/@ezys_ezys?si=mL4VXCzwah0CY34s"
            target="_blank"
          >
            <YoutubeFilled />
          </a>
          <a href="https://www.instagram.com/ezyshare.in/" target="_blank">
            <InstagramFilled />
          </a>
          <a href="https://www.linkedin.com/company/ezys/" target="_blank">
            <LinkedinFilled />
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61557265544552"
            target="_blank"
          >
            <FacebookFilled />
          </a>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-col-1">
          <h6 className="text-uppercase fw-bold">
            Ezys, A BMSA Technologies Venture
          </h6>
          <hr className="mb-4 mt-0 d-inline-block mx-auto" />
          <p>
            offers premium gaming & VR rentals like PS4, PS5, Meta Quest VR and
            many more. Enjoy flexible plans, doorstep delivery, and unmatched
            convenience for top-tier entertainment.
          </p>
        </div>

        <div className="footer-col-2">
          <h6 className="text-uppercase fw-bold">Navigate</h6>
          <hr className="mb-4 mt-0 d-inline-block mx-auto" />
          <p>
            <Link to={Route.ABOUT_US} className="text-white">
              About Us
            </Link>
          </p>
          <p>
            <Link to={Route.FAQ} className="text-white">
              FAQ
            </Link>
          </p>
          <p>
            <Link to={Route.TERMS} className="text-white">
              Terms & Conditions
            </Link>
          </p>
        </div>

        <div className="footer-col-3">
          <h6 className="text-uppercase fw-bold">Policy</h6>
          <hr className="mb-4 mt-0 d-inline-block mx-auto" />
          <p>
            <Link to={Route.SHIPPING} className="text-white">
              Shipping Policy
            </Link>
          </p>
          <p>
            <Link to={Route.PRIVACY} className="text-white">
              Privacy Policy
            </Link>
          </p>
          <p>
            <Link to={Route.DAMAGE} className="text-white">
              Damage Policy
            </Link>
          </p>
          <p>
            <Link to={Route.CANCELLATION} className="text-white">
              Cancellation Policy
            </Link>
          </p>
        </div>

        <div className="footer-col-4">
          <h6 className="text-uppercase fw-bold">Contact</h6>
          <hr className="mb-4 mt-0 d-inline-block mx-auto" />
          <p
            style={{ display: "flex", gap: "5px", justifyContent: "flex-end" }}
          >
            BMSA TECHNOLOGIES PRIVATE LIMITED, F-2, F/F, Plot No-9, Sector - 9,
            Judge Colony, VAISHALI, Ghaziabad, Uttar Pradesh, India, 201010
          </p>
          <p
            style={{ display: "flex", gap: "5px", justifyContent: "flex-end" }}
          >
            <MailOutlined />
            contact@ezyshare.in
          </p>
          <p
            style={{ display: "flex", gap: "5px", justifyContent: "flex-end" }}
          >
            <PhoneFilled /> +91 80694 09278
          </p>
          <p
            style={{ display: "flex", gap: "5px", justifyContent: "flex-end" }}
          >
            <WhatsAppOutlined /> +91 90324 77570
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
