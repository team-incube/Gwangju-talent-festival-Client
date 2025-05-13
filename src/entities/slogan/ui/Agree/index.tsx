export default function Agree() {
  return (
    <div className="border-gray-100 border border-solid text-caption1r h-[184px] overflow-y-scroll my-24 rounded-lg p-12">
      <p>
        [개인정보 수집·이용에 대한 안내 및 동의]
        <br /> 광주학생탈렌트페스티벌은 아래와 같이 개인정보를 수집·이용하고자 합니다. <br />
        내용을 자세히 읽으신 후 동의 여부를 결정하여 주시기 바랍니다.
      </p>
      <h5>1. 수집 항목</h5>
      <ul className="list-disc pl-16 marker:text-[10px]">
        <li>필수항목: 연락처(전화번호, 휴대폰번호), 학교, 반</li>
      </ul>
      <h5>2. 수집 및 이용 목적</h5>
      <ul className="list-disc pl-16 marker:text-[10px]">
        <li>서비스 제공 및 이용자 식별</li>
        <li>문의사항 처리 및 결과 회신</li>
      </ul>
      <h5>3. 보유 및 이용 기간</h5>
      <ul className="list-disc pl-16 marker:text-[10px]">
        <li>수집일로부터 동의 철회 시까지 보유 및 이용됩니다.</li>
        <li>양도 거절 시, 입상이 취소되며 시상품 지급도 불가합니다.</li>
      </ul>
      <h5>4. 동의를 거부할 권리 및 불이익 안내</h5>
      <ul className="list-disc pl-16 marker:text-[10px]">
        <li>개인정보 수집·이용에 대한 동의를 거부할 수 있습니다.</li>
        <li>단, 필수항목에 대한 동의 거부 시 서비스 이용이 제한될 수 있습니다.</li>
      </ul>
    </div>
  );
}
