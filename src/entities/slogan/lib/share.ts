import { toast } from "sonner";

export const share = async () => {
  try {
    await navigator.share({
      title: "광주탈렌트페스티벌 슬로건 공모전",
      text: "슬로건 공모전 참여하기",
      url: "https://www.xn--hc0b809dz3b.kr/slogan",
    });
    toast.success("공유하기에 성공했습니다.");
  } catch (e) {
    console.error(e);
    toast.error("공유하기에 실패했습니다.");
  }
};
