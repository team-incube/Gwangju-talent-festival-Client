type DescriptionCardProps = {
  title: string;
  items: string[];
  renderCustomItem?: (item: string, index: number) => React.ReactNode;
};

export const DescriptionCard = ({ title, items, renderCustomItem }: DescriptionCardProps) => {
  return (
    <div className="bg-gray-100 rounded-lg p-22">
      <h2 className="text-body3b font-bold mb-6">{title}</h2>
      <ul className="text-gray-500 list-disc pl-5 space-y-1 text-body3r">
        {items.map((item, index) => (
          <li key={index}>
            {renderCustomItem ? renderCustomItem(item, index) : item}
          </li>
        ))}
      </ul>
    </div>
  );
};
