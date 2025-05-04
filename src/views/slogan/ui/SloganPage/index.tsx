import { cn } from "@/shared/utils/cn";
import Modal from "@/widgets/slogan/ui/Modal";
import SloganFormContainer from "@/widgets/slogan/ui/SloganFormContainer";

export default function SloganPage() {
  return (
    <div className={cn("w-full max-w-[708px]")}>
      <SloganFormContainer />
      <Modal />
    </div>
  );
}
