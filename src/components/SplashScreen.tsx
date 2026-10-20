import { useEffect, useState } from "react"
import AnimatedCrocodile from "./AnimatedCrocodile";
import "./SplashScreen.css";

type SplashScreenProps = {
  onComplete?: () => void;
  duration?: number;
};

export default function SplashScreen({
  onComplete,
  duration = 2600,
}: SplashScreenProps) {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const exitTimer = window.setTimeout(() => {
      setExiting(true);
    }, duration);

    const finishTimer = window.setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, duration + 700);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(finishTimer);
    };
  }, [duration, onComplete]);

  if (!visible) return null;

  return (
    <div
      className={`pn-splash ${exiting ? "pn-splash--exit" : ""}`}
      role="status"
      aria-label="Loading PUNUTIE Health Teacher"
      aria-live="polite"
    >
      <div className="pn-splash__content">
        <div className="pn-splash__logo-wrap">
          <div className="pn-splash__glow" />

          <AnimatedCrocodile className="pn-splash__animated-crocodile" />

          <span className="pn-splash__heartbeat" aria-hidden="true">
            <svg viewBox="0 0 120 40" fill="none">
              <path
                d="M3 21 H28 L39 21 L47 7 L58 34 L69 13 L77 21 H117"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>

        <div className="pn-splash__brand">
          <h1>PUNUTIE</h1>
          <p>HEALTH TEACHER</p>
        </div>

        <div
          className="pn-splash__loader"
          aria-label="Loading"
        >
          <span />
        </div>

        <p className="pn-splash__message">
          Your health. Our priority.
        </p>
      </div>
    </div>
  );
}

