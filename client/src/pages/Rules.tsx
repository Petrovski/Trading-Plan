export default function Rules() {
  return (
    <main className="rules-page">
      <header className="rules-header">
        <h1>Trading Rules & Daily Routine</h1>
        <p>
          This is my operating manual. My only job each day is to follow these
          rules and routines.
        </p>
      </header>

      {/* Core Principles */}
      <section className="rules-section">
        <h2>Core Principles</h2>
        <ul>
          <li>I trade the market, not my PnL.</li>
          <li>Stops are a business expense that keep me in the game.</li>
          <li>
            If a trade hits my stop, it simply wasn&apos;t my trade. That&apos;s
            a win for my process.
          </li>
          <li>
            My goal each day is not to make money, but to execute my plan.
          </li>
          <li>Three clean stop-outs following my rules is a successful day.</li>
        </ul>
      </section>

      {/* Daily Guardrails */}
      <section className="rules-section">
        <h2>Daily Guardrails</h2>
        <ul>
          <li>No trading before 9:30 AM (no exceptions).</li>
          <li>No trades in the first 15 minutes of RTH – narration only.</li>
          <li>
            Daily live-trading stops when ANY of these happen:
            <ul>
              <li>Realized loss reaches -$4,000, or</li>
              <li>3 full stop-loss trades, or</li>
              <li>
                1 rules violation (stop pull, adding to a loser, off-plan
                impulse trade).
              </li>
            </ul>
          </li>
          <li>
            After the daily stop is hit: live trading is done, SIM only for the
            rest of the session.
          </li>
        </ul>
      </section>

      {/* Pre-Session Routine */}
      <section className="rules-section">
        <h2>Pre-Session Routine</h2>
        <ol>
          <li>
            <strong>Identity script (out loud):</strong>
            <ul>
              <li>&quot;Today my only goal is to follow my plan.&quot;</li>
              <li>&quot;I trade the market, not my PnL.&quot;</li>
              <li>&quot;Stops allow me to catch the next A+ setup.&quot;</li>
            </ul>
          </li>
          <li>
            <strong>3-minute stop rehearsal:</strong> visualize 3–5 trades
            hitting the stop and say, &quot;Stopped out. Good. Next setup.&quot;
          </li>
          <li>
            <strong>Market orientation (no trading):</strong>
            <ul>
              <li>Mark overnight high/low.</li>
              <li>Note key HTF levels and likely exhaustion zones.</li>
              <li>No bias, no entries — just awareness.</li>
            </ul>
          </li>
          <li>
            <strong>Pre-trade checklist (before first trade):</strong>
            <ul>
              <li>Am I calm, not excited or tilted?</li>
              <li>Am I trading to follow my plan, not to make back money?</li>
              <li>
                Is my stop at the price where the idea is objectively wrong?
              </li>
            </ul>
          </li>
        </ol>
      </section>

      {/* Session Rules */}
      <section className="rules-section">
        <h2>RTH Session Rules</h2>
        <ul>
          <li>No trades between 9:30–9:45 AM – narration only.</li>
          <li>
            Only trade allowed setup types (exhaustion / mean reversion):
            <ul>
              <li>Liquidity sweep reversals.</li>
              <li>Failed continuation / trap setups.</li>
              <li>Exhaustion into higher-timeframe levels.</li>
              <li>Stop-hunt spikes into reversion zones.</li>
            </ul>
          </li>
          <li>
            Max 2 attempts per level/zone. After 2 losses, level is invalid.
          </li>
          <li>
            Forbidden behaviors:
            <ul>
              <li>Pulling or widening stops.</li>
              <li>Adding to a losing position.</li>
              <li>Doubling size after a loss.</li>
              <li>
                Revenge trading or &quot;I&apos;ll just let it come back&quot;
                trades.
              </li>
            </ul>
          </li>
        </ul>
      </section>

      {/* Stop Ritual */}
      <section className="rules-section">
        <h2>Stop Ritual</h2>
        <ol>
          <li>Stop is hit.</li>
          <li>Hands off the mouse.</li>
          <li>
            Say: <strong>&quot;Stop out. Good job. Next setup.&quot;</strong>
          </li>
          <li>Stand up, take one deep breath, sit back down.</li>
          <li>
            Reframe:{" "}
            <strong>
              &quot;That stop freed me to catch the next A+ setup.&quot;
            </strong>
          </li>
        </ol>
      </section>

      {/* Post-Session Routine */}
      <section className="rules-section">
        <h2>Post-Session Routine</h2>
        <ol>
          <li>
            <strong>Behavior-only journal:</strong>
            <ul>
              <li>Did I avoid premarket trading? (Y/N)</li>
              <li>Did I respect all stops? (Y/N)</li>
              <li>Did I follow the daily loss/stop rules? (Y/N)</li>
              <li>Did I avoid forbidden behaviors? (Y/N)</li>
            </ul>
          </li>
          <li>
            <strong>SIM replay:</strong> pick one losing trade and practice Stop
            → Reverse → Win in replay/SIM.
          </li>
          <li>
            <strong>End-of-day identity line:</strong>
            <br />
            &quot;Today I trained discipline. Tomorrow I trade even
            better.&quot;
          </li>
        </ol>
      </section>

      {/* Quotes / Mantras */}
      <section className="rules-section">
        <h2>Mantras & Reminders</h2>
        <ul>
          <li>
            &quot;My job is to follow the plan. PnL takes care of itself over
            time.&quot;
          </li>
          <li>
            &quot;If I honor my stops, I position myself to catch the next A+
            setup.&quot;
          </li>
          <li>
            &quot;If I stay wrong, I miss the move. If I exit, I&apos;m free to
            join it.&quot;
          </li>
          <li>
            &quot;Three clean losses following plan = a winning day.&quot;
          </li>
        </ul>
      </section>
    </main>
  );
}
