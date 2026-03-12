"use client";
import { websiteData } from "@/Utils/API";
import { getInitials } from "@/Utils/Helper";
import { Moon, SunDim } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Header = () => {
  const [websiteResponse, setWebsiteResponse] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    const websiteDataResponse = async () => {
      const response = await websiteData();

      if (response.success) {
        setWebsiteResponse(response.data);
      } else {
        setWebsiteResponse(null);
      }
    };
    websiteDataResponse();
  }, []);

  return (
    <div className="w-full px-5 md:px-20 flex justify-between items-center py-1 bg-[#f5e6d3] dark:bg-[#050A24] border-b border-gray-300 dark:border-gray-700 shadow-2xl">
      <div className="w-32">
        {
            websiteResponse?.logo && websiteResponse?.logo?.trim() !== "" && (
                <Image src={websiteResponse?.logo} alt={websiteResponse?.title} width={250} height={250} className="w-full" priority quality={100} unoptimized={true} />
            )
        }
      </div>

      <div className="flex gap-5 items-center">
        <button disabled={user?.loading} type="button" onClick={() => setDarkMode(!darkMode)} className="md:flex hidden items-center justify-center cursor-pointer">
          {
            darkMode ? 
            (
               <SunDim className="w-5 h-5 text-[#EAB308] fill-current" />
            ) 
            : 
            (
               <Moon className="w-5 h-5 text-black fill-current" />
            )
          }
        </button>
        <div className="w-8 h-8 rounded-full flex items-center justify-center dark:border-gray-700 border border-gray-800">
            <p className="text-[14px] leading-6 text-black dark:text-white font-medium">{getInitials(user?.currentUser?.firstName, user?.currentUser?.lastName)}</p>
          </div>
      </div>
    </div>
  );
};

export default Header;