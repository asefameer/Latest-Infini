/**
 * Application Insights Telemetry
 * 
 * Initialises the Application Insights SDK for frontend telemetry:
 * - Page views, route changes
 * - Unhandled exceptions & console errors
 * - Performance (page load, AJAX timing)
 * - Custom events (add-to-cart, checkout, search, etc.)
 *
 * Connection string is read from VITE_APPINSIGHTS_CONNECTION_STRING.
 * When not set (local dev / preview), telemetry is silently disabled.
 */
import { ApplicationInsights, SeverityLevel } from '@microsoft/applicationinsights-web';

let appInsights: ApplicationInsights | null = null;

export function initTelemetry(): void {
  const connectionString = import.meta.env.VITE_APPINSIGHTS_CONNECTION_STRING;
  if (!connectionString) {
    console.debug('[Telemetry] No connection string — telemetry disabled');
    return;
  }

  appInsights = new ApplicationInsights({
    config: {
      connectionString,
      enableAutoRouteTracking: true,
      enableCorsCorrelation: true,
      enableRequestHeaderTracking: true,
      enableResponseHeaderTracking: true,
      disableFetchTracking: false,
      autoTrackPageVisitTime: true,
      enableUnhandledPromiseRejectionTracking: true,
    },
  });

  appInsights.loadAppInsights();
  appInsights.trackPageView();
  console.debug('[Telemetry] Application Insights initialised');
}

/** Track a custom event (e.g. "add_to_cart", "checkout_complete") */
export function trackEvent(name: string, properties?: Record<string, string | number | boolean>): void {
  appInsights?.trackEvent({ name }, properties as Record<string, string>);
}

/** Track a custom metric */
export function trackMetric(name: string, average: number): void {
  appInsights?.trackMetric({ name, average });
}

/** Track an exception */
export function trackException(error: Error, properties?: Record<string, string>): void {
  appInsights?.trackException({ exception: error, severityLevel: SeverityLevel.Error }, properties);
}

/** Track a page view manually (auto-tracking handles most cases) */
export function trackPageView(name: string, uri?: string): void {
  appInsights?.trackPageView({ name, uri });
}

/** Flush pending telemetry (call before page unload if needed) */
export function flushTelemetry(): void {
  appInsights?.flush();
}

export { appInsights };
