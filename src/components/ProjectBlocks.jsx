export default function ProjectBlocks({ blocks = [] }) {
  return (
    <div className="project-content">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "text":
            return (
              <section key={i} className="project-block project-block-text">
                {b.title && <h3 className="project-block-title">{b.title}</h3>}
                <p className="project-block-text">{b.text}</p>
              </section>
            );

          case "image":
            return (
              <section key={i} className="project-block project-block-image">
                <img className="project-img" src={b.src} alt={b.alt || ""} />
                {b.caption && <div className="project-caption">{b.caption}</div>}
              </section>
            );

          case "gallery":
            return (
              <section key={i} className="project-block project-block-gallery">
                <div
                  className="project-gallery"
                  style={{ gridTemplateColumns: `repeat(${b.columns || 2}, 1fr)` }}
                >
                  {b.images?.map((img, idx) => (
                    <img
                      key={idx}
                      className="project-img"
                      src={img.src}
                      alt={img.alt || ""}
                    />
                  ))}
                </div>
              </section>
            );

          case "split":
            return (
              <section
                key={i}
                className={`project-block project-block-split ${
                  b.align === "left" ? "is-left" : "is-right"
                }`}
              >
                <div className="project-split-text">
                  {b.title && <h3 className="project-block-title">{b.title}</h3>}
                  {b.text && <p className="project-block-text">{b.text}</p>}
                </div>

                <div className="project-split-media">
                  {b.media?.type === "image" && (
                    <img
                      className="project-img"
                      src={b.media.src}
                      alt={b.media.alt || ""}
                    />
                  )}
                </div>
              </section>
            );

          case "list":
            return (
              <section key={i} className="project-block project-block-list">
                {b.title && <h3 className="project-block-title">{b.title}</h3>}
                <ul className="project-list">
                  {b.items?.map((it, idx) => (
                    <li key={idx}>{it}</li>
                  ))}
                </ul>
              </section>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
