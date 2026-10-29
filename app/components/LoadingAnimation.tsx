/* @ts-ignore */
import "./LoadingAnimation.css";


export default function LoadingAnimation() {
  return (
    <div
      className={`stry-loading`}
      role="status"
      aria-live="polite"
    >
      <div className="stry-loader" aria-hidden="true">
        <span className="stry-loader-dot stry-dot-1" />
        <span className="stry-loader-dot stry-dot-2" />
        <span className="stry-loader-dot stry-dot-3" />
        <span className="stry-loader-dot stry-dot-4" />
      </div>
    </div>
  );
}