import { useNavigate } from "react-router-dom";
import { ObstacleDodgeGame } from "./ObstacleDodgeGame";
import { usePlayer } from "../../../context/PlayerContext";
import { stopAllAudio } from "../../../utils/audio";

export function ObstacleDodgeRoute() {
  const navigate = useNavigate();
  const { avatar } = usePlayer();

  const handleBack = () => {
    stopAllAudio();
    navigate("/game-selection");
  };

  return (
    <ObstacleDodgeGame
      avatar={avatar}
      onBack={handleBack}
    />
  );
}

