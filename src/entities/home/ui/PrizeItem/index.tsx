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
        className={`w-[60px] h-[60px] flex justify-center items-center rounded-full text-white text-body1r ${bg}`}
      >
        {rank}
      </div>
      <div className="text-lg font-semibold">
        {emoji} {desc}
      </div>
    </div>
  );
};

export default PrizeItem;
