import { VisitorActivity } from './types';

let fallbackVisitorId = '';

export function getVisitorId(): string {
  try {
    let visitorId = localStorage.getItem('studyvault_visitor_id');
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      localStorage.setItem('studyvault_visitor_id', visitorId);
    }
    return visitorId;
  } catch {
    fallbackVisitorId ||= crypto.randomUUID();
    return fallbackVisitorId;
  }
}

export async function sendAnalyticsEvent(
  event: Pick<VisitorActivity, 'action' | 'title' | 'details'>
): Promise<void> {
  try {
    await fetch('/api/analytics/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        ...event,
        visitorId: getVisitorId(),
        deviceType: window.innerWidth < 768 ? 'Mobile' : 'Desktop'
      })
    });
  } catch {
    // Analytics should never interrupt study workflows when the server is unavailable.
  }
}