import { useEffect } from "react";

export default function TrailerModal({ videoKey, onClose }) {
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!videoKey) return null;

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal__backdrop" onClick={onClose} />
      <div className="modal__content">
        <button className="modal__close" type="button" onClick={onClose}>
          ✕
        </button>
        <div className="modal__video">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`}
            title="Trailer"
            allow="autoplay; fullscreen"
            frameBorder="0"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
