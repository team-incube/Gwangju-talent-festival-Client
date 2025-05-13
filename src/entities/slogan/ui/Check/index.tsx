import { useState } from "react";

export default function Check({ setAgree }: { setAgree: (agree: boolean) => void }) {
  const [selected, setSelected] = useState<"agree" | "disagree" | null>(null);

  const handleChange = (value: "agree" | "disagree") => {
    setSelected(value);
    setAgree(value === "agree");
  };

  return (
    <div className="mb-24 ml-24">
      <label className="flex gap-8 mb-6 items-center cursor-pointer">
        <input
          type="radio"
          name="consent"
          className="accent-black text-body3r scale-100"
          checked={selected === "agree"}
          onChange={() => handleChange("agree")}
        />
        <span className="text-lg">동의</span>
      </label>
      <label className="flex items-center gap-8 cursor-pointer">
        <input
          type="radio"
          name="consent"
          className="accent-black text-body3r scale-100"
          checked={selected === "disagree"}
          onChange={() => handleChange("disagree")}
        />
        <span className="text-lg">미동의</span>
      </label>
    </div>
  );
}
