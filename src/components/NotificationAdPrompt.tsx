import React, { useState } from 'react';
import { BellRing } from 'lucide-react';

interface Props {
  onPermissionChange: (permission: NotificationPermission) => void;
}

export const NotificationAdPrompt: React.FC<Props> = ({ onPermissionChange }) => {
  const [permission, setPermission] = useState<NotificationPermission>(() =>
    'Notification' in window ? Notification.permission : 'denied'
  );
  const [error, setError] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);
  const isSupported = 'Notification' in window && 'serviceWorker' in navigator;

  const requestPermission = async () => {
    setError('');
    setIsRequesting(true);
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      onPermissionChange(result);
    } catch (requestError) {
      console.error('Could not request notification permission.', requestError);
      setError('Could not enable notifications. Please try again in your browser settings.');
    } finally {
      setIsRequesting(false);
    }
  };

  if (permission === 'granted') {
    return (
      <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-200">
        Notifications are enabled. Sponsored notifications may arrive when ads are available.
      </div>
    );
  }

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-700 bg-slate-900/90 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="flex items-center gap-2 text-sm font-bold text-white">
          <BellRing className="h-4 w-4 text-indigo-400" />
          Enable notification ads
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Optional: allow browser notifications to receive sponsored messages. Ads depend on availability.
        </p>
        {permission === 'denied' && isSupported && (
          <p className="mt-1 text-xs text-amber-300">
            Notifications are blocked in your browser. Allow them in this site&apos;s browser settings, then reload.
          </p>
        )}
        {!isSupported && (
          <p className="mt-1 text-xs text-amber-300">
            This browser does not support notification ads.
          </p>
        )}
        {error && <p className="mt-1 text-xs text-rose-300">{error}</p>}
      </div>
      {permission === 'default' && isSupported && (
        <button
          type="button"
          onClick={requestPermission}
          disabled={isRequesting}
          className="shrink-0 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-indigo-500 disabled:cursor-wait disabled:opacity-60"
        >
          {isRequesting ? 'Requesting...' : 'Allow notifications'}
        </button>
      )}
    </div>
  );
};
