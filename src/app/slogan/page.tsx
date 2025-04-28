import { cn } from "@/shared/utils/cn";
import SloganPage from "@/views/slogan/ui/SloganPage";

export default function Slogan() {
  return (
    <div className={cn("flex justify-center mt-[2.75rem] mb-[3.5rem]")}>
      <SloganPage />
    </div>
  );
}
