import { useRef } from "react";

export default function CarouselRow({
  title,
  items,
  selectedIds = [],
  onToggleItem,
  onCardClick,
}) {
  const containerRef = useRef(null);

  const scroll = (direction) => {
    const container = containerRef.current;
    if (!container) return;

    const amount = container.offsetWidth * 0.9;
    const left = direction === "left" ? -amount : amount;

    container.scrollBy({ left, behavior: "smooth" });
  };

  return (
    <section className="row" aria-label={title}>
      <div className="row__header">
        <h2 className="row__title">{title}</h2>
        <div className="row__controls">
          <button
            type="button"
            className="row__control"
            aria-label={`Scroll ${title} left`}
            onClick={() => scroll("left")}
          >
            ‹
          </button>
          <button
            type="button"
            className="row__control"
            aria-label={`Scroll ${title} right`}
            onClick={() => scroll("right")}
          >
            ›
          </button>
        </div>
      </div>

      <div className="row__gallery carousel" ref={containerRef}>
        {items.map((item) => {
          const isSelected = selectedIds.includes(item.id);

          return (
            <div
              key={item.id || item.title}
              className="card carousel__item"
              role="button"
              tabIndex={0}
              onClick={() =>
                onCardClick
                  ? onCardClick(item)
                  : alert(`Playing: ${item.title || item.name}`)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onCardClick
                    ? onCardClick(item)
                    : alert(`Playing: ${item.title || item.name}`);
                }
              }}
            >
              <img
                className="card__image"
                src={item.image}
                alt={item.title || item.name}
              />
              <div className="card__overlay">
                <h3 className="card__title">{item.title || item.name}</h3>
                {item.meta ? <p className="card__meta">{item.meta}</p> : null}
                {onToggleItem ? (
                  <button
                    type="button"
                    className={`card__action ${
                      isSelected ? "card__action--active" : ""
                    }`}
                    onClick={(event) => {
                      event.stopPropagation();
                      onToggleItem(item);
                    }}
                  >
                    {isSelected ? "✓ My List" : "+ My List"}
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
