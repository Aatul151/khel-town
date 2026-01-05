import { useNavigate } from "react-router-dom";
import { AlphabetFinderGame } from "./AlphabetFinderGame";
import { usePlayer } from "../../../context/PlayerContext";
import { stopAllAudio } from "../../../utils/audio";
import { getProgress } from "../../../utils/storage";
import { getContentForMode } from "../../../data/index";

export function AlphabetFinderRoute() {
  const navigate = useNavigate();
  const { avatar } = usePlayer();

  const handleBack = () => {
    stopAllAudio();
    navigate("/game-selection");
  };

  const handleGameComplete = () => {
    // Check if game is completed
    const alphabetProgress = getProgress("alphabet");
    const alphabetContent = getContentForMode("alphabet");
    const isCompleted = alphabetContent.length > 0 &&
      alphabetProgress.completedItems.length >= alphabetContent.length;

    if (isCompleted) {
      // Stop all audio and navigate back
      handleBack();
    }
  };

  return (
    <AlphabetFinderGame
      avatar={avatar}
      onBack={handleBack}
      onGameComplete={handleGameComplete}
    />
  );
}

