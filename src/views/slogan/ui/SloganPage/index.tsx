"use client";

import { cn } from "@/shared/utils/cn";
import Modal from "@/widgets/slogan/ui/Modal";
import SloganFormContainer from "@/widgets/slogan/ui/SloganFormContainer";
import { useState } from "react";

export default function SloganPage() {
  const [agree, setAgree] = useState(true);
  const [danger, setDanger] = useState(true);
  return (
    <div className={cn("w-full max-w-[708px]")}>
      <SloganFormContainer />
      <Modal type="danger" setIsOpen={setDanger} isOpen={danger} />
      {danger === false && <Modal type="agree" setIsOpen={setAgree} isOpen={agree} />}
    </div>
  );
}
