const CampaignXProject = () => {
  return (
    <div className="cx-root">
      <style>{`
        .cx-root {
          --cx-ink:#1F1F1E;
          --cx-raise:#26251F;
          --cx-bone:#E9E4DA;
          --cx-muted:#8A857B;
          --cx-rule:#35332F;
          --cx-signal:#7FA88C;
          --cx-prune:#9E5A4E;
          --cx-display:"Bricolage Grotesque","Helvetica Neue",Arial,sans-serif;
          --cx-body:"IBM Plex Sans","Helvetica Neue",Arial,sans-serif;
          --cx-mono:"IBM Plex Mono",ui-monospace,SFMono-Regular,Menlo,monospace;

          background:var(--cx-ink);
          color:var(--cx-bone);
          font-family:var(--cx-body);
          font-size:1rem;
          line-height:1.55;
          -webkit-font-smoothing:antialiased;
          border-radius:0.875rem;
          overflow:hidden;
          margin:0.75rem 0;

          /* Rendered inside a user-resizable panel, so every breakpoint below
             is a container query against this block's own width. */
          container-type:inline-size;
          container-name:campaignx;
        }
        .cx-root *{box-sizing:border-box}
        .cx-root a{color:inherit}

        .cx-root .wrap{max-width:67.5rem;margin:0 auto;padding:0.5rem clamp(1rem,3.5cqi,1.5rem) 2.5rem}

        /* hero */
        .cx-root .hero{padding:clamp(1.25rem,4cqi,2rem) 0 0.5rem;max-width:56.25rem}
        .cx-root .eyebrow{
          font-family:var(--cx-mono);font-size:0.75rem;letter-spacing:.14em;text-transform:uppercase;
          color:var(--cx-muted);margin:0 0 1.375rem;
        }
        .cx-root h1{
          font-family:var(--cx-display);
          font-weight:700;
          font-size:clamp(1.5rem,6cqi,3rem);
          line-height:1.1;
          letter-spacing:-.02em;
          margin:0 0 1.375rem;
        }
        .cx-root h1 .thin{color:var(--cx-muted);font-weight:500}
        .cx-root .lede{font-size:clamp(0.9375rem,1.9cqi,1.0625rem);color:var(--cx-muted);max-width:60ch;margin:0}
        .cx-root .lede em{color:var(--cx-bone);font-style:normal}

        .cx-root .tags{display:flex;flex-wrap:wrap;gap:0.4375rem;margin:1.875rem 0 0;padding:0;list-style:none}
        .cx-root .tags li{
          font-family:var(--cx-mono);font-size:0.71875rem;letter-spacing:.04em;
          color:var(--cx-muted);border:0.0625rem solid var(--cx-rule);border-radius:0.125rem;padding:0.25rem 0.5625rem;
        }

        .cx-root .links{display:flex;flex-wrap:wrap;gap:clamp(0.875rem,3cqi,1.625rem);margin-top:2.125rem}
        .cx-root .links a{
          font-family:var(--cx-mono);font-size:0.8125rem;text-decoration:none;
          border-bottom:0.0625rem solid var(--cx-rule);padding-bottom:0.1875rem;
          transition:border-color .18s ease,color .18s ease;
        }
        .cx-root .links a:hover{border-color:var(--cx-signal);color:var(--cx-signal)}
        .cx-root .links a:focus-visible{outline:0.125rem solid var(--cx-signal);outline-offset:0.1875rem}
        .cx-root .links a[aria-disabled="true"]{color:var(--cx-muted);pointer-events:none}

        /* section scaffolding */
        .cx-root section{margin-top:clamp(2.5rem,7cqi,4rem)}
        .cx-root .head{
          display:flex;align-items:baseline;gap:0.875rem;flex-wrap:wrap;
          margin:0 0 1.625rem;padding-bottom:0.75rem;border-bottom:0.0625rem solid var(--cx-rule);
        }
        .cx-root .head h2{
          font-family:var(--cx-display);font-weight:500;font-size:1.125rem;letter-spacing:-.01em;margin:0;
        }
        .cx-root .head .tick{font-family:var(--cx-mono);font-size:0.65625rem;color:var(--cx-muted);letter-spacing:.1em}

        /* the loop — scrolls sideways in its own box so labels stay legible */
        .cx-root .loop{overflow-x:auto;-webkit-overflow-scrolling:touch;padding-bottom:0.375rem}
        .cx-root .loop svg{display:block;min-width:min(51.25rem,150cqi);width:100%;height:auto}
        /* The n-*, edge-*, back-*, gate-* sizes below stay in px on purpose:
           inside an SVG they are viewBox user units and already scale with the
           diagram, so rem would decouple them from the geometry they label. */
        .cx-root .n-box{fill:none;stroke:var(--cx-rule);stroke-width:1}
        .cx-root .n-box.human{stroke:var(--cx-bone);stroke-dasharray:3 3}
        .cx-root .n-box.opt{stroke:var(--cx-signal)}
        .cx-root .n-idx{font-family:var(--cx-mono);font-size:9px;fill:var(--cx-muted);letter-spacing:.1em}
        .cx-root .n-txt{font-family:var(--cx-mono);font-size:10.5px;fill:var(--cx-bone)}
        .cx-root .n-txt.dim{fill:var(--cx-muted)}
        .cx-root .edge{stroke:var(--cx-rule);stroke-width:1;fill:none}
        .cx-root .edge-head{fill:var(--cx-rule)}
        .cx-root .back{stroke:var(--cx-signal);stroke-width:1;fill:none;stroke-dasharray:4 4}
        .cx-root .back-head{fill:var(--cx-signal)}
        .cx-root .back-txt{font-family:var(--cx-mono);font-size:10px;fill:var(--cx-signal)}
        .cx-root .gate-txt{font-family:var(--cx-mono);font-size:9.5px;fill:var(--cx-muted);letter-spacing:.06em}

        /* hard parts */
        .cx-root .cards{display:grid;grid-template-columns:1fr;gap:0.0625rem;background:var(--cx-rule);border:0.0625rem solid var(--cx-rule)}
        .cx-root .card{background:var(--cx-ink);padding:1.375rem 1.25rem 1.5rem}
        .cx-root .card h3{
          font-family:var(--cx-body);font-weight:500;font-size:0.9375rem;margin:0 0 0.625rem;line-height:1.35;
        }
        .cx-root .card p{margin:0;font-size:0.84375rem;color:var(--cx-muted);line-height:1.6}
        .cx-root .card .kicker{
          font-family:var(--cx-mono);font-size:0.625rem;letter-spacing:.12em;text-transform:uppercase;
          color:var(--cx-muted);display:block;margin-bottom:0.875rem;
        }
        .cx-root .card code{font-family:var(--cx-mono);font-size:0.75rem;color:var(--cx-bone);background:var(--cx-raise);padding:0.0625rem 0.3125rem;border-radius:0.125rem;overflow-wrap:anywhere}

        /* facts */
        .cx-root .facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(8rem,100%),1fr));gap:clamp(1rem,3cqi,1.625rem)}
        .cx-root .fact .v{font-family:var(--cx-display);font-weight:500;font-size:clamp(1.5rem,4.5cqi,1.875rem);letter-spacing:-.02em;line-height:1}
        .cx-root .fact .k{font-family:var(--cx-mono);font-size:0.65625rem;color:var(--cx-muted);letter-spacing:.05em;margin-top:0.5625rem;display:block;line-height:1.5}
        .cx-root .fact .v .qual{font-size:0.8125rem;color:var(--cx-muted);font-weight:500;margin-left:0.25rem}
        .cx-root .honest{
          margin-top:1.75rem;padding-left:0.875rem;border-left:0.125rem solid var(--cx-prune);
          font-size:0.8125rem;color:var(--cx-muted);max-width:62ch;
        }

        /* closing */
        .cx-root .cut{display:grid;grid-template-columns:1fr;gap:1.5rem}
        .cx-root .cut p{margin:0 0 0.875rem;font-size:0.875rem;color:var(--cx-muted);max-width:48ch}
        .cx-root .cut strong{color:var(--cx-bone);font-weight:500}

        .cx-root a{overflow-wrap:anywhere}

        @container campaignx (min-width:43.75rem){
          .cx-root .cards{grid-template-columns:repeat(3,1fr)}
          .cx-root .cut{grid-template-columns:1fr 1fr;gap:3rem}
        }
        @media (prefers-reduced-motion:reduce){
          .cx-root *{transition:none !important;animation:none !important}
        }
      `}</style>

      <div className="wrap">

        {/* HERO */}
        <header className="hero">
          <p className="eyebrow">Multi-agent system · Python · Built for FrostHack</p>
          <h1>
            Eight agents plan, write, and ship an email campaign —<br />
            <span className="thin">then the last one goes back and rewrites the worst of it.</span>
          </h1>
          <p className="lede">
            A marketing platform where an LLM pipeline turns a one-paragraph brief into segmented, A/B-tested email
            variants, sends them, watches the click-through, and <em>regenerates the bottom 25% on its own.</em> A
            human approves once, before send. Nothing after that.
          </p>

          <ul className="tags">
            <li>Python 3.11</li><li>FastAPI</li><li>LangGraph</li><li>LangChain</li><li>MongoDB</li><li>React + Vite</li>
          </ul>

          <div className="links">
            <a href="#" aria-disabled="true">Live demo →</a>
            <a href="#" aria-disabled="true">Repository →</a>
            <a href="#" aria-disabled="true">Architecture doc →</a>
          </div>
        </header>

        {/* THE LOOP */}
        <section>
          <div className="head">
            <h2>The loop</h2>
            <span className="tick">LANGGRAPH · ONE HUMAN GATE · ONE BACK EDGE</span>
          </div>

          <div className="loop">
            <svg viewBox="0 0 1020 210" role="img" aria-label="Eight-agent pipeline: brief parser, segmentation, strategy, content, approval, execution, monitoring, optimization. The optimization agent feeds back into the strategy agent.">
              <defs>
                <marker id="cx-mk-a" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0 0 L6 3 L0 6 z" className="edge-head" />
                </marker>
                <marker id="cx-mk-b" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0 0 L6 3 L0 6 z" className="back-head" />
                </marker>
              </defs>

              <g>
                <text className="n-idx" x="0" y="28">01</text><rect className="n-box" x="0" y="38" width="110" height="52" /><text className="n-txt" x="12" y="60">Brief</text><text className="n-txt dim" x="12" y="76">parser</text>
                <text className="n-idx" x="130" y="28">02</text><rect className="n-box" x="130" y="38" width="110" height="52" /><text className="n-txt" x="142" y="60">Segment-</text><text className="n-txt dim" x="142" y="76">ation</text>
                <text className="n-idx" x="260" y="28">03</text><rect className="n-box" x="260" y="38" width="110" height="52" /><text className="n-txt" x="272" y="60">Strategy</text><text className="n-txt dim" x="272" y="76">+ A/B split</text>
                <text className="n-idx" x="390" y="28">04</text><rect className="n-box" x="390" y="38" width="110" height="52" /><text className="n-txt" x="402" y="60">Content</text><text className="n-txt dim" x="402" y="76">5–10 variants</text>
                <text className="n-idx" x="520" y="28">05</text><rect className="n-box human" x="520" y="38" width="110" height="52" /><text className="n-txt" x="532" y="60">Approval</text><text className="gate-txt" x="532" y="76">HUMAN GATE</text>
                <text className="n-idx" x="650" y="28">06</text><rect className="n-box" x="650" y="38" width="110" height="52" /><text className="n-txt" x="662" y="60">Execution</text><text className="n-txt dim" x="662" y="76">send</text>
                <text className="n-idx" x="780" y="28">07</text><rect className="n-box" x="780" y="38" width="110" height="52" /><text className="n-txt" x="792" y="60">Monitoring</text><text className="n-txt dim" x="792" y="76">opens, clicks</text>
                <text className="n-idx" x="910" y="28">08</text><rect className="n-box opt" x="910" y="38" width="110" height="52" /><text className="n-txt" x="922" y="60">Optimiz-</text><text className="n-txt dim" x="922" y="76">ation</text>
              </g>

              <g>
                <line className="edge" x1="110" y1="64" x2="124" y2="64" markerEnd="url(#cx-mk-a)" />
                <line className="edge" x1="240" y1="64" x2="254" y2="64" markerEnd="url(#cx-mk-a)" />
                <line className="edge" x1="370" y1="64" x2="384" y2="64" markerEnd="url(#cx-mk-a)" />
                <line className="edge" x1="500" y1="64" x2="514" y2="64" markerEnd="url(#cx-mk-a)" />
                <line className="edge" x1="630" y1="64" x2="644" y2="64" markerEnd="url(#cx-mk-a)" />
                <line className="edge" x1="760" y1="64" x2="774" y2="64" markerEnd="url(#cx-mk-a)" />
                <line className="edge" x1="890" y1="64" x2="904" y2="64" markerEnd="url(#cx-mk-a)" />
              </g>

              <path className="back" d="M965 90 L965 150 L315 150 L315 100" markerEnd="url(#cx-mk-b)" />
              <text className="back-txt" x="640" y="141" textAnchor="middle">score = 0.7·click + 0.3·open → bottom quartile regenerated</text>
            </svg>
          </div>
        </section>

        {/* HARD PARTS */}
        <section>
          <div className="head">
            <h2>The parts that were actually hard</h2>
            <span className="tick">ASK ME ABOUT ANY OF THESE</span>
          </div>

          <div className="cards">
            <div className="card">
              <span className="kicker">Termination</span>
              <h3>The graph can loop forever</h3>
              <p>
                Optimization writes back into strategy, so the workflow has no natural end. Convergence detection
                compares successive variant scores and halts when the delta falls under threshold — otherwise a
                cheap campaign burns tokens all night.
              </p>
            </div>
            <div className="card">
              <span className="kicker">Ranking</span>
              <h3>Deciding what to kill</h3>
              <p>
                Variants are ranked by <code>0.7·CTR + 0.3·OR</code> in a priority queue; the bottom quartile is
                regenerated, not deleted, so history survives for comparison. Percentile, not absolute cutoff — a
                campaign with universally poor open rates shouldn't nuke itself.
              </p>
            </div>
            <div className="card">
              <span className="kicker">Failure</span>
              <h3>The send is not undoable</h3>
              <p>
                Three external APIs sit between the agents and a customer's inbox. Retries have to be safe: a
                partial batch that fails midway cannot re-send to the addresses that already received it.
                Everything upstream of execution is replayable. Execution is not.
              </p>
            </div>
          </div>
        </section>

        {/* FACTS */}
        <section>
          <div className="head">
            <h2>What's real</h2>
            <span className="tick">MEASURED, NOT ESTIMATED</span>
          </div>

          <div className="facts">
            <div className="fact"><div className="v">8</div><span className="k">agents, each with its own<br />prompt contract and schema</span></div>
            <div className="fact"><div className="v">1</div><span className="k">human approval gate<br />in the whole pipeline</span></div>
            <div className="fact"><div className="v">500</div><span className="k">seeded customers across<br />the segmentation set</span></div>
            <div className="fact"><div className="v">80<span className="qual">% target</span></div><span className="k">backend coverage —<br />not yet met</span></div>
          </div>

          <p className="honest">
            No traffic numbers, no user count, no "10x faster". This was built for a hackathon and has never carried
            production load, and saying so is cheaper than being caught. The moment one figure on a résumé turns out
            to be decorative, every other figure on it stops counting.
          </p>
        </section>

        {/* CLOSING */}
        <section>
          <div className="head">
            <h2>What I'd do differently</h2>
            <span className="tick">AND WHAT I CUT</span>
          </div>

          <div className="cut">
            <div>
              <p><strong>Cut:</strong> Redis caching, WebSocket live metrics, and a vector store. None of them had a problem to solve at 500 rows. They were in the plan because they look like architecture.</p>
              <p><strong>Cut:</strong> Auth. There is one user and it's me. A login screen would have been theatre.</p>
            </div>
            <div>
              <p><strong>Wrong first:</strong> I let each agent hold its own memory before moving state into a single typed graph object. Debugging eight independent memories is not debugging — it's archaeology.</p>
              <p><strong>Next:</strong> Replace the polling metrics loop with an event stream, and put a token budget on the optimization cycle so cost is bounded by design rather than by a threshold I guessed.</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default CampaignXProject;
