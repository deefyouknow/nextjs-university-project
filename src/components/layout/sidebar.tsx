"use client"
import React, { useState, useEffect, useLayoutEffect, useRef } from "react";

interface AppProps {
  openSidebar: boolean;
  setOpenSidebar: (open: boolean) => void;
}

const TRANSITION_DURATION_MS = 300;
const INITIAL_RENDER_DELAY_MS = 50;

export const Sidebar: React.FC<AppProps> = ({ openSidebar, setOpenSidebar }) => {
  const [isRendered, setIsRendered] = useState(openSidebar);
  const [isAnimating, setIsAnimating] = useState(openSidebar);

  const isRenderedRef = useRef(isRendered);
  const isAnimatingRef = useRef(isAnimating);

  useEffect(() => {
    isRenderedRef.current = isRendered;
    isAnimatingRef.current = isAnimating;
  }, [isRendered, isAnimating]);

  useLayoutEffect(() => {
    if (openSidebar && !isRenderedRef.current) {
      setIsRendered(true);
    }
  }, [openSidebar]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (openSidebar) {
      timer = setTimeout(() => {
        setIsAnimating(true);
      }, INITIAL_RENDER_DELAY_MS);
    } else {
      setIsAnimating(false);
      timer = setTimeout(() => {
        setIsRendered(false);
      }, TRANSITION_DURATION_MS);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [openSidebar]);

  if (!isRendered) {
    return null;
  }

  const translateClass = isAnimating ? 'translate-x-0' : '-translate-x-full';
  const opacityClass = isAnimating ? 'opacity-100' : 'opacity-0';

  return (
    <div className={`w-full h-full absolute max-w-7xl flex z-30 overflow-hidden`}>
      <div className={`w-full max-w-[350px] h-full overflow-hidden flex flex-col bg-amber-100 absolute z-31 transition duration-300 ${translateClass}`}>
        <div className={`h-16`}></div>
        {contentOnSidebar()}
      </div>
      <button
        className={`bg-red-200/10 w-full h-full z-30 absolute backdrop-blur-2xl transition duration-300 ${opacityClass}`}
        onClick={() => setOpenSidebar(false)}
      ></button>
    </div>
  );
};

export const contentOnSidebar = () => {
  const actionButton = `active:bg-red-400 hover:bg-red-300 duration-100`;
  const themeButton = `bg-red-200 rounded-sm py-1 md:py-2 ${actionButton}`;
  return (
    <>
      <div className="flex flex-col mt-2 space-y-1 ">
        <button className={`${themeButton}`}>HOME</button>
        <button className={`${themeButton}`}>DASHBOARD</button>
      </div>
    </>
  )
}
