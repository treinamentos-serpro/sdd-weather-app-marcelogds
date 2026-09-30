export default function LoadingState() {
  return (
    <section
      aria-live="polite"
      aria-label="Carregando previsão"
      className="rounded-3xl border border-white/10 bg-white/5 px-6 py-16 text-center shadow-glass backdrop-blur-md"
      role="status"
    >
      <div
        aria-hidden="true"
        className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-accent-400"
      />
      <p className="mt-5 text-lg font-medium text-white">Consultando o céu...</p>
      <p className="mt-2 text-sm text-white/70">Estamos preparando sua previsão.</p>
    </section>
  );
}
