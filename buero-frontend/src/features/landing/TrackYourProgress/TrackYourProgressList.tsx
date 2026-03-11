import React from "react";
import { StartItem } from "./StartItem";
import type { TrackYourProgresListProps } from "@/types/features/home/TrackYourProgress.types";

const TrackYourProgressList: React.FC<TrackYourProgresListProps> = ({ items }) => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
      {items.map((item) => (
        <StartItem key={item.label} item={item} />
      ))}
    </div>
  );
};

export { TrackYourProgressList };