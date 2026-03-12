"use client";
import Header from "@/Components/Header";
import React from "react";

const Layout = ({children }) => {
  return (
    <div className="w-full flex flex-col h-screen">
      <Header />
      {children}
    </div>
  );
};

export default Layout;
