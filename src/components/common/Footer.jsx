import * as Route from "@/constants/routes";
import {
  YoutubeFilled,
  InstagramFilled,
  LinkedinFilled,
  GoogleCircleFilled,
  FacebookFilled,
} from "@ant-design/icons";
import logo from "@/images/logo.png";
import React from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const Footer = () => {
  const { pathname } = useLocation();
  return (
    <div className="container my-5">
      <div className="footer_head">
        <p>Get connected with us on social networks</p>
        <div className="icons">
          <a href="">
            <YoutubeFilled />
          </a>
          <a href="">
            <GoogleCircleFilled />
          </a>
          <a href="">
            <InstagramFilled />
          </a>
          <a href="">
            <LinkedinFilled />
          </a>
          <a href="">
            <FacebookFilled />
          </a>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-col-1">
          <h6 className="text-uppercase fw-bold">Company name</h6>
          <hr className="mb-4 mt-0 d-inline-block mx-auto" />
          <p>
            Here you can use rows and columns to organize your footer content.
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          </p>
        </div>

        <div className="footer-col-2">
          <h6 className="text-uppercase fw-bold">Navigate</h6>
          <hr className="mb-4 mt-0 d-inline-block mx-auto" />
          <p>
            <a href="#!" className="text-white">
              About Us
            </a>
          </p>
          <p>
            <Link to={Route.FAQ} className="text-white">
              FAQ
            </Link>
          </p>
          <p>
            <a href="#!" className="text-white">
              Terms & Conditions
            </a>
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
          <p>
            <i className="fas fa-home mr-3"></i> New York, NY 10012, US
          </p>
          <p>
            <i className="fas fa-envelope mr-3"></i> info@example.com
          </p>
          <p>
            <i className="fas fa-phone mr-3"></i> + 01 234 567 88
          </p>
          <p>
            <i className="fas fa-print mr-3"></i> + 01 234 567 89
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
