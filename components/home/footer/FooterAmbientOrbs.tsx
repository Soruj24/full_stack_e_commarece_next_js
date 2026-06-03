export function FooterAmbientOrbs() {
  return (
    <>
      <div
        className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.06) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
    </>
  );
}
