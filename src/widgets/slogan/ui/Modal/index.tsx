"use client";

import Inform from "@/shared/asset/svg/Inform";
import X from "@/shared/asset/svg/X";
import { Button } from "@/shared/ui";
import { useState } from "react";

export default function Modal() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="p-24 bg-white h-[350px] border border-gray-300 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-20">
            <Inform />
            <h3 className="text-body2b">주의사항</h3>
          </div>
          <span className="cursor-pointer" onClick={() => setIsOpen(false)}>
            <X />
          </span>
        </div>
        <div className="border-gray-100 border border-solid text-caption1r h-[184px] overflow-y-scroll my-24 rounded-lg p-12">
          <h5>1. 순수 창작물 제출 필수</h5>
          <ul className="list-disc pl-16 marker:text-[10px]">
            <li>응모작은 반드시 본인의 순수 창작물이어야 합니다.</li>
            <li>표절, 명의 도용, 기 발표된 작품은 심사 대상에서 제외됩니다.</li>
            <li>
              수상 후라도 이 사실이 밝혀질 경우, 수상 취소 및 상품 회수가
              이루어집니다.
            </li>
          </ul>
          <h5>2. 저작권 책임은 응모자에게 있음</h5>
          <ul className="list-disc pl-16 marker:text-[10px]">
            <li>저작권법을 철저히 준수해야 합니다.</li>
            <li>
              저작권 관련 문제가 발생할 경우, 모든 법적 책임은 응모자에게 있음을
              유의하세요.
            </li>
            <li>응모 전, 관련 문제를 완전히 해결한 후 제출해야 합니다.</li>
          </ul>
          <h5>3. 저작재산권 양도 의무</h5>
          <ul className="list-disc pl-16 marker:text-[10px]">
            <li>
              입상자는 수상과 동시에, 해당 작품의 저작재산권 및 일체의
              권리를광주광역시교육청에 양도해야 합니다.
            </li>
            <li>양도 거절 시, 입상이 취소되며 시상품 지급도 불가합니다.</li>
          </ul>
          <h5>4. 심사 관련 사항</h5>
          <ul className="list-disc pl-16 marker:text-[10px]">
            <li>심사 내용은 비공개이며, 결과에 대해 이의 제기 불가합니다.</li>
            <li>
              심사 결과에 따라, 입상작 전부 또는 일부가 선정되지 않을 수도
              있습니다.
            </li>
          </ul>
          <h5>5. 활용 및 변경 가능성</h5>
          <ul className="list-disc pl-16 marker:text-[10px]">
            <li>
              광주광역시교육청은 입상작의 전체 또는 일부를 창작적으로 변경해
              활용할 수 있습니다.
            </li>
            <li>경우에 따라, 최종적으로 활용되지 않을 수도 있습니다.</li>
          </ul>
          <h5>6. 슬로건 중복 시 기준</h5>
          <ul className="list-disc pl-16 marker:text-[10px]">
            <li>
              동일한 슬로건이 접수된 경우, ‘접수 우선순위’에 따라 선정됩니다.
            </li>
          </ul>
        </div>
        <Button className="w-full">확인</Button>
      </div>
    </div>
  );
}
