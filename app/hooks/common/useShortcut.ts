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
        onShortcutAction();
      }
    };
    // 고민
    // 다른 페이지로 먼저 접근하면 전역 이벤트가 설정되지 않는다.
    // 생각나는 해결방법: layout.tsx 에서 useShortcut 훅을 사용하여 전역 이벤트를 설정한다.
    // 이렇게 할 경우 어떤 페이지로 접근하든 전역 이벤트를 설정 할 수 있다.

    if (isGlobal) {
      window.addEventListener('keydown', handler);
    } else if (window) {
      document.addEventListener('keydown', handler);
    }

    return () => {
      document.removeEventListener('keydown', handler);
    };
  }, [onShortcutAction, keys, isGlobal]);

  return;
};

export default useShortcut;
