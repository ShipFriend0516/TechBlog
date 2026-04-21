import { useEffect } from 'react';

const useShortcut = (
  onShortcutAction: () => void,
  keys: string[],
  isGlobal: boolean
) => {
  useEffect(() => {
    const handler = (e: Event) => {
      const evt = e as KeyboardEvent;
      const isPressed = keys?.every((key) => {
        if (key === 'Alt') {
          return evt.altKey;
        } else if (key === 'Control' || key === 'Ctrl') {
          return evt.ctrlKey;
        } else if (key === 'Shift') {
          return evt.shiftKey;
        } else if (key === 'Meta') {
          return evt.metaKey;
        }
        return evt.key.toLowerCase() === key.toLowerCase();
      });
      if (isPressed) {
        onShortcutAction();
      }
    };
    // 고민
    // 다른 페이지로 먼저 접근하면 전역 이벤트가 설정되지 않는다.
    // 생각나는 해결방법: layout.tsx 에서 useShortcut 훅을 사용하여 전역 이벤트를 설정한다.
    // 이렇게 할 경우 어떤 페이지로 접근하든 전역 이벤트를 설정 할 수 있다.

    const target = isGlobal ? window : document;
    target.addEventListener('keydown', handler);

    return () => {
      target.removeEventListener('keydown', handler);
    };
  }, [onShortcutAction, keys, isGlobal]);

  return;
};

export default useShortcut;
