"use client";

import { useContext } from "react";
import { SettingsContext } from "../settings/SettingsProvider";
import { FaktionIcon, FaktionLogoTypeIcon } from "../icons/icons";

export function Logo({
  height,
  width,
  className,
  size = "default",
}: {
  height?: number;
  width?: number;
  className?: string;
  size?: "small" | "default" | "large";
}) {
  const settings = useContext(SettingsContext);

  const sizeMap = {
    small: { height: 24, width: 22 },
    default: { height: 32, width: 30 },
    large: { height: 48, width: 45 },
  };

  const { height: defaultHeight, width: defaultWidth } = sizeMap[size];
  height = height || defaultHeight;
  width = width || defaultWidth;

  return (
    <div style={{ height, width }} className={className}>
      <FaktionIcon
        size={height}
        className={`${className} dark:text-[#fff] text-[#000]`}
      />
    </div>
  );
}

export function LogoType({
  size = "default",
}: {
  size?: "small" | "default" | "large";
}) {
  return (
    <FaktionLogoTypeIcon
      size={115}
      className={`items-center w-full dark:text-[#fff]`}
    />
  );
}
