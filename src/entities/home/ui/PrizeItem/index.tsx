type PrizeItemProps = Readonly<{
  rank: string;
  bg: string;
  emoji: string;
  desc: string;
}>;

const PrizeItem: React.FC<PrizeItemProps> = ({ rank, bg, emoji, desc }) => {
  return (
    <div key={rank} className="flex flex-col items-center gap-[16px]">
      <div
        className={`w-[60px] h-[60px] mobile:w-[36px] mobile:h-[36px] flex justify-center items-center rounded-full text-white text-body1r mobile:text-caption2r ${bg}`}
      >
        {rank}
      </div>
      <div className="text-lg mobile:text-caption1b ">
        {emoji} {desc}
      </div>
    </div>
  );
};

export default PrizeItem;
