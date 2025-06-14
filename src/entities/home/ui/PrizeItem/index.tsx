type PrizeItemProps = Readonly<{
  rank: string;
  bg: string;
  emoji: string;
  desc: string;
  slogan: string;
}>;

const PrizeItem: React.FC<PrizeItemProps> = ({ rank, bg, emoji, desc, slogan }) => {
  return (
    <div key={rank} className="flex flex-col items-center gap-[16px]">
      <div
        className={`w-[60px] h-[60px] mobile:w-[36px] mobile:h-[36px] flex justify-center items-center rounded-full text-white text-body1r mobile:text-caption2r ${bg}`}
      >
        {rank}
      </div>
      <div className="flex flex-col gap-[2px]">
        <div className="text-lg mobile:text-caption1b text-gray-400">{emoji}</div>
        <div className="text-lg mobile:text-caption1b">{desc}</div>
        <div className={`text-lg mobile:text-caption1b `}>{slogan}</div>
      </div>
    </div>
  );
};

export default PrizeItem;
