import { ThreeEvent } from '@react-three/fiber';
import { useRef } from 'react';

export const useObjectClickHandler = (handleClick?: (event: ThreeEvent<PointerEvent>) => void, clickEnabled = true) => {
  const isMouseDown = useRef<boolean>(false);
  const isClick = useRef<boolean>(false);
  const objectType = useRef<string>('');

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    let object = event.object;

    if (
      object.name &&
      ((object.type === 'Mesh' && object.name === 'Layer') ||
        object.type === 'Points' ||
        (object.type === 'Mesh' && object.name === 'heatSquare'))
    ) {
      event.stopPropagation();

      objectType.current = object.type;
      isMouseDown.current = true;
      isClick.current = true;
    }
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();

    isClick.current = false;
  };

  const handlePointerUp = (event: ThreeEvent<PointerEvent>) => {
    if (event.object.name && event.object.type === objectType.current) {
      event.stopPropagation();

      isMouseDown.current = false;
      objectType.current = '';

      if (isClick.current && handleClick) {
        handleClick(event);
      }
    }
  };

  return {
    onPointerDown: clickEnabled ? handlePointerDown : undefined,
    onPointerMove: clickEnabled ? handlePointerMove : undefined,
    onPointerUp: clickEnabled ? handlePointerUp : undefined,
  };
};
