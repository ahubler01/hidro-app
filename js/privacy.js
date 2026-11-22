/* What the public screens are allowed to show.

   Two people must learn nothing from the big screen: the person queueing behind you, and a
   competitor with a notebook. If the screen showed this station's euros or scans, anyone could
   divide by the cashback rate and estimate the station's litres. So public numbers are built
   from aggregates that cannot be traced back to one station, one hour or one person:

   1. NETWORK-WIDE    Totals are for all members in Spain, never for one station.
   2. 30-DAY ROLLING  A 30-day mean hides daily and weekly peaks.
   3. PUBLISHED DAILY Fixed once a day, with a 48 h delay.
   4. ROUNDED + NOISE 3 significant figures, plus a small random offset (differential privacy).
   5. STEADY TICKER   Between updates the counter climbs at one constant speed, day and night.
                      It is never triggered by a payment, so nobody can count cars with it.
   6. RATIOS ONLY     A station only shows shares and an index (0-100), never volumes.
   7. FIXED CROWD     The Plaza always shows the same number of Hidros, whatever the traffic.
   8. K-ANONYMITY     "Just now" messages are shuffled, delayed and need at least 5 scans.

   Your exact numbers exist in one place only: your own phone. */
(function () {
  const DAY = 86400;
  const round3 = x => { if (!x) return 0; const p = Math.pow(10, Math.floor(Math.log10(Math.abs(x))) - 2); return Math.round(x / p) * p; };
  /* Laplace noise, scale = sensitivity / epsilon (as a share of the value) */
  const noise = (x, share = .004, u = Math.random() - .5) => x - x * share * Math.sign(u) * Math.log(1 - 2 * Math.abs(u));
  const rolling = (days, n = 30) => days.slice(-n).reduce((a, b) => a + b, 0);
  /* The published daily value becomes a smooth ticker: value + constant speed * time */
  function steadyTicker({ total30, startedAt = 0 }) {
    const perSec = total30 / 30 / DAY;
    return tSec => total30 + perSec * (tSec - startedAt);
  }
  const K = 5;                                   // minimum group for any public message
  const CROWD = 17;                              // Hidros always on screen, plus the visitor
  const share = (green, all) => (all < 200 ? null : Math.round(green / all * 100));   // no ratio on small bases

  /* Illustrative published values for the concept */
  const PUBLIC = {
    eur30: round3(1284000),                      // € saved by gow members, Spain, 30 days
    kg30: round3(312400),                        // kg CO2e avoided, Spain, 30 days
    stationGreenShare: 68,                       // % of members here with a green move this month
    stationShine: 72,                            // index 0-100
  };
  window.PRIVACY = { round3, noise, rolling, steadyTicker, share, K, CROWD, PUBLIC };
})();
