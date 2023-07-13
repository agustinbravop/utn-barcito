import { useState, useCallback, useRef } from "react";

export function useHover<T extends HTMLElement>() {
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseOver = useCallback(() => setIsHovering(true), []);
  const handleMouseOut = useCallback(() => setIsHovering(false), []);

  const nodeRef = useRef<T>();

  const hoverRef = useCallback(
    (node: T) => {
      if (nodeRef.current) {
        nodeRef.current.removeEventListener("mouseenter", handleMouseOver);
        nodeRef.current.removeEventListener("mouseleave", handleMouseOut);
      }

      nodeRef.current = node;
      if (nodeRef.current) {
        nodeRef.current.addEventListener("mouseenter", handleMouseOver);
        nodeRef.current.addEventListener("mouseleave", handleMouseOut);
      }
    },
    [handleMouseOver, handleMouseOut]
  );

  return { hoverRef, isHovering };
}
