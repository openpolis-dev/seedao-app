import React, { useState } from 'react';
import './ContactAssistant.css';
import {X} from "lucide-react"
import { useTranslation } from "react-i18next";
import { HELPER } from "../utils/constant";
import WechatImg from "../assets/Imgs/wechat/wechat.jpg";
import styled from "styled-components";



const ContactAssistant = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation();

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`contact-assistant-container ${isExpanded ? 'expanded' : ''}`}>
      {!isExpanded ? (
        <button
          className="vertical-button"
          onClick={toggleExpand}
        >
          {t("helper")}
        </button>
      ) : (
        <>
          <button
            className="close-button"
            onClick={toggleExpand}
          >
            <X size={20} />
          </button>
          <div className="contact-details">
            <h4>{t("helper")}</h4>
            <div className="contact-method">
              <div className="flexLine">
                <strong>{t("wechat")}</strong>
                <span>Fatfingererr2022</span>
              </div>

              <div className="box">
                <img
                  src={WechatImg}
                  className="qr-code"
                />
              </div>

            </div>
            <div className="flexLine"> <strong>技术助手微信：</strong>Gxx320</div>
            {/*<div className="contact-method">*/}
            {/*  <strong>{t("email")}</strong>*/}
            {/*  <a href={`mailto:${HELPER.mail}`}>{HELPER.mail}</a>*/}
            {/*</div>*/}
          </div>
        </>
      )}
    </div>
  );
};

export default ContactAssistant;
