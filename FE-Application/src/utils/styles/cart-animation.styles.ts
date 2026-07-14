export const getFlyerInitialStyles = (rect: DOMRect): Partial<CSSStyleDeclaration> => ({
  position: "fixed",
  top: `${rect.top}px`,
  left: `${rect.left}px`,
  width: `${rect.width}px`,
  height: `${rect.height}px`,
  zIndex: "9999",
  pointerEvents: "none",
  borderRadius: "12px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
  transformOrigin: "center center",
  opacity: "1",
});
