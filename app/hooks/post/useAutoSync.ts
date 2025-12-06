import { useEffect, useRef } from 'react';

interface AutoSyncConfig {
  enabled: boolean;
  intervalMs: number;
  onSync: () => Promise<void>;
  deps: any[];
}

const useAutoSync = ({ enabled, intervalMs, onSync, deps }: AutoSyncConfig) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSyncDataRef = useRef<string>('');

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(async () => {
      const currentData = JSON.stringify(deps);

      if (currentData !== lastSyncDataRef.current) {
        try {
          await onSync();
          lastSyncDataRef.current = currentData;
          console.log(
            'Auto-sync completed at',
            new Date().toLocaleTimeString()
          );
        } catch (error) {
          console.error('Auto-sync failed:', error);
        }
      }
    }, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, intervalMs, onSync, ...deps]);
};

export default useAutoSync;
