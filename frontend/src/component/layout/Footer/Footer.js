import React from "react";
import playStore from "../../../images/playstore.png";
import appStore from "../../../images/Appstore.png";
import "./Footer.css";

const Footer = () => {
  return (
    <footer id="footer">
      <div className="leftFooter">
        <h4>DOWNLOAD OUR APP</h4>
        <p>Download App for Android and IOS mobile phone</p>
        <img src={playStore} alt="playstore" />
        <img src={appStore} alt="Appstore" />
      </div>

      <div className="midFooter">
        <h1>ECOMMERCE.</h1>
        <p>We priority Quality over Quantity</p>

        <p>Copyrights 2021 &copy; Sardar Tariq Aziz</p>
      </div>

      <div className="rightFooter">
        <h4>Follow Us</h4>
        <a href="https://instagram.com/me_taarriiqqq">Instagram</a>
        <a href="https://www.youtube.com/channel/UCPvLKn1FE0GT90SAY8GWNoA">Youtube</a>
        <a href="https://www.facebook.com/tariqaziz.sardar">Facebook</a>
      </div>
    </footer>
  );
};

export default Footer;