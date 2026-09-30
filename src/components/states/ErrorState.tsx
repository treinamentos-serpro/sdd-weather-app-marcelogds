interface ErrorStateProps {
  onRetry: () => void;
  message?: string;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <section
      aria-labelledby="weather-error-title"
      className="rounded-3xl border border-red-300/20 bg-red-400/10 px-6 py-16 text-center shadow-glass backdrop-blur-md"
      role="alert"
    >
      <p aria-hidden="true" className="text-5xl">
        !
      </p>
      <h1 className="mt-5 text-2xl font-semibold text-white" id="weather-error-title">
        Não foi possível consultar agora.
      </h1>
      <p className="mt-2 text-white/70">{message ?? 'Tente novamente para carregar a previsão.'}</p>
      <button
        className="mt-6 rounded-xl bg-accent-500 px-5 py-3 font-semibold text-white transition hover:bg-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 focus:ring-offset-night-900"
        onClick={onRetry}
        type="button"
      >
        Tentar novamente
      </button>
    </section>
  );
}
