import { useState } from "react";
import Agree from "@/entities/slogan/ui/Agree";
import Danger from "@/entities/slogan/ui/Danger";
import Inform from "@/shared/asset/svg/Inform";
import { Button, Modal as BaseModal, RadioGroup } from "@/shared/ui";

interface ModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  type: "agree" | "danger";
}

const CONSENT_OPTIONS = [
  { value: "agree", label: "동의" },
  { value: "disagree", label: "미동의" },
];

export default function Modal({ type, setIsOpen, isOpen }: ModalProps) {
  const [agree, setAgree] = useState<string | null>(null);

  const handleClose = () => setIsOpen(false);

  const footer = (
    <Button
      isDisabled={type === "agree" && agree !== "agree"}
      onClick={handleClose}
      className="w-full"
    >
      확인
    </Button>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={type === "agree" ? "개인정보수집 동의서" : "주의사항"}
      icon={<Inform />}
      showCloseButton={false}
      footer={footer}
    >
      {type === "agree" ? <Agree /> : <Danger />}
      {type === "agree" && (
        <RadioGroup
          name="consent"
          options={CONSENT_OPTIONS}
          value={agree}
          onChange={setAgree}
        />
      )}
    </BaseModal>
  );
}
