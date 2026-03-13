import React from "react";
import type { TrackYourProgresStatItemProps } from "@/types/features/home/TrackYourProgress.types";

const StartItem: React.FC<TrackYourProgresStatItemProps> = ({ item }) => {
  return (
    <div className="rounded-[16px] border border-black/10 bg-white/20 px-7 py-8">
      <div className="text-5xl font-semibold tracking-[-0.04em] text-black md:text-[48px]">
        {item.value}
      </div>

      <p className="mt-4 text-xl text-black/85">
        {item.label}
      </p>
    </div>
  );
};

export { StartItem };