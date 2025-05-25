import { toast } from "sonner";

export const share = async () => {
  try {
    await navigator.share({
      text: [
        "📣 친구야! ‘光탈페’ 슬로건 공모하자!!",
        "",
        "슬로건만 잘 지어도 간식이 우리 반으로 🎁",
        "",
        "🥇 1등: 수상자 학급 간식",
        "🥈 2등: 치킨 세트🍗",
        "🥉 3등: 햄버거 세트🍔",
        "",
        "🔥 지금 바로 도전하자!",
        "https://www.xn--hc0b809dz3b.kr/slogan",
      ].join("\n"),
    });
    toast.success("공유하기에 성공했습니다.");
  } catch (e) {
    console.error(e);
    toast.error("공유하기에 실패했습니다.");
  }
};
