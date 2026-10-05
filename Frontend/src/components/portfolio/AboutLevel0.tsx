import { renderInline } from "@/portfolio/inline";
import type { AboutContent } from "@/portfolio/types";

const STYLES = `
.level0-about{
  --ink:#1F1F1E;
  --bone:#E9E4DA;
  --muted:#8A857B;
  --rule:#35332F;
  --signal:#7FA88C;
  --prune:#9E5A4E;

  --display:"Bricolage Grotesque","Helvetica Neue",Arial,sans-serif;
  --body:"IBM Plex Sans","Helvetica Neue",Arial,sans-serif;
  --mono:"IBM Plex Mono",ui-monospace,SFMono-Regular,Menlo,monospace;

  background:var(--ink);color:var(--bone);
  font-family:var(--body);font-size:0.9375rem;line-height:1.55;
  border-radius:0.875rem;
  overflow:hidden;

  /* This block lives inside a user-resizable panel, so it responds to its own
     width rather than the viewport's. All breakpoints below are @container. */
  container-type:inline-size;
  container-name:level0;
}
.level0-about *{box-sizing:border-box}
.level0-about a{color:inherit}
.level0-about .l0-wrap{max-width:100%;margin:0 auto;padding:clamp(1.25rem,4cqi,2rem) clamp(0.875rem,3.5cqi,1.375rem) 2.75rem}

.level0-about .l0-hero{padding:0.5rem 0;max-width:57.5rem}
.level0-about .l0-eyebrow{font-family:var(--mono);font-size:0.6875rem;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin:0 0 1.25rem}
.level0-about h1.l0-h1{font-family:var(--display);font-weight:700;font-size:clamp(1.375rem,5cqi,2.5rem);line-height:1.12;letter-spacing:-.02em;margin:0 0 1.25rem}
.level0-about .l0-h1 .l0-thin{color:var(--muted);font-weight:500}
.level0-about .l0-lede{font-size:0.90625rem;color:var(--muted);max-width:62ch;margin:0 0 0.875rem}
.level0-about .l0-lede em{color:var(--bone);font-style:normal}

.level0-about .l0-links{display:flex;flex-wrap:wrap;gap:clamp(0.75rem,3cqi,1.375rem);margin-top:1.75rem}
.level0-about .l0-links a{font-family:var(--mono);font-size:0.78125rem;text-decoration:none;border-bottom:0.0625rem solid var(--rule);
  padding-bottom:0.1875rem;transition:border-color .18s ease,color .18s ease}
.level0-about .l0-links a:hover{border-color:var(--signal);color:var(--signal)}

.level0-about section.l0-section{margin-top:clamp(2.5rem,7cqi,4rem)}
.level0-about .l0-head{display:flex;align-items:baseline;gap:0.75rem;margin:0 0 1.625rem;padding-bottom:0.6875rem;border-bottom:0.0625rem solid var(--rule);flex-wrap:wrap}
.level0-about .l0-head h2{font-family:var(--display);font-weight:500;font-size:1.0625rem;letter-spacing:-.01em;margin:0}
.level0-about .l0-head .l0-tick{font-family:var(--mono);font-size:0.65625rem;color:var(--muted);letter-spacing:.1em}

/* Wide diagram: scrolls sideways in its own box rather than forcing the page
   to scroll, so the labels stay legible instead of shrinking to nothing. */
.level0-about .l0-depth{overflow-x:auto;-webkit-overflow-scrolling:touch;padding-bottom:0.375rem}
.level0-about .l0-depth svg{display:block;min-width:min(43.75rem,140cqi);width:100%;height:auto}
/* The d-* sizes below stay in px on purpose: inside an SVG they are viewBox
   user units, so they already scale with the diagram. rem would decouple them
   from the geometry they label. */
.level0-about .d-lab{font-family:var(--mono);font-size:11px;fill:var(--bone)}
.level0-about .d-note{font-family:var(--mono);font-size:10px;fill:var(--muted)}
.level0-about .d-track{fill:none;stroke:var(--rule);stroke-width:1}
.level0-about .d-fill{stroke:var(--signal);stroke-width:5;stroke-linecap:butt}
.level0-about .d-fill.low{stroke:var(--muted);opacity:.5}
.level0-about .d-scale{font-family:var(--mono);font-size:9.5px;fill:var(--muted);letter-spacing:.1em}
.level0-about .d-tick{stroke:var(--rule);stroke-width:1;stroke-dasharray:2 4}

.level0-about .l0-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(11.875rem,100%),1fr));gap:0.0625rem;background:var(--rule);border:0.0625rem solid var(--rule)}
.level0-about .l0-card{background:var(--ink);padding:1.375rem 1.25rem 1.5rem}
.level0-about .l0-card .l0-kicker{font-family:var(--mono);font-size:0.59375rem;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);display:block;margin-bottom:0.875rem}
.level0-about .l0-card h3{font-family:var(--display);font-weight:500;font-size:clamp(1.375rem,4cqi,1.625rem);letter-spacing:-.02em;margin:0 0 0.5625rem;line-height:1}
.level0-about .l0-card h3 .l0-sm{font-size:0.8125rem;color:var(--muted);margin-left:0.3125rem}
.level0-about .l0-card p{margin:0;font-size:0.8125rem;color:var(--muted);line-height:1.6}
.level0-about .l0-card .l0-src{font-family:var(--mono);font-size:0.625rem;color:var(--muted);display:block;margin-top:0.8125rem;padding-top:0.6875rem;border-top:0.0625rem solid var(--rule)}

.level0-about .l0-cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(15rem,100%),1fr));gap:clamp(1.5rem,5cqi,2.5rem)}
.level0-about .l0-cols p{margin:0 0 0.875rem;font-size:0.84375rem;color:var(--muted);max-width:50ch}
.level0-about .l0-cols strong{color:var(--bone);font-weight:500}
.level0-about .l0-cols p:last-child{margin-bottom:0}

.level0-about .l0-limits{border-left:0.125rem solid var(--prune);padding-left:1rem;max-width:70ch}
.level0-about .l0-limits li{font-size:0.84375rem;color:var(--muted);margin-bottom:0.625rem;line-height:1.6}
.level0-about .l0-limits li b{color:var(--bone);font-weight:500}
.level0-about .l0-limits ul{margin:0;padding-left:1rem}

/* Long URLs / identifiers must never widen the block past its container. */
.level0-about a,.level0-about code{overflow-wrap:anywhere}

`;

