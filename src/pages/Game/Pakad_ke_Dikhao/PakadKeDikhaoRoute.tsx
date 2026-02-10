import { useNavigate } from "react-router-dom";
import { PakadKeDikhaoGame } from "./PakadKeDikhaoGame";
import { usePlayer } from "../../../context/PlayerContext";
import { stopAllAudio } from "../../../utils/audio";

export function PakadKeDikhaoRoute() {
  const navigate = useNavigate();
  const { avatar } = usePlayer();

  const handleBack = () => {
    stopAllAudio();
    navigate("/game-selection");
  };

  return (
    <PakadKeDikhaoGame
      avatar={avatar}
      onBack={handleBack}
    />
  );
}
