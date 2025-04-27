import Button from "@/shared/ui/Button";
import { cn } from "@/shared/utils/cn";

type SubmitButtonProps = {
  buttonText?: string;
};

const SubmitButton = ({ buttonText }: SubmitButtonProps) => {
  return (
    <Button className={cn("w-full mt-32")} type="submit">
      {buttonText}
    </Button>
  );
};

export default SubmitButton;
