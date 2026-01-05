import { useEffect, useState, useRef, useCallback } from "react";
import { useIsMobile } from "./useIsMobile";

export type Direction = "up" | "down" | "left" | "right" | null;
export type RotationDirection = "left" | "right" | "down" | null;

export function useAvatarControls() {
  const isMobile = useIsMobile();
  const [direction, setDirection] = useState<Direction>(null); // Only "up" for forward movement
  const [rotationDirection, setRotationDirection] = useState<RotationDirection>(null); // "left", "right", or "down" for rotation
  const [isMoving, setIsMoving] = useState(false);
  const keysPressed = useRef<Set<string>>(new Set());
  const touchButtonsPressed = useRef<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default behavior for arrow keys to avoid page scrolling
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "W", "a", "A", "s", "S", "d", "D"].includes(e.key)) {
        e.preventDefault();
      }

      keysPressed.current.add(e.key);

      // Up key = forward movement
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        setDirection("up");
        setIsMoving(true);
      } 
      // Left/Right/Down keys = rotation only (no movement)
      else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        setRotationDirection("left");
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        setRotationDirection("right");
      } else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        setRotationDirection("down");
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key);
      
      // Handle up key release (stop movement)
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        setDirection(null);
        setIsMoving(false);
      }
      // Handle rotation key release
      else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        setRotationDirection(null);
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        setRotationDirection(null);
      } else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        setRotationDirection(null);
      }
      
      // If no keys are pressed, reset everything
      if (keysPressed.current.size === 0) {
        setDirection(null);
        setRotationDirection(null);
        setIsMoving(false);
      } else {
        // Check which keys are still pressed
        const remainingKeys = Array.from(keysPressed.current);
        if (remainingKeys.includes("ArrowUp") || remainingKeys.includes("w") || remainingKeys.includes("W")) {
          setDirection("up");
          setIsMoving(true);
        } else {
          setDirection(null);
          setIsMoving(false);
        }
        
        // Check rotation keys
        if (remainingKeys.includes("ArrowLeft") || remainingKeys.includes("a") || remainingKeys.includes("A")) {
          setRotationDirection("left");
        } else if (remainingKeys.includes("ArrowRight") || remainingKeys.includes("d") || remainingKeys.includes("D")) {
          setRotationDirection("right");
        } else if (remainingKeys.includes("ArrowDown") || remainingKeys.includes("s") || remainingKeys.includes("S")) {
          setRotationDirection("down");
        } else {
          setRotationDirection(null);
        }
      }
    };

    // Add event listeners with capture to ensure they fire
    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("keyup", handleKeyUp, true);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("keyup", handleKeyUp, true);
    };
  }, []);

  // Mobile touch control functions
  const handleTouchStart = useCallback((action: "up" | "left" | "right" | "down") => {
    touchButtonsPressed.current.add(action);

    if (action === "up") {
      setDirection("up");
      setIsMoving(true);
    } else if (action === "left") {
      setRotationDirection("left");
    } else if (action === "right") {
      setRotationDirection("right");
    } else if (action === "down") {
      setRotationDirection("down");
    }
  }, []);

  const handleTouchEnd = useCallback((action: "up" | "left" | "right" | "down") => {
    touchButtonsPressed.current.delete(action);
    
    if (action === "up") {
      setDirection(null);
      setIsMoving(false);
    } else {
      setRotationDirection(null);
    }
    
    // Check remaining pressed buttons
    if (touchButtonsPressed.current.size === 0) {
      setDirection(null);
      setRotationDirection(null);
      setIsMoving(false);
    } else {
      const remaining = Array.from(touchButtonsPressed.current);
      if (remaining.includes("up")) {
        setDirection("up");
        setIsMoving(true);
      } else {
        setDirection(null);
        setIsMoving(false);
      }
      
      if (remaining.includes("left")) {
        setRotationDirection("left");
      } else if (remaining.includes("right")) {
        setRotationDirection("right");
      } else if (remaining.includes("down")) {
        setRotationDirection("down");
      } else {
        setRotationDirection(null);
      }
    }
  }, []);

  return { 
    direction, 
    rotationDirection, 
    isMoving,
    // Mobile controls
    isMobile,
    handleTouchStart,
    handleTouchEnd
  };
}

