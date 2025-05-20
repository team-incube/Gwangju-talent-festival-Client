import Agree from "@/entities/slogan/ui/Agree";
import Check from "@/entities/slogan/ui/Check";
import Danger from "@/entities/slogan/ui/Danger";
import Inform from "@/shared/asset/svg/Inform";
import { Button } from "@/shared/ui";
import { useState } from "react";
import { isShow } from "@/shared/lib/show";

interface ModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  type: "agree" | "danger";
}

export default function Modal({ type, setIsOpen, isOpen }: ModalProps) {
  const [agree, setAgree] = useState<boolean | null>(null);

  if (isShow("slogan")) {
    return null;
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="p-24 bg-white border border-gray-300 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-20">
            <Inform />
            <h3 className="text-body2b">{type === "agree" ? "개인정보수집 동의서" : "주의사항"}</h3>
          </div>
          <span className="cursor-pointer" onClick={() => setIsOpen(false)}>
            ✕
          </span>
        </div>

        {type === "agree" ? <Agree /> : <Danger />}
        {type === "agree" && <Check setAgree={setAgree} />}

        <Button
          isDisabled={type === "agree" && agree !== true}
          onClick={() => setIsOpen(false)}
          className="w-full mt-12"
        >
          확인
        </Button>
      </div>
    </div>
  );
}
