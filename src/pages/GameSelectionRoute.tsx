import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GameSelectionPage, GameInfo, GameId } from "./GameSelectionPage";
import { CongratulationsPopup } from "../components/CongratulationsPopup";
import { usePlayer } from "../context/PlayerContext";
import { getProgress } from "../utils/storage";
import { getContentForMode } from "../data/index";
import { stopAllAudio } from "../utils/audio";

export function GameSelectionRoute() {
  const navigate = useNavigate();
  const { playerName, avatar } = usePlayer();
  const [showCongratulations, setShowCongratulations] = useState(false);

  // Define available games
  const getGames = (): GameInfo[] => {
    const alphabetProgress = getProgress("alphabet");
    const alphabetContent = getContentForMode("alphabet");
    const alphabetCompleted = alphabetContent.length > 0 &&
      alphabetProgress.completedItems.length >= alphabetContent.length;

    return [
      {
        id: "alphabet-finder",
        name: "Alphabet Finder",
        description: "Find letters and learn phonics",
        emoji: "🔤",
        color: "#3b82f6",
        completed: alphabetCompleted,
      },
    ];
  };

  // Check if all games are completed
  useEffect(() => {
    const games = getGames();
    const allCompleted = games.length > 0 && games.every((game) => game.completed);

    if (allCompleted && !showCongratulations) {
      setShowCongratulations(true);
    }
  }, [showCongratulations]);

  // Stop background music when on this page
  useEffect(() => {
    stopAllAudio();
  }, []);

  const handleSelectGame = (gameId: GameId) => {
    navigate(`/game/${gameId}`);
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleCloseCongratulations = () => {
    setShowCongratulations(false);
  };

  return (
    <>
      <GameSelectionPage
        playerName={playerName}
        avatar={avatar}
        games={getGames()}
        onSelectGame={handleSelectGame}
        onBack={handleBack}
      />
      {showCongratulations && (
        <CongratulationsPopup onClose={handleCloseCongratulations} />
      )}
    </>
  );
}

