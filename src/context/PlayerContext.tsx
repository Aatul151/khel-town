import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AvatarType } from "../components/AvatarSelector";
import { getPlayerData, savePlayerData } from "../utils/storage";

interface PlayerContextType {
  playerName: string;
  avatar: AvatarType;
  setPlayerName: (name: string) => void;
  setAvatar: (avatar: AvatarType) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  // Load player data from storage on mount
  const [playerName, setPlayerNameState] = useState<string>(() => {
    const saved = getPlayerData();
    return saved.playerName;
  });
  const [avatar, setAvatarState] = useState<AvatarType>(() => {
    const saved = getPlayerData();
    return saved.avatar;
  });

  // Save to storage whenever player data changes
  useEffect(() => {
    if (playerName || avatar) {
      savePlayerData({
        playerName,
        avatar,
      });
    }
  }, [playerName, avatar]);

  // Wrapper functions that update state and trigger storage save
  const setPlayerName = (name: string) => {
    setPlayerNameState(name);
  };

  const setAvatar = (avatarType: AvatarType) => {
    setAvatarState(avatarType);
  };

  return (
    <PlayerContext.Provider value={{ playerName, avatar, setPlayerName, setAvatar }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}

