/**
 * Notifies the portfolio frontend tab that data has been updated.
 * Uses BroadcastChannel which works across tabs in the same browser/origin.
 * Falls back silently if not supported.
 */
export function notifyPortfolioUpdated() {
  try {
    if (!window.BroadcastChannel) return
    const bc = new BroadcastChannel('portfolio_sync')
    bc.postMessage('portfolio_updated')
    bc.close()
  } catch {}
}
