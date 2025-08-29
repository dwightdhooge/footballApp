import React from "react";
import SvgImage from "@/components/common/SvgImage";
import { FlagSvgProps } from "@/types/components";

const FlagSvg: React.FC<FlagSvgProps> = ({
  url,
  size = 24,
  onError,
  style,
  ttl,
}) => {
  return (
    <SvgImage
      url={url}
      size={size}
      onError={onError}
      style={style}
      ttl={ttl}
      fallbackText="Flag"
      borderRadius={4}
    />
  );
};

export default FlagSvg;
