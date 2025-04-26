import { Logo } from "@/shared/asset/svg/Logo";
import { cn } from "@/shared/utils/cn";
import Link from "next/link";

export default function Header() {
  return (
    <header className={cn("flex items-center py-[1rem] justify-around")}>
      <Link href="/">
        <Logo height={42} width={67} />
      </Link>
      <div className={cn("flex gap-[2.5rem] text-body3b")}>
        <Link href="/slogan">슬로건 공모</Link>
        <Link href="">참여신청</Link>
        <Link href="">FaQ</Link>
        <Link href="">예선</Link>
        <Link href="">예매</Link>
        <Link href="">본선</Link>
      </div>
      <div className={cn("flex gap-[1.5rem] text-body3b")}>
        <Link
          className={cn(
            "border-gray-100 border border-solid px-24 py-12 rounded-lg"
          )}
          href="/signin"
        >
          로그인
        </Link>
        <Link
          className={cn(
            "border-gray-100 border border-solid px-24 py-12 rounded-lg"
          )}
          href="/signup"
        >
          회원가입
        </Link>
      </div>
    </header>
  );
}
