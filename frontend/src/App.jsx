
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "./pages/login.jsx";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/dashboard.jsx";

import Expos from "./pages/Expos";
import ExpoDetails from "./pages/ExpoDetails";
import MyRegistrations from "./pages/MyRegistrations";
import Sessions from "./pages/Sessions";
import Exhibitors from "./pages/Exhibitors";
import ExhibitorDetails from "./pages/ExhibitorDetails";
import Messages from "./pages/Messages";
import Feedback from "./pages/Feedback";
import Notifications from "./pages/Notifications";
import Analytics from "./pages/Analytics";
import Products from "./pages/Products";
import Staff from "./pages/Staff";
import Booths from "./pages/Booths";
import Schedules from "./pages/Schedules";
import Bookmarks from "./pages/Bookmarks";

import ProtectedRoute from "./components/ProtectedRoute";

/* =========================================================
   LANDING PAGE
========================================================= */

function LandingPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  // Scroll reveal animation
  useEffect(() => {
    const elements = document.querySelectorAll(
      ".es-page .anim-reveal"
    );

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      elements.forEach((element) =>
        element.classList.add("is-visible")
      );
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  // Four powerful features
  const features = [
    {
      number: "01",
      icon: "◈",
      title: "Expo Management",
      text: "Create expos, manage exhibitors, organize booths and keep every part of your exhibition connected.",
      link: "/expos",
    },
    {
      number: "02",
      icon: "✦",
      title: "Event Registration",
      text: "Make event registration simple with organized attendee information and a seamless registration experience.",
      link: "/my-registrations",
    },
    {
      number: "03",
      icon: "▦",
      title: "Exhibitor Management",
      text: "Manage exhibitors, booth assignments and event participation from one convenient workspace.",
      link: "/exhibitors",
    },
    {
      number: "04",
      icon: "⌁",
      title: "Smart Analytics",
      text: "Track event performance, explore useful insights and make smarter decisions for future events.",
      link: "/analytics",
    },
  ];

  const projects = [
    {
      title: "Tech & Innovation Expo",
      tag: "EXPO",
      image:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=85",
    },
    {
      title: "Business Leadership Summit",
      tag: "EVENT",
      image:
        "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1000&q=85",
    },
    {
      title: "Future AI Conference",
      tag: "CONFERENCE",
      image:
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=85",
    },
  ];

  const journey = [
    ["01", "Create", "Build your expo or event and define the experience."],
    ["02", "Organize", "Manage exhibitors, booths, sessions and products."],
    ["03", "Connect", "Bring attendees, teams and exhibitors together."],
    ["04", "Grow", "Use registrations and insights to improve your next event."],
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Event Organizer",
      quote:
        "EventSphere made our planning much easier. Everything feels connected and simple.",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    },
    {
      name: "Michael Chen",
      role: "Exhibitor",
      quote:
        "Our expo presence, products and participation are finally easy to manage in one place.",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    },
    {
      name: "Emily Davis",
      role: "Attendee",
      quote:
        "Sessions, registrations and event information are all available without the usual hassle.",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    },
  ];

  const styles = `
    * {
      box-sizing: border-box;
    }

    html {
      scroll-behavior: smooth;
      scroll-padding-top: 90px;
    }

    body {
      margin: 0;
    }

    .es-page {
      --bg: #05080d;
      --panel: #0a1018;
      --text: #f5f8fb;
      --muted: #8b98a8;
      --blue: #168fff;
      --blue2: #49b2ff;
      --line: rgba(255,255,255,.10);
      min-height: 100vh;
      overflow: hidden;
      background: var(--bg);
      color: var(--text);
      font-family: Inter, Arial, Helvetica, sans-serif;
      transition: background .35s ease, color .35s ease;
    }

    .es-page.light {
      --bg: #f3f3f0;
      --panel: #fff;
      --text: #10151c;
      --muted: #647080;
      --line: rgba(0,0,0,.10);
    }

    .es-page a,
    .es-page button {
      -webkit-tap-highlight-color: transparent;
    }

    .es-nav {
      height: 78px;
      padding: 0 6%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: fixed;
      inset: 0 0 auto;
      z-index: 100;
      background: rgba(5,8,13,.75);
      backdrop-filter: blur(18px);
      border-bottom: 1px solid rgba(255,255,255,.07);
    }

    .light .es-nav {
      background: rgba(243,243,240,.92);
      border-color: rgba(0,0,0,.08);
    }

    .es-logo {
      display: flex;
      align-items: center;
      gap: 11px;
      color: var(--text);
      text-decoration: none;
      flex-shrink: 0;
    }

    .es-logo-mark {
      width: 38px;
      height: 38px;
      border-radius: 12px;
      position: relative;
      display: grid;
      place-items: center;
      overflow: hidden;
      background: linear-gradient(145deg,#45b7ff,#0878e8);
      box-shadow: 0 0 28px rgba(20,143,255,.28);
    }

    .es-logo-mark:before,
    .es-logo-mark:after {
      content: "";
      position: absolute;
      border: 1px solid rgba(255,255,255,.75);
      border-radius: 50%;
    }

    .es-logo-mark:before {
      width: 25px;
      height: 12px;
      transform: rotate(-35deg);
    }

    .es-logo-mark:after {
      width: 12px;
      height: 25px;
      transform: rotate(-35deg);
    }

    .es-logo-letter {
      position: relative;
      z-index: 2;
      font-weight: 900;
      font-size: 17px;
    }

    .es-logo-text {
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -.7px;
    }

    .es-logo-text span {
      color: var(--blue2);
    }

    .es-nav-links {
      display: flex;
      align-items: center;
      gap: 25px;
    }

    .es-nav-links a {
      color: var(--muted);
      text-decoration: none;
      font-size: 13px;
      font-weight: 600;
      transition: color .25s ease;
    }

    .es-nav-links a:hover {
      color: var(--text);
    }

    .es-talk {
      color: #fff !important;
      padding: 10px 16px;
      border: 1px solid rgba(57,166,255,.55);
      border-radius: 999px;
      background: rgba(25,133,238,.09);
    }

    .es-theme,
    .es-menu {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      border: 1px solid var(--line);
      background: transparent;
      color: var(--text);
      cursor: pointer;
      font-size: 16px;
    }

    .es-menu {
      display: none;
      border-radius: 8px;
      padding: 8px 11px;
      font-size: 18px;
    }

    /* HERO */

    .es-hero {
      min-height: 820px;
      padding: 155px 7% 110px;
      position: relative;
      overflow: hidden;
      background:
        radial-gradient(circle at 76% 28%,rgba(17,137,255,.24),transparent 24%),
        linear-gradient(180deg,#05080d,#07111d);
    }

    .es-hero:before {
      content: "";
      position: absolute;
      width: 760px;
      height: 760px;
      right: -280px;
      top: -250px;
      border-radius: 50%;
      border: 1px solid rgba(43,159,255,.26);
      box-shadow: 0 0 90px rgba(16,129,235,.10),
        inset 0 0 80px rgba(16,129,235,.05);
      pointer-events: none;
    }

    .es-hero-inner {
      max-width: 1200px;
      margin: auto;
      position: relative;
      z-index: 2;
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: center;
      gap: 50px;
    }

    .es-kicker {
      color: #43aaff;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 2.4px;
      margin-bottom: 20px;
    }

    .es-hero h1 {
      font-family: Georgia, 'Times New Roman', serif;
      font-size: clamp(54px,6.5vw,92px);
      font-weight: 400;
      line-height: .95;
      letter-spacing: -4px;
      margin: 0;
      max-width: 650px;
    }

    .es-hero h1 strong {
      color: #269cff;
      font-weight: 400;
      font-style: italic;
    }

    .es-hero p {
      color: #9aa7b7;
      max-width: 470px;
      line-height: 1.8;
      font-size: 14px;
      margin: 28px 0;
    }

    .es-actions {
      display: flex;
      gap: 12px;
      align-items: center;
      flex-wrap: wrap;
    }

    .es-btn {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      border-radius: 999px;
      padding: 13px 19px;
      font-size: 11px;
      font-weight: 800;
      transition: transform .25s ease, box-shadow .25s ease;
    }

    .es-btn:hover {
      transform: translateY(-3px);
    }

    .es-btn-primary {
      color: #fff;
      background: #1288f3;
      box-shadow: 0 10px 30px rgba(18,136,243,.22);
    }

    .es-btn-primary:hover {
      box-shadow: 0 12px 35px rgba(18,136,243,.4);
    }

    .es-btn-ghost {
      color: var(--text);
      border: 1px solid var(--line);
    }

    .es-hero-art {
      min-height: 510px;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .es-glow {
      position: absolute;
      width: 440px;
      height: 440px;
      border-radius: 50%;
      background: rgba(14,135,255,.12);
      filter: blur(45px);
      animation: blueGlowPulse 4s ease-in-out infinite;
    }

    .es-phone {
      width: 230px;
      height: 440px;
      border-radius: 35px;
      padding: 9px;
      background: linear-gradient(145deg,#1d2733,#05080d);
      border: 1px solid rgba(255,255,255,.25);
      box-shadow: 0 35px 70px rgba(0,0,0,.6),
        0 0 35px rgba(18,139,255,.18);
      position: absolute;
      overflow: hidden;
    }

    .es-phone.one {
      transform: rotate(-10deg) translate(-105px,5px);
      animation: phoneLeftFloat 6s ease-in-out infinite;
    }

    .es-phone.two {
      transform: rotate(8deg) translate(95px,-25px);
      animation: phoneRightFloat 6s ease-in-out infinite;
      animation-delay: -2s;
    }

    .es-phone-screen {
      height: 100%;
      border-radius: 28px;
      padding: 22px 16px;
      background: linear-gradient(180deg,#0d1826,#071019);
    }

    .es-phone small {
      color: #6e7d8e;
      font-size: 8px;
    }

    .es-phone h3 {
      margin: 12px 0 18px;
      font-size: 20px;
      color: #fff;
    }

    .es-chart {
      height: 125px;
      border-radius: 15px;
      background: linear-gradient(180deg,rgba(27,145,255,.20),rgba(27,145,255,.02));
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(67,167,255,.16);
    }

    .es-chart svg {
      width: 100%;
      height: 100%;
    }

    .es-phone-card {
      margin-top: 12px;
      padding: 12px;
      border-radius: 12px;
      background: #101c2a;
      border: 1px solid rgba(255,255,255,.06);
      color: #a9b6c5;
      font-size: 8px;
    }

    .es-float {
      position: absolute;
      right: 5%;
      bottom: 70px;
      padding: 11px 14px;
      border-radius: 13px;
      background: #101c27;
      border: 1px solid rgba(68,169,255,.28);
      font-size: 9px;
      color: #dce8f4;
      box-shadow: 0 15px 40px rgba(0,0,0,.35);
      animation: floatBadge 4s ease-in-out infinite;
    }

    /* SECTION BASICS */

    .es-wave {
      display: block;
      width: 100%;
      height: 90px;
      margin-bottom: -1px;
    }

    .es-white {
      background: #f1f1ee;
      color: #111820;
      position: relative;
    }

    .es-white .es-section-title {
      color: #111820;
    }

    .es-white .es-muted {
      color: #657080;
    }

    .es-about {
      padding: 75px 7% 95px;
    }

    .es-about-inner {
      max-width: 1200px;
      margin: auto;
      display: grid;
      grid-template-columns: .8fr 1.2fr;
      gap: 70px;
      align-items: center;
    }

    .es-portrait {
      height: 370px;
      border-radius: 48% 52% 46% 54%;
      overflow: hidden;
      position: relative;
      background: linear-gradient(145deg,#dfe3e2,#fff);
    }

    .es-portrait:after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg,transparent 45%,rgba(15,24,30,.28));
    }

    .es-portrait img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: grayscale(1) contrast(1.05);
    }

    .es-about-copy .es-kicker {
      color: #147fe2;
    }

    .es-section-title {
      font-family: Georgia, 'Times New Roman', serif;
      font-size: clamp(42px,4.6vw,66px);
      line-height: .98;
      font-weight: 400;
      letter-spacing: -2.5px;
      margin: 0;
    }

    .es-section-title em {
      color: #178df0;
      font-style: italic;
    }

    .es-muted {
      color: #697484;
      font-size: 13px;
      line-height: 1.8;
      max-width: 500px;
    }

    .es-stats {
      display: grid;
      grid-template-columns: repeat(3,1fr);
      gap: 30px;
      margin-top: 35px;
    }

    .es-stat strong {
      display: block;
      font-size: 27px;
    }

    .es-stat span {
      color: #747d87;
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    /* POWERFUL FEATURES */

    .es-features {
      padding: 115px 7%;
      background: #05080d;
      position: relative;
      overflow: hidden;
    }

    .es-features:after {
      content: "";
      position: absolute;
      width: 850px;
      height: 280px;
      left: -300px;
      bottom: -160px;
      border-radius: 50%;
      border: 1px solid rgba(35,152,255,.25);
      box-shadow: 0 0 60px rgba(15,127,230,.08);
      pointer-events: none;
    }

    .es-section-head {
      max-width: 1200px;
      margin: 0 auto 55px;
      display: flex;
      justify-content: space-between;
      align-items: end;
      gap: 30px;
      position: relative;
      z-index: 2;
    }

    .es-section-head .es-muted {
      max-width: 350px;
    }

    .es-feature-heading em {
      color: #43aaff;
      font-style: normal;
    }

    .es-feature-grid {
      max-width: 1200px;
      margin: auto;
      display: grid;
      grid-template-columns: repeat(2,minmax(0,1fr));
      gap: 22px;
      position: relative;
      z-index: 2;
    }

    .es-feature-card {
      min-height: 340px;
      padding: 32px;
      border-radius: 28px;
      background: linear-gradient(145deg,#101a26,#080d13);
      border: 1px solid rgba(255,255,255,.08);
      text-decoration: none;
      color: #fff;
      position: relative;
      overflow: hidden;
      isolation: isolate;

      opacity: 0;
      transform: translateX(85px);
      transition:
        opacity .8s ease,
        transform .8s cubic-bezier(.16,1,.3,1),
        border-color .35s ease,
        box-shadow .35s ease;
      transition-delay: var(--feature-delay, 0ms);
    }

    .es-feature-card.is-visible {
      opacity: 1;
      transform: translateX(0);
    }

    .es-feature-card:hover {
      transform: translateY(-8px);
      border-color: rgba(43,160,255,.65);
      box-shadow:
        0 25px 70px rgba(0,0,0,.45),
        0 0 40px rgba(20,136,245,.12);
    }

    .es-feature-card:before {
      content: "";
      position: absolute;
      width: 220px;
      height: 220px;
      right: -70px;
      top: -80px;
      border-radius: 50%;
      border: 1px solid rgba(47,159,255,.2);
      box-shadow: 0 0 45px rgba(25,141,245,.09);
      transition: transform .5s ease;
      z-index: -1;
    }

    .es-feature-card:hover:before {
      transform: scale(1.25);
    }

    .es-feature-number {
      color: #43aaff;
      font-size: 10px;
      letter-spacing: 2px;
    }

    .es-feature-icon {
      width: 68px;
      height: 68px;
      margin: 48px 0 25px;
      border-radius: 20px;
      display: grid;
      place-items: center;
      color: #49b0ff;
      font-size: 28px;
      background: rgba(28,144,246,.08);
      border: 1px solid rgba(55,165,255,.25);
      box-shadow: 0 0 30px rgba(25,140,245,.08);
      transition: transform .35s ease, background .35s ease;
    }

    .es-feature-card:hover .es-feature-icon {
      transform: translateY(-5px) rotate(-5deg);
      background: rgba(28,144,246,.16);
    }

    .es-feature-card h3 {
      font-size: 24px;
      margin: 0 0 12px;
      position: relative;
    }

    .es-feature-card p {
      color: #9aa7b7;
      font-size: 12px;
      line-height: 1.8;
      max-width: 390px;
      margin-bottom: 40px;
    }

    .es-feature-link {
      position: absolute;
      bottom: 30px;
      left: 32px;
      color: #46adff;
      font-size: 11px;
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 9px;
    }

    .es-arrow {
      display: inline-block;
      transition: transform .3s ease;
    }

    .es-feature-card:hover .es-arrow {
      transform: translate(4px,-4px);
    }

    /* FEATURED PROJECTS */

    .es-projects {
      padding: 105px 7% 125px;
      background: #070b11;
      position: relative;
    }

    .es-project-grid {
      max-width: 1200px;
      margin: auto;
      display: grid;
      grid-template-columns: repeat(3,1fr);
      gap: 18px;
    }

    .es-project {
      min-height: 430px;
      border-radius: 25px;
      overflow: hidden;
      position: relative;
      background: #111;
      color: #fff;
      text-decoration: none;
      border: 1px solid rgba(255,255,255,.08);
      transition: transform .4s ease, border-color .4s ease;
    }

    .es-project:hover {
      transform: translateY(-7px);
      border-color: rgba(43,160,255,.4);
    }

    .es-project img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      position: absolute;
      inset: 0;
      transition: transform .5s ease;
    }

    .es-project:hover img {
      transform: scale(1.05);
    }

    .es-project:after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg,transparent 35%,rgba(3,7,11,.94));
    }

    .es-project-copy {
      position: absolute;
      left: 24px;
      right: 24px;
      bottom: 24px;
      z-index: 2;
    }

    .es-project-tag {
      color: #52b3ff;
      font-size: 8px;
      letter-spacing: 2px;
      font-weight: 800;
    }

    .es-project h3 {
      font-family: Georgia,serif;
      font-size: 27px;
      font-weight: 400;
      margin: 8px 0 0;
    }

    /* WORKFLOW */

    .es-journey {
      padding: 95px 7%;
      background: #f1f1ee;
      color: #111820;
    }

    .es-journey-grid {
      max-width: 1200px;
      margin: 60px auto 0;
      display: grid;
      grid-template-columns: repeat(4,1fr);
      gap: 25px;
      position: relative;
    }

    .es-journey-grid:before {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      top: 12px;
      border-top: 1px dashed #b9bec2;
    }

    .es-step {
      position: relative;
      padding-top: 38px;
    }

    .es-step-dot {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: #111820;
      color: #fff;
      display: grid;
      place-items: center;
      font-size: 9px;
      position: absolute;
      top: 0;
      z-index: 2;
    }

    .es-step.active .es-step-dot {
      background: #168ff3;
      box-shadow: 0 0 25px rgba(22,143,243,.35);
    }

    .es-step small {
      color: #77818c;
      font-size: 8px;
    }

    .es-step h4 {
      font-size: 13px;
      margin: 8px 0;
    }

    .es-step p {
      color: #68727e;
      font-size: 10px;
      line-height: 1.7;
      margin: 0;
    }

    /* TESTIMONIALS */

    .es-testimonials {
      padding: 105px 7%;
      background: #05080d;
      position: relative;
      overflow: hidden;
    }

    .es-testimonial-grid {
      max-width: 1000px;
      margin: 55px auto 0;
      display: grid;
      grid-template-columns: repeat(3,1fr);
      gap: 15px;
      align-items: center;
    }

    .es-quote-card {
      min-height: 235px;
      padding: 25px;
      border-radius: 23px;
      background: #0b121b;
      border: 1px solid rgba(255,255,255,.07);
      color: #fff;
      transition: transform .4s ease, border-color .4s ease, box-shadow .4s ease;
    }

    .es-quote-card.center {
      transform: scale(1.05);
      border-color: rgba(44,158,255,.4);
      box-shadow: 0 0 55px rgba(17,135,240,.10);
    }

    .es-stars {
      color: #f7d36a;
      letter-spacing: 3px;
      font-size: 9px;
    }

    .es-quote {
      color: #a9b4c0;
      font-family: Georgia,serif;
      font-size: 13px;
      line-height: 1.7;
      margin: 25px 0;
    }

    .es-person {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .es-person img {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      object-fit: cover;
    }

    .es-person strong {
      font-size: 10px;
      display: block;
    }

    .es-person span {
      color: #8794a4;
      font-size: 9px;
    }

    /* CTA */

    .es-cta {
      padding: 85px 7%;
      background: #f1f1ee;
      color: #111820;
      position: relative;
      overflow: hidden;
    }

    .es-cta-inner {
      max-width: 1200px;
      margin: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 40px;
    }

    .es-cta .es-section-title {
      max-width: 600px;
    }

    .es-cta-orb {
      width: 230px;
      height: 160px;
      flex-shrink: 0;
      border-radius: 50%;
      border: 1px solid rgba(20,143,243,.28);
      box-shadow: 0 0 60px rgba(20,143,243,.12);
      transform: rotate(-15deg);
      position: relative;
      animation: orbFloat 5s ease-in-out infinite;
    }

    .es-cta-orb:before,
    .es-cta-orb:after {
      content: "";
      position: absolute;
      inset: 20px;
      border: 1px solid rgba(20,143,243,.25);
      border-radius: 50%;
    }

    .es-cta-orb:after {
      inset: 45px;
    }

    /* FOOTER */

    .es-footer {
      padding: 55px 7% 25px;
      background: #05080d;
      color: #fff;
    }

    .es-footer-grid {
      max-width: 1200px;
      margin: auto;
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1.4fr;
      gap: 35px;
    }

    .es-footer h4 {
      font-size: 10px;
      letter-spacing: 1px;
      color: #fff;
      margin: 0 0 18px;
    }

    .es-footer a {
      display: block;
      color: #9aa7b7;
      text-decoration: none;
      font-size: 10px;
      margin: 9px 0;
      transition: color .25s ease;
    }

    .es-footer a:hover {
      color: #49b2ff;
    }

    .es-footer p {
      color: #9aa7b7;
      font-size: 11px;
      line-height: 1.7;
      max-width: 260px;
    }

    .es-copy {
      max-width: 1200px;
      margin: 40px auto 0;
      padding-top: 20px;
      border-top: 1px solid rgba(255,255,255,.07);
      display: flex;
      justify-content: space-between;
      gap: 15px;
      color: #8994a2;
      font-size: 9px;
    }

    /* GENERAL SCROLL REVEAL */

    .es-page .anim-reveal {
      opacity: 0;
      filter: blur(5px);
      transition:
        opacity .85s ease,
        transform .85s cubic-bezier(.16,1,.3,1),
        filter .85s ease;
      will-change: transform, opacity;
    }

    .es-page .anim-reveal.from-right {
      transform: translateX(90px);
    }

    .es-page .anim-reveal.from-left {
      transform: translateX(-90px);
    }

    .es-page .anim-reveal.from-bottom {
      transform: translateY(55px);
    }

    .es-page .anim-reveal.from-scale {
      transform: scale(.88);
    }

    .es-page .anim-reveal.is-visible {
      opacity: 1;
      transform: translate(0,0) scale(1);
      filter: blur(0);
    }

    .es-page .delay-1 { transition-delay: 100ms; }
    .es-page .delay-2 { transition-delay: 200ms; }
    .es-page .delay-3 { transition-delay: 300ms; }
    .es-page .delay-4 { transition-delay: 400ms; }

    /* KEYFRAMES */

    @keyframes phoneLeftFloat {
      0%,100% { margin-top: 0; }
      50% { margin-top: -18px; }
    }

    @keyframes phoneRightFloat {
      0%,100% { margin-top: 0; }
      50% { margin-top: 18px; }
    }

    @keyframes blueGlowPulse {
      0%,100% { opacity: .55; transform: scale(.95); }
      50% { opacity: 1; transform: scale(1.08); }
    }

    @keyframes floatBadge {
      0%,100% { translate: 0 0; }
      50% { translate: 0 -9px; }
    }

    @keyframes orbFloat {
      0%,100% { translate: 0 0; }
      50% { translate: 0 -12px; }
    }

    /* RESPONSIVE */

    @media (max-width: 1050px) {
      .es-nav-links {
        gap: 15px;
      }

      .es-nav-links a {
        font-size: 12px;
      }

      .es-hero-inner {
        gap: 20px;
      }

      .es-phone {
        width: 200px;
        height: 390px;
      }

      .es-phone.one {
        transform: rotate(-10deg) translate(-75px,5px);
      }

      .es-phone.two {
        transform: rotate(8deg) translate(75px,-20px);
      }
    }

    @media (max-width: 900px) {
      .es-nav-links {
        display: none;
        position: absolute;
        top: 78px;
        left: 5%;
        right: 5%;
        padding: 22px;
        border-radius: 16px;
        background: #0b1119;
        border: 1px solid rgba(255,255,255,.12);
        flex-direction: column;
        align-items: stretch;
        gap: 18px;
        box-shadow: 0 25px 60px rgba(0,0,0,.35);
      }

      .light .es-nav-links {
        background: #fff;
      }

      .es-nav-links.open {
        display: flex;
      }

      .es-nav-links a {
        font-size: 14px;
      }

      .es-theme {
        align-self: flex-start;
      }

      .es-menu {
        display: block;
      }

      .es-hero-inner,
      .es-about-inner {
        grid-template-columns: 1fr;
      }

      .es-hero {
        padding-top: 130px;
      }

      .es-hero-art {
        min-height: 470px;
      }

      .es-about-inner {
        gap: 40px;
      }

      .es-portrait {
        max-width: 480px;
        width: 100%;
        margin: auto;
      }

      .es-project-grid {
        grid-template-columns: 1fr 1fr;
      }

      .es-journey-grid {
        grid-template-columns: 1fr 1fr;
        row-gap: 35px;
      }

      .es-journey-grid:before {
        display: none;
      }

      .es-testimonial-grid {
        grid-template-columns: 1fr;
        max-width: 500px;
      }

      .es-quote-card.center {
        transform: none;
      }

      .es-footer-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (max-width: 600px) {
      .es-nav {
        padding: 0 5%;
      }

      .es-logo-text {
        font-size: 18px;
      }

      .es-hero {
        padding: 125px 6% 65px;
      }

      .es-hero h1 {
        font-size: clamp(48px,12vw,68px);
        letter-spacing: -2.5px;
      }

      .es-hero-art {
        min-height: 400px;
      }

      .es-phone {
        width: 175px;
        height: 340px;
      }

      .es-phone.one {
        transform: rotate(-10deg) translate(-65px,10px);
      }

      .es-phone.two {
        transform: rotate(8deg) translate(65px,-20px);
      }

      .es-float {
        right: 0;
        bottom: 10px;
      }

      .es-about,
      .es-features,
      .es-projects,
      .es-journey,
      .es-testimonials,
      .es-cta {
        padding: 75px 6%;
      }

      .es-section-title {
        font-size: clamp(38px,10vw,54px);
        letter-spacing: -1.7px;
      }

      .es-stats {
        gap: 15px;
      }

      .es-stat strong {
        font-size: 23px;
      }

      .es-section-head,
      .es-cta-inner {
        display: block;
      }

      .es-section-head .es-muted {
        margin-top: 20px;
      }

      .es-feature-grid,
      .es-project-grid,
      .es-journey-grid {
        grid-template-columns: 1fr;
      }

      .es-feature-card {
        min-height: 315px;
        padding: 26px;
      }

      .es-feature-icon {
        margin-top: 42px;
      }

      .es-feature-link {
        left: 26px;
      }

      .es-project {
        min-height: 360px;
      }

      .es-cta-orb {
        margin: 45px auto 0;
        max-width: 100%;
      }

      .es-footer-grid {
        grid-template-columns: 1fr 1fr;
        gap: 28px 18px;
      }

      .es-copy {
        display: block;
        line-height: 2;
      }

      .es-page .anim-reveal.from-right {
        transform: translateX(45px);
      }

      .es-page .anim-reveal.from-left {
        transform: translateX(-45px);
      }

      .es-page .anim-reveal.from-bottom {
        transform: translateY(30px);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .es-page *,
      .es-page *::before,
      .es-page *::after {
        animation-duration: .01ms !important;
        animation-iteration-count: 1 !important;
        scroll-behavior: auto !important;
        transition-duration: .01ms !important;
      }

      .es-page .anim-reveal,
      .es-page .es-feature-card {
        opacity: 1;
        transform: none;
        filter: none;
      }
    }
  `;

  return (
    <div className={`es-page ${darkMode ? "dark" : "light"}`}>
      <style>{styles}</style>

      {/* NAVIGATION */}
      <nav className="es-nav">
        <Link
          to="/"
          className="es-logo"
          onClick={() => setMenuOpen(false)}
        >
          <div className="es-logo-mark">
            <span className="es-logo-letter">E</span>
          </div>
          <div className="es-logo-text">
            Event<span>Sphere</span>
          </div>
        </Link>

        <div className={`es-nav-links ${menuOpen ? "open" : ""}`}>
          <a href="#about" onClick={() => setMenuOpen(false)}>
            About
          </a>
          <a href="#features" onClick={() => setMenuOpen(false)}>
            Features
          </a>
          <a href="#expos" onClick={() => setMenuOpen(false)}>
            Expos
          </a>
          <a href="#events" onClick={() => setMenuOpen(false)}>
            Events
          </a>
          <a
            href="#testimonials"
            onClick={() => setMenuOpen(false)}
          >
            Testimonials
          </a>

          <button
            className="es-theme"
            onClick={() => setDarkMode((value) => !value)}
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
            title={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {darkMode ? "☀" : "☾"}
          </button>

          <Link
            to="/login"
            className="es-talk"
            onClick={() => setMenuOpen(false)}
          >
            Let's Talk →
          </Link>
        </div>

        <button
          className="es-menu"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          ☰
        </button>
      </nav>

      <main>
        {/* HERO */}
        <section className="es-hero" id="events">
          <div className="es-hero-inner">
            <div className="anim-reveal from-left">
              <div className="es-kicker">
                EVENT MANAGEMENT PLATFORM
              </div>

              <h1>
                Crafting premium{" "}
                <strong>event experiences</strong> that people love.
              </h1>

              <p>
                EventSphere brings expos, exhibitors, booths, sessions
                and registrations together in one beautifully organized
                platform.
              </p>

              <div className="es-actions">
                <Link to="/expos" className="es-btn es-btn-primary">
                  Explore Expos →
                </Link>

                <a href="#features" className="es-btn es-btn-ghost">
                  View Features
                </a>
              </div>
            </div>

            <div className="es-hero-art anim-reveal from-right">
              <div className="es-glow"></div>

              <div className="es-phone one">
                <div className="es-phone-screen">
                  <small>EventSphere</small>
                  <h3>Hi, Organizer</h3>

                  <div className="es-chart">
                    <svg
                      viewBox="0 0 220 125"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M0 100 C25 92 32 105 55 76 S92 90 112 62 S145 72 165 42 S192 65 220 22"
                        fill="none"
                        stroke="#2d9cff"
                        strokeWidth="3"
                      />
                      <path
                        d="M0 100 C25 92 32 105 55 76 S92 90 112 62 S145 72 165 42 S192 65 220 22 V125 H0Z"
                        fill="rgba(45,156,255,.12)"
                      />
                    </svg>
                  </div>

                  <div className="es-phone-card">
                    Upcoming Expo · 20 Dec 2026
                  </div>
                  <div className="es-phone-card">
                    1,240 registered attendees
                  </div>
                </div>
              </div>

              <div className="es-phone two">
                <div className="es-phone-screen">
                  <small>Discover</small>
                  <h3>Featured</h3>
                  <div className="es-phone-card">
                    Global Business Expo
                  </div>
                  <div className="es-phone-card">
                    Future AI Conference
                  </div>
                  <div className="es-phone-card">
                    Industry Networking
                  </div>
                  <div className="es-phone-card">
                    Today's Sessions · 08
                  </div>
                </div>
              </div>

              <div className="es-float">
                ● Available for new events
              </div>
            </div>
          </div>
        </section>

        {/* WAVE */}
        <svg
          className="es-wave"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,0 C180,90 330,85 520,45 C720,0 860,5 1030,50 C1210,98 1320,100 1440,45 L1440,100 L0,100 Z"
            fill="#f1f1ee"
          />
        </svg>

        {/* ABOUT */}
        <section className="es-white es-about" id="about">
          <div className="es-about-inner">
            <div className="es-portrait anim-reveal from-left">
              <img
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=85"
                alt="Event team collaborating"
                loading="lazy"
              />
            </div>

            <div className="es-about-copy anim-reveal from-right">
              <div className="es-kicker">ABOUT EVENTSPHERE</div>

              <h2 className="es-section-title">
                Events are our medium.{" "}
                <em>Connection is our superpower.</em>
              </h2>

              <p className="es-muted">
                Built for teams that want less complexity and more
                impact, EventSphere gives organizers a single place
                to run modern expos and events.
              </p>

              <div className="es-stats">
                <div className="es-stat">
                  <strong>06+</strong>
                  <span>Core modules</span>
                </div>
                <div className="es-stat">
                  <strong>45+</strong>
                  <span>Event tools</span>
                </div>
                <div className="es-stat">
                  <strong>18+</strong>
                  <span>Event workflows</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* POWERFUL FEATURES */}
        <section className="es-features" id="features">
          <div className="es-section-head anim-reveal from-left">
            <div>
              <div className="es-kicker">OUR FEATURES</div>

              <h2 className="es-section-title es-feature-heading">
                Powerful Features for
                <br />
                <em>Seamless Events.</em>
              </h2>
            </div>

            <p className="es-muted">
              Everything you need to plan, manage and grow successful
              events — all in one powerful platform.
            </p>
          </div>

          <div className="es-feature-grid">
            {features.map((feature, index) => (
              <Link
                to={feature.link}
                className="es-feature-card anim-reveal from-right"
                style={{
                  "--feature-delay": `${index * 120}ms`,
                }}
                key={feature.number}
              >
                <div className="es-feature-number">
                  {feature.number}
                </div>

                <div className="es-feature-icon">
                  {feature.icon}
                </div>

                <h3>{feature.title}</h3>

                <p>{feature.text}</p>

                <span className="es-feature-link">
                  Explore Feature <span className="es-arrow">↗</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* PROJECT WAVE */}
        <svg
          className="es-wave"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,30 C180,90 350,95 520,55 C720,10 900,5 1080,55 C1250,95 1330,80 1440,20 L1440,100 L0,100 Z"
            fill="#070b11"
          />
        </svg>

        {/* FEATURED EXPERIENCES */}
        <section className="es-projects" id="expos">
          <div className="es-section-head anim-reveal from-left">
            <div>
              <div className="es-kicker">FEATURED EXPERIENCES</div>
              <h2 className="es-section-title">
                Digital experiences{" "}
                <em>that make an impact.</em>
              </h2>
            </div>

            <Link to="/expos" className="es-btn es-btn-ghost">
              Explore All Expos +
            </Link>
          </div>

          <div className="es-project-grid">
            {projects.map((project, index) => (
              <Link
                to="/expos"
                className={`es-project anim-reveal from-right delay-${index + 1}`}
                key={project.title}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                />

                <div className="es-project-copy">
                  <div className="es-project-tag">{project.tag}</div>
                  <h3>{project.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* WORKFLOW */}
        <section className="es-journey">
          <div className="es-section-head anim-reveal from-left">
            <div>
              <div className="es-kicker">THE WORKFLOW</div>
              <h2 className="es-section-title">
                The journey that{" "}
                <em>shapes every event.</em>
              </h2>
            </div>
          </div>

          <div className="es-journey-grid">
            {journey.map((step, index) => (
              <div
                className={`es-step anim-reveal from-bottom delay-${index + 1} ${
                  index === 3 ? "active" : ""
                }`}
                key={step[0]}
              >
                <div className="es-step-dot">{step[0]}</div>
                <small>{index === 3 ? "NEXT" : "STEP"}</small>
                <h4>{step[1]}</h4>
                <p>{step[2]}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="es-testimonials" id="testimonials">
          <div className="es-section-head anim-reveal from-left">
            <div>
              <div className="es-kicker">TESTIMONIALS</div>
              <h2 className="es-section-title">
                People <em>love</em> working with EventSphere.
              </h2>
            </div>
          </div>

          <div className="es-testimonial-grid">
            {testimonials.map((person, index) => (
              <div
                className={`es-quote-card anim-reveal from-right delay-${index + 1} ${
                  index === 1 ? "center" : ""
                }`}
                key={person.name}
              >
                <div className="es-stars">★★★★★</div>

                <div className="es-quote">
                  “{person.quote}”
                </div>

                <div className="es-person">
                  <img
                    src={person.image}
                    alt={person.name}
                    loading="lazy"
                  />
                  <div>
                    <strong>{person.name}</strong>
                    <span>{person.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="es-cta">
          <div className="es-cta-inner">
            <div className="anim-reveal from-left">
              <div className="es-kicker">LET'S WORK TOGETHER</div>

              <h2 className="es-section-title">
                Have an <em>event</em> in mind?
              </h2>

              <p className="es-muted">
                Create your next expo or event with a cleaner,
                smarter workflow.
              </p>

              <Link
                to="/register"
                className="es-btn es-btn-primary"
              >
                Get Started →
              </Link>
            </div>

            <div
              className="es-cta-orb anim-reveal from-right"
              aria-hidden="true"
            />
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="es-footer">
        <div className="es-footer-grid">
          <div className="anim-reveal from-left">
            <Link to="/" className="es-logo">
              <div className="es-logo-mark">
                <span className="es-logo-letter">E</span>
              </div>
              <div className="es-logo-text">
                Event<span>Sphere</span>
              </div>
            </Link>

            <p>
              A modern event and expo management platform for
              organizers, exhibitors and attendees.
            </p>
          </div>

          <div className="anim-reveal from-bottom delay-1">
            <h4>NAVIGATION</h4>
            <Link to="/">Home</Link>
            <a href="#about">About</a>
            <a href="#features">Features</a>
            <Link to="/expos">Expos</Link>
          </div>

          <div className="anim-reveal from-bottom delay-2">
            <h4>RESOURCES</h4>
            <Link to="/sessions">Sessions</Link>
            <Link to="/exhibitors">Exhibitors</Link>
            <Link to="/products">Products</Link>
            <Link to="/analytics">Analytics</Link>
          </div>

          <div className="anim-reveal from-right delay-3">
            <h4>CONNECT</h4>
            <a href="mailto:hello@eventsphere.dev">
              hello@eventsphere.dev
            </a>
            <a href="#testimonials">Testimonials</a>
            <a href="#features">
              Let's build something amazing.
            </a>
          </div>
        </div>

        <div className="es-copy">
          <span>© 2026 EventSphere. All rights reserved.</span>
          <span>Privacy · Terms · Security</span>
        </div>
      </footer>
    </div>
  );
}

/* =========================================================
   APP ROUTER — existing routes preserved
========================================================= */

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />
        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/expos"
          element={
            <ProtectedRoute>
              <Expos />
            </ProtectedRoute>
          }
        />

        <Route
          path="/expos/:id"
          element={
            <ProtectedRoute>
              <ExpoDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-registrations"
          element={
            <ProtectedRoute>
              <MyRegistrations />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sessions"
          element={
            <ProtectedRoute>
              <Sessions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/exhibitors"
          element={
            <ProtectedRoute>
              <Exhibitors />
            </ProtectedRoute>
          }
        />

        <Route
          path="/exhibitors/:id"
          element={
            <ProtectedRoute>
              <ExhibitorDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />

        <Route
          path="/feedback"
          element={
            <ProtectedRoute>
              <Feedback />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff"
          element={
            <ProtectedRoute>
              <Staff />
            </ProtectedRoute>
          }
        />

        <Route
          path="/booths"
          element={
            <ProtectedRoute>
              <Booths />
            </ProtectedRoute>
          }
        />

        <Route
          path="/schedules"
          element={
            <ProtectedRoute>
              <Schedules />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bookmarks"
          element={
            <ProtectedRoute>
              <Bookmarks />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;