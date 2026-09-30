export type HttpErrorKind = 'network' | 'api' | 'timeout';

export class HttpError extends Error {
  constructor(
    public readonly kind: HttpErrorKind,
    message: string,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export async function fetchJson<T>(
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMs = 10_000,
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(input, { ...init, signal: controller.signal });

    if (!response.ok) {
      throw new HttpError('api', `A API retornou status ${response.status}.`);
    }

    try {
      return (await response.json()) as T;
    } catch {
      throw new HttpError('api', 'A resposta da API não é um JSON válido.');
    }
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new HttpError('timeout', 'A consulta excedeu o tempo limite.');
    }

    throw new HttpError('network', 'Não foi possível conectar ao serviço.');
  } finally {
    clearTimeout(timeoutId);
  }
}
