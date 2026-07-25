type DescriptionCardProps = {
  title: string;
  items: string[];
  renderCustomItem?: (item: string, index: number) => React.ReactNode;
  large?: boolean;
};

export const DescriptionCard = ({
  title,
  items,
  renderCustomItem,
  large = false,
}: DescriptionCardProps) => {
  return (
    <div className="bg-white border border-gray-100 border-l-4 border-l-orange-400 rounded-xl p-22">
      <h2 className={`${large ? "text-body1b" : "text-body3b"} mb-16`}>{title}</h2>
      <ul className={`text-gray-600 space-y-8 ${large ? "text-body2r" : "text-body3r"}`}>
        {items.map((item, index) => (
          <li key={index} className="flex gap-8 items-start">
            <span className={`mt-10 shrink-0 rounded-full bg-orange-400 ${large ? "w-8 h-8" : "w-6 h-6"}`} />
            <span>{renderCustomItem ? renderCustomItem(item, index) : item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
