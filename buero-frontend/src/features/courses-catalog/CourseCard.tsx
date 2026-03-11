import type { FC } from 'react';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';

export type CourseCardProps = {
  id: string;
  title: string;
  category: string;
  levelLabel: string;
  badge?: string;
  imageUrl: string;
  description: string;
  price: string;
  lessonsCount: number;
  durationHours: number;
  tags: string[];
  rating?: number;
  isAdded?: boolean;
  onClick?: () => void;
};

const CourseCard: FC<CourseCardProps> = ({
  title,
  category,
  levelLabel,
  badge,
  imageUrl,
  description,
  price,
  lessonsCount,
  durationHours,
  tags,
  rating,
  isAdded,
  onClick,
}) => {
  return (
    <article
      className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 w-full"
      style={{ maxWidth: '405px'}}
      onClick={onClick}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[11px] font-bold text-gray-900 shadow-sm">
            {levelLabel}
          </span>
          {badge && (
            <span className="rounded-full bg-[#FF6B54] px-3 py-1.5 text-[10px] font-bold text-white shadow-sm uppercase tracking-wider">
              {badge}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#FF6B54]">
          {category}
        </p>

        <h3 className="mt-3 text-[22px] font-bold text-gray-900 leading-tight">
          {title}
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-500">
          {description}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-lg bg-gray-50 px-3 py-1.5 text-[11px] font-medium text-gray-600 border border-gray-100"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-auto">
          <div className="pt-6 flex items-center justify-between border-t border-gray-50 text-gray-400">
            <div className="flex gap-5 text-[12px]">
              <span className="flex items-center gap-2">
                <Icon name="icon-book" size={16} className="text-gray-300" />
                {lessonsCount} lessons
              </span>
              <span className="flex items-center gap-2">
                <Icon name="icon-schedule" size={16} className="text-gray-300" />
                {durationHours}h
              </span>
            </div>
            {rating && (
              <span className="flex items-center gap-1.5 text-[12px] font-bold text-gray-900">
                <Icon name="icon-star" size={16} color="#facc15" />
                {rating.toFixed(1)}
              </span>
            )}
          </div>
          <div className="mt-5 flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">{price}</span>

            <button
              type="button"
              className={`flex items-center gap-3 rounded-full px-6 py-3 text-sm font-bold transition-all
                ${isAdded 
                  ? 'bg-black text-white' 
                  : 'bg-[#FF6B54] text-white hover:bg-[#fa5a40] shadow-md active:scale-95'
                }`}
            >
              {isAdded ? (
                <>
                  <span>Added</span>
                  <Icon name="icon-cart" size={18} color="white" />
                </>
              ) : (
                <>
                  <Icon name="icon-cart" size={18} color="white" />
                  <span>Add to Cart</span>
                </>
              )}
            </button> 
            {/* <Button
            variant={isAdded ? 'solid' : 'primary'} 
            className="gap-3"
          >
            {isAdded ? (
              <>
                <span>Added</span>
                <Icon name="icon-check" size={18} color="white" />
              </>
            ) : (
              <>
                <Icon name="icon-cart" size={18} color="white" />
                <span>Add to Cart</span>
              </>
            )}
          </Button> */}
          </div>
        </div>
      </div>
    </article>
  );
};

export default CourseCard;