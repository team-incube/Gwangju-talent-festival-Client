import Modal from "@/shared/ui/Modal";
import HandwritingPreview from "@/entities/judging/ui/HandwritingPreview";
import { Stroke } from "@/entities/judging/model/handwriting";

type TeamDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  teamName: string;
  judgeLabel: string;
  strokes: Stroke[] | null;
};

const TeamDetailModal = ({
  isOpen,
  onClose,
  teamName,
  judgeLabel,
  strokes,
}: TeamDetailModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${teamName} · ${judgeLabel}`}
      className="w-full max-w-[720px]"
    >
      <HandwritingPreview
        strokes={strokes}
        emptyLabel="작성된 코멘트가 없습니다"
        className="h-[420px] border border-gray-100 rounded-lg"
      />
    </Modal>
  );
};

export default TeamDetailModal;
