/**
 * Tech Nest Embeddable Widget
 * ────────────────────────────
 * A self-contained score widget that external sites embed via a <script> tag.
 *
 * Usage:
 *   <div id="technest-score" data-device-id="uuid-here"></div>
 *   <script src="https://cdn.technest.app/widget.js" data-api-key="tn_live_..."></script>
 *
 * The widget:
 *   1. Reads the API key from the script tag's data-api-key attribute
 *   2. Finds all elements with id="technest-score" or class="technest-widget"
 *   3. Fetches device scores from the Platform API
 *   4. Renders a styled score card inside each container
 *
 * Security:
 *   - The API key is exposed in client-side code (expected for embed widgets)
 *   - Rate limiting prevents abuse even if the key is stolen
 *   - The key only grants READ access to public device scores
 *   - No PII or internal data is ever returned through widget endpoints
 */

(function () {
  'use strict';

  // ── Config ───────────────────────────────────────────────────────────────
  const SCRIPT_TAG = document.currentScript as HTMLScriptElement;
  const API_KEY = SCRIPT_TAG?.getAttribute('data-api-key') || '';
  const BASE_URL = SCRIPT_TAG?.getAttribute('data-api-url') || 'https://api.technest.app';

  if (!API_KEY) {
    console.error('[TechNest Widget] Missing data-api-key attribute on script tag.');
    return;
  }

  // ── Styles (injected once into <head>) ───────────────────────────────────
  const WIDGET_CSS = `
    .tn-widget {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 100%);
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: 16px;
      padding: 20px;
      color: #e2e8f0;
      max-width: 320px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }
    .tn-widget-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }
    .tn-widget-name {
      font-size: 16px;
      font-weight: 700;
      color: #f1f5f9;
    }
    .tn-widget-brand {
      font-size: 12px;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .tn-widget-score-ring {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: 800;
      color: #fff;
    }
    .tn-score-flagship { background: linear-gradient(135deg, #6366f1, #8b5cf6); }
    .tn-score-high     { background: linear-gradient(135deg, #10b981, #059669); }
    .tn-score-mid      { background: linear-gradient(135deg, #f59e0b, #d97706); }
    .tn-score-entry    { background: linear-gradient(135deg, #6b7280, #4b5563); }
    .tn-widget-verdict {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      padding: 4px 10px;
      border-radius: 6px;
      display: inline-block;
    }
    .tn-verdict-flagship { background: rgba(99, 102, 241, 0.2); color: #a5b4fc; }
    .tn-verdict-high     { background: rgba(16, 185, 129, 0.2); color: #6ee7b7; }
    .tn-verdict-mid      { background: rgba(245, 158, 11, 0.2); color: #fcd34d; }
    .tn-verdict-entry    { background: rgba(107, 114, 128, 0.2); color: #d1d5db; }
    .tn-widget-categories {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-top: 12px;
    }
    .tn-cat-item {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
    }
    .tn-cat-label { color: #94a3b8; }
    .tn-cat-value { font-weight: 600; }
    .tn-widget-footer {
      margin-top: 14px;
      text-align: center;
      font-size: 10px;
      color: #64748b;
    }
    .tn-widget-footer a {
      color: #818cf8;
      text-decoration: none;
    }
    .tn-widget-loading {
      text-align: center;
      color: #94a3b8;
      padding: 20px;
    }
  `;

  // Inject CSS
  const style = document.createElement('style');
  style.textContent = WIDGET_CSS;
  document.head.appendChild(style);

  // ── Fetch + Render ─────────────────────────────────────────────────────────

  async function fetchDeviceScore(deviceId: string): Promise<any> {
    const response = await fetch(`${BASE_URL}/platform/v1/devices/${deviceId}/score`, {
      headers: { 'X-API-Key': API_KEY },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  function renderWidget(container: HTMLElement, data: any): void {
    const verdict = (data.verdict || 'MID').toLowerCase();
    const score = data.tech_nest_score?.toFixed(1) || '0.0';
    const cats = data.category_scores || {};

    container.innerHTML = `
      <div class="tn-widget">
        <div class="tn-widget-header">
          <div>
            <div class="tn-widget-brand">${escapeHtml(data.brand)}</div>
            <div class="tn-widget-name">${escapeHtml(data.name)}</div>
          </div>
          <div class="tn-widget-score-ring tn-score-${verdict}">
            ${score}
          </div>
        </div>
        <div>
          <span class="tn-widget-verdict tn-verdict-${verdict}">
            ${data.verdict}${data.trend_momentum === 'rising' ? ' 📈' : ''}
          </span>
          ${data.price_usd ? `<span style="float:right;color:#94a3b8;font-size:14px;">$${data.price_usd}</span>` : ''}
        </div>
        <div class="tn-widget-categories">
          ${Object.entries(cats).map(([key, val]) => `
            <div class="tn-cat-item">
              <span class="tn-cat-label">${capitalize(key)}</span>
              <span class="tn-cat-value">${(val as number).toFixed(1)}</span>
            </div>
          `).join('')}
        </div>
        <div class="tn-widget-footer">
          Powered by <a href="https://technest.app" target="_blank">Tech Nest</a>
        </div>
      </div>
    `;
  }

  function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // ── Auto-discover and render ───────────────────────────────────────────────

  function init(): void {
    const containers = document.querySelectorAll<HTMLElement>(
      '#technest-score, .technest-widget, [data-technest-device]'
    );

    containers.forEach(async (container) => {
      const deviceId =
        container.getAttribute('data-device-id') ||
        container.getAttribute('data-technest-device');

      if (!deviceId) {
        container.innerHTML = '<div class="tn-widget-loading">Missing device ID</div>';
        return;
      }

      container.innerHTML = '<div class="tn-widget-loading">Loading score...</div>';

      try {
        const data = await fetchDeviceScore(deviceId);
        renderWidget(container, data);
      } catch (err) {
        container.innerHTML = `<div class="tn-widget-loading">Score unavailable</div>`;
        console.error('[TechNest Widget] Error:', err);
      }
    });
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
