import confetti from "canvas-confetti";

interface ConfettiConfig {
  duration?: number;
  interval?: number;
  defaults?: {
    startVelocity?: number;
    spread?: number;
    ticks?: number;
    zIndex?: number;
  };
}

export const useConfetti = (config: ConfettiConfig = {}) => {
  const {
    duration = 5000,
    interval = 250,
    defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 0,
    },
  } = config;

  const randomInRange = (min: number, max: number): number => {
    return Math.random() * (max - min) + min;
  };

  const fireConfetti = () => {
    // Guard against SSR
    if (process.server || typeof window === "undefined") {
      return () => {};
    }

    const animationEnd = Date.now() + duration;
    let intervalId: number;

    intervalId = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(intervalId);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      // Fire confetti from both sides
      [
        { xMin: 0.1, xMax: 0.3 },
        { xMin: 0.7, xMax: 0.9 },
      ].forEach(({ xMin, xMax }) => {
        confetti({
          ...defaults,
          particleCount,
          origin: {
            x: randomInRange(xMin, xMax),
            y: Math.random() - 0.2,
          },
        });
      });
    }, interval);

    return () => clearInterval(intervalId);
  };

  return {
    fireConfetti,
  };
};
