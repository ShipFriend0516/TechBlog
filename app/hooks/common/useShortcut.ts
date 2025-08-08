import { useEffect } from 'react';

interface useShortcutProps {
  onShortcutAction: () => void;
  keys: string[];
  isGlobal?: boolean;
}

const useShortcut = ({
  onShortcutAction,
  keys,
  isGlobal,
}: useShortcutProps) => {
  useEffect(() => {
    const handler = (e) => {
      const isPressed = keys?.every((key) => {
        if (key === 'Alt') {
          return e.altKey;
        } else if (key === 'Control' || key === 'Ctrl') {
          return e.ctrlKey;
        } else if (key === 'Shift') {
          return e.shiftKey;
        } else if (key === 'Meta') {
          return e.metaKey;
        }
        return e.key.toLowerCase() === key.toLowerCase();
      });
      if (isPressed) {
        if (onShortcutAction) {
          onShortcutAction();
        }
      }
    };

    if (window) {
      document.addEventListener('keydown', handler);
    }
    if (isGlobal) {
      window.addEventListener('keydown', handler);
    }

    return () => {
      document.removeEventListener('keydown', handler);
    };
  }, [onShortcutAction, keys]);

  return;
};

export default useShortcut;
