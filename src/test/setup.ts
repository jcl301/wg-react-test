import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

vi.stubGlobal('crypto', {
  ...globalThis.crypto,
  randomUUID: vi.fn(() => 'test-uuid'),
})
