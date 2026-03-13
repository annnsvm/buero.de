type TrackYourProgressImgProps = {
  src: string;
  alt: string;
};

type TrackYourProgresStat = {
  value: string;
  label: string;
};

type TrackYourProgresStatItemProps = {
  item: TrackYourProgresStat;
};

type TrackYourProgresListProps = {
  items: TrackYourProgresStat[];
};

export type {
    TrackYourProgressImgProps,
    TrackYourProgresStat,
    TrackYourProgresStatItemProps,
    TrackYourProgresListProps,
};