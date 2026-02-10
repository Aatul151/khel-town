import { useNavigate } from "react-router-dom";
import { BhulBhalaiyaGame } from "./BhulBhalaiyaGame";
import { usePlayer } from "../../../context/PlayerContext";
import { stopAllAudio } from "../../../utils/audio";

export function BhulBhalaiyaRoute() {
  const navigate = useNavigate();
  const { avatar } = usePlayer();

  const handleBack = () => {
    stopAllAudio();
    navigate("/game-selection");
  };

  return <BhulBhalaiyaGame avatar={avatar} onBack={handleBack} />;
}
