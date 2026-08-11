import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { apiFetch } from './api'

describe('apiFetch', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => vi.unstubAllGlobals())

  it('uses the same-origin API path and attaches the bearer token', async () => {
    localStorage.setItem('token', 'test-token')
    fetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ id: 'cart-1' }),
    })

    await expect(apiFetch('/cart')).resolves.toEqual({ id: 'cart-1' })
    expect(fetch).toHaveBeenCalledWith('/api/cart', {
      headers: {
        Authorization: 'Bearer test-token',
        'Content-Type': 'application/json',
      },
    })
  })

  it('preserves request options and exposes backend errors', async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 409,
      json: vi.fn().mockResolvedValue({ detail: 'Out of stock' }),
    })

    await expect(
      apiFetch('/orders/checkout', { method: 'POST', body: '{}' }),
    ).rejects.toMatchObject({ message: 'Out of stock', status: 409 })
    expect(fetch).toHaveBeenCalledWith('/api/orders/checkout', {
      method: 'POST',
      body: '{}',
      headers: { 'Content-Type': 'application/json' },
    })
  })
})
