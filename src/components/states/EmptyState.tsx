export default function EmptyState() {
  return (
    <section
      aria-labelledby="empty-weather-title"
      aria-describedby="empty-weather-hint"
      className="rounded-3xl border border-white/10 bg-white/5 px-6 py-16 text-center shadow-glass backdrop-blur-md"
      role="status"
    >
      <p aria-hidden="true" className="text-5xl">
        ◌
      </p>
      <h1 className="mt-5 text-2xl font-semibold text-white" id="empty-weather-title">
        Nenhuma cidade encontrada.
      </h1>
      <p className="mt-2 text-white/70" id="empty-weather-hint">
        Tente outro nome para continuar a busca.
      </p>
    </section>
  );
}
