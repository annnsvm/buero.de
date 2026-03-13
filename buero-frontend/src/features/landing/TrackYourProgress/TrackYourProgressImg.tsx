import React from "react";
import type { TrackYourProgressImgProps } from "@/types/features/home/TrackYourProgress.types";

const TrackYourProgressImg: React.FC<TrackYourProgressImgProps> = ({ src, alt }) => {
  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-2xl">
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export { TrackYourProgressImg };