import { useNavigate } from "react-router-dom";
import { LetterMatchGame } from "./LetterMatchGame";
import { stopAllAudio } from "../../../utils/audio";

export function LetterMatchRoute() {
  const navigate = useNavigate();

  const handleBack = () => {
    stopAllAudio();
    navigate("/game-selection");
  };

  const handleGameComplete = () => {
    // Stop all audio and navigate back after a delay
    setTimeout(() => {
      stopAllAudio();
      navigate("/game-selection");
    }, 3000);
  };

  return (
    <LetterMatchGame
      onBack={handleBack}
      onGameComplete={handleGameComplete}
    />
  );
}

