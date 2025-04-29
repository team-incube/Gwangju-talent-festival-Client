import SloganHeader from "@/entities/slogan/ui/SloganHeader";
import { cn } from "@/shared/utils/cn";
import SloganFormContainer from "@/widgets/slogan/ui/SloganFormContainer";

export default function SloganPage() {
  return (
    <div className={cn("w-full max-w-[708px]")}>
      <SloganHeader />
      <SloganFormContainer />
    </div>
  );
}
