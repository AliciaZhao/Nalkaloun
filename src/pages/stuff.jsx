// src/pages/stuff.jsx
import React, { useEffect } from "react";
import "../styles/stuff.css";

export default function Stuff() {
  useEffect(() => {
    document.body.classList.add("chat-theme");
    return () => {
      document.body.classList.remove("chat-theme");
    };
  }, []);
  return null;
}
