export function FooterGlowLine() {
  return (
    <div
      className="absolute top-0 left-0 right-0 h-px"
      style={{
        background: "linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.5) 30%, rgba(232,121,249,0.5) 70%, transparent 100%)",
      }}
    />
  );
}
