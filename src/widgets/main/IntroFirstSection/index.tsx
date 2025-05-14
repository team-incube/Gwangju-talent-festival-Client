import { cn } from "@/shared/utils/cn";
import Video from "@/entities/home/ui/Video";

const IntroFirstSection = () => {
  return (
    <section
      id="section1"
      className={cn(
        "mobile:h-auto",
        "tablet:h-auto",
        "h-[calc(100vh-4.625rem)]",
        "w-full",
        "relative",
        "top-0",
        "flex",
        "justify-center",
        "bg-black",
      )}
    >
      <Video />
    </section>
  );
};

export default IntroFirstSection;
