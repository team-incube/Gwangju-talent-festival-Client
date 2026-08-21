"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/shared/ui/Modal";
import Button from "@/shared/ui/Button";
import X from "@/shared/asset/svg/X";
import Inform from "@/shared/asset/svg/Inform";
import { RightArrow } from "@/shared/asset/svg/RightArrow";
import { isTicketOpen } from "@/shared/config/dateConfig";
import { getTokenFromCookie, isLoggedIn } from "@/shared/utils/auth";

const STORAGE_KEY = "ticketOpenPopupHidden";

const GUEST_STEPS = ["회원가입", "로그인", "좌석 선택"] as const;

export default function TicketOpenPopup() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [doNotShow, setDoNotShow] = useState(false);

  useEffect(() => {
    if (!isTicketOpen(getTokenFromCookie("role"))) return;
    if (localStorage.getItem(STORAGE_KEY)) return;
    setLoggedIn(isLoggedIn());
    setIsOpen(true);
  }, []);

  const handleClose = () => {
    if (doNotShow) localStorage.setItem(STORAGE_KEY, "true");
    setIsOpen(false);
  };

  const handleMove = (href: string) => {
    handleClose();
    router.push(href);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      showCloseButton={false}
      overlayClassName="bg-black/60 p-16"
      className="relative w-[420px] max-w-full max-h-[90dvh] flex flex-col overflow-hidden rounded-2xl border-0 p-0 shadow-xl"
      contentClassName="min-h-0 overflow-y-auto"
    >
      <button
        type="button"
        aria-label="닫기"
        onClick={handleClose}
        className="absolute right-14 top-14 z-10 flex h-32 w-32 cursor-pointer items-center justify-center rounded-full bg-white/20 transition-colors hover:bg-white/30"
      >
        <X width={18} height={18} color="#FFFFFF" />
      </button>

      <div className="relative overflow-hidden bg-gradient-to-br from-orange-400 to-orange-500 px-24 pb-24 pt-28 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 -top-40 h-[160px] w-[160px] rounded-full bg-white/15"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-48 -left-24 h-[140px] w-[140px] rounded-full bg-white/10"
        />
        <div className="relative flex flex-col gap-10">
          <span className="w-fit rounded-full bg-white/25 px-12 py-4 text-caption2b tracking-[0.08em]">
            TICKET OPEN
          </span>
          <h3 className="text-title4b mobile:text-body1b break-keep">좌석 예매가 시작됐어요</h3>
          <p className="text-caption1r text-white/90 break-keep">
            2026 광탈페 본선 · 9월 5일(토) 광주교육대학교 풍향문화관
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-16 px-24 py-24">
        {loggedIn ? (
          <p className="text-body3r text-gray-800 break-keep">
            좌석 배치도에서 원하는 자리를 골라 바로 예매하실 수 있습니다.
          </p>
        ) : (
          <div className="flex flex-col gap-10">
            <p className="text-body3b text-black break-keep">
              회원가입 후 로그인하시면 예매할 수 있어요
            </p>
            <div className="flex items-center gap-6">
              {GUEST_STEPS.map((step, index) => (
                <div key={step} className="flex items-center gap-6">
                  {index > 0 && <RightArrow width={12} height={12} color="#BDBDBD" />}
                  <span className="rounded-full bg-orange-100 px-12 py-6 text-caption2b text-orange-500 mobile:px-10">
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-10 rounded-xl border border-solid border-orange-300 bg-orange-100 px-16 py-14">
          <span className="shrink-0 pt-2">
            <Inform width={18} height={18} color="#FF9644" />
          </span>
          <p className="text-caption1r text-gray-800 break-keep">
            온라인 좌석예매가 어려우신 분은 현장에서{" "}
            <strong className="text-caption1b text-orange-500">선착순(13:00~)</strong>으로 잔여석을
            배정받으실 수 있습니다.
          </p>
        </div>

        {loggedIn ? (
          <Button
            type="button"
            className="w-full rounded-lg"
            onClick={() => handleMove("/booking")}
          >
            <span className="flex items-center justify-center gap-8 text-body3b">
              예매하러 가기
              <RightArrow color="white" width={16} height={16} />
            </span>
          </Button>
        ) : (
          <div className="flex gap-8">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-lg"
              onClick={() => handleMove("/signin")}
            >
              로그인
            </Button>
            <Button type="button" className="flex-1 rounded-lg" onClick={() => handleMove("/signup")}>
              <span className="flex items-center justify-center gap-8">
                회원가입
                <RightArrow color="white" width={16} height={16} />
              </span>
            </Button>
          </div>
        )}

        <label
          htmlFor="ticketOpenDoNotShow"
          className="flex cursor-pointer select-none items-center justify-center gap-8 text-caption2r text-gray-500"
        >
          <input
            id="ticketOpenDoNotShow"
            type="checkbox"
            checked={doNotShow}
            onChange={e => setDoNotShow(e.target.checked)}
            className="h-[12px] w-[12px] cursor-pointer accent-orange-500"
          />
          다시 보지 않기
        </label>
      </div>
    </Modal>
  );
}