/* Depth chart geometry, in SVG user units: bars run from TRACK_X0 to TRACK_X1. */
const TRACK_X0 = 180;
const TRACK_X1 = 700;
const ROW_Y0 = 44;
const ROW_STEP = 34;
/** Bars below this level render muted — the "honestly thin" areas. */
const LOW_LEVEL = 30;

const levelX = (level: number) => TRACK_X0 + (Math.min(100, Math.max(0, level)) / 100) * (TRACK_X1 - TRACK_X0);

interface AboutLevel0Props {
  /** The About template, as returned by the chat's about tool or edited on the admin page. */
  data: AboutContent;
}

const AboutLevel0 = ({ data: about }: AboutLevel0Props) => {
  const { depth, evidence, approach, limits } = about;

  const lastRowY = ROW_Y0 + ROW_STEP * Math.max(0, depth.rows.length - 1);
  const approachSplit = Math.ceil(approach.points.length / 2);

  return (
    <div className="level0-about">
      <style>{STYLES}</style>
      <div className="l0-wrap">
        <header className="l0-hero">
          <p className="l0-eyebrow">{about.eyebrow}</p>
          <h1 className="l0-h1">
            {about.headline}
            {about.subheadline && (
              <>
                <br />
                <span className="l0-thin">{about.subheadline}</span>
              </>
            )}
          </h1>
          {about.lede.map((paragraph, i) => (
            <p key={i} className="l0-lede">
              {renderInline(paragraph)}
            </p>
          ))}

          {about.links.length > 0 && (
            <div className="l0-links">
              {about.links.map(({ label, url }) => (
                <a
                  key={url + label}
                  href={url}
                  {...(url.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                >
                  {label}
                </a>
              ))}
            </div>
          )}
        </header>

        {/* DEPTH CHART */}
        {depth.rows.length > 0 && (
          <section className="l0-section">
            <div className="l0-head">
              <h2>{depth.title}</h2>
              <span className="l0-tick">{depth.tick}</span>
            </div>

            <div className="l0-depth">
              <svg
                viewBox={`0 0 1020 ${lastRowY + 18}`}
                role="img"
                aria-label={`Depth chart. ${depth.rows.map((r) => `${r.label}: ${r.note}`).join(". ")}`}
              >
                <g>
                  {depth.scale.map(({ label, level }) => (
                    <g key={label}>
                      <line className="d-tick" x1={levelX(level)} y1="20" x2={levelX(level)} y2={lastRowY - 10} />
                      <text className="d-scale" x={levelX(level)} y="14">{label}</text>
                    </g>
                  ))}
                </g>

                <g>
                  {depth.rows.map(({ label, level, note }, i) => {
                    const y = ROW_Y0 + ROW_STEP * i;
                    return (
                      <g key={label + i}>
                        <text className="d-lab" x="0" y={y + 4}>{label}</text>
                        <line className="d-track" x1={TRACK_X0} y1={y} x2={TRACK_X1} y2={y} />
                        <line className={`d-fill${level < LOW_LEVEL ? " low" : ""}`} x1={TRACK_X0} y1={y} x2={levelX(level)} y2={y} />
                        <text className="d-note" x="720" y={y + 4}>{note}</text>
                      </g>
                    );
                  })}
                </g>
              </svg>
            </div>
          </section>
        )}

        {/* EVIDENCE */}
        {evidence.cards.length > 0 && (
          <section className="l0-section">
            <div className="l0-head">
              <h2>{evidence.title}</h2>
              <span className="l0-tick">{evidence.tick}</span>
            </div>

            <div className="l0-cards">
              {evidence.cards.map((card, i) => (
                <div key={i} className="l0-card">
                  <span className="l0-kicker">{card.kicker}</span>
                  <h3>
                    {card.figure}
                    {card.unit && <span className="l0-sm">{card.unit}</span>}
                  </h3>
                  <p>{renderInline(card.body)}</p>
                  <span className="l0-src">{card.source}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* HOW I WORK */}
        {approach.points.length > 0 && (
          <section className="l0-section">
            <div className="l0-head">
              <h2>{approach.title}</h2>
              <span className="l0-tick">{approach.tick}</span>
            </div>

            <div className="l0-cols">
              {[approach.points.slice(0, approachSplit), approach.points.slice(approachSplit)].map((column, c) => (
                <div key={c}>
                  {column.map(({ lead, text }, i) => (
                    <p key={i}>
                      <strong>{lead}</strong> {renderInline(text)}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* LIMITS */}
        {limits.points.length > 0 && (
          <section className="l0-section">
            <div className="l0-head">
              <h2>{limits.title}</h2>
              <span className="l0-tick">{limits.tick}</span>
            </div>

            <div className="l0-limits">
              <ul>
                {limits.points.map(({ lead, text }, i) => (
                  <li key={i}>
                    <b>{lead}</b> {renderInline(text)}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default AboutLevel0;
