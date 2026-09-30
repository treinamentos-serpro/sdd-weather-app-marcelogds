import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchJson, HttpError } from '../../../src/services/http';

afterEach(() => vi.unstubAllGlobals());

describe('fetchJson', () => {
  it('returns JSON for successful responses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{"ok":true}', { status: 200 })));

    await expect(fetchJson<{ ok: boolean }>('/weather')).resolves.toEqual({ ok: true });
  });

  it('classifies HTTP and network failures', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 503 })));
    await expect(fetchJson('/weather')).rejects.toMatchObject({ kind: 'api' });

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    await expect(fetchJson('/weather')).rejects.toBeInstanceOf(HttpError);
    await expect(fetchJson('/weather')).rejects.toMatchObject({ kind: 'network' });
  });
});
