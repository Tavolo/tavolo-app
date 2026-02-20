import { formatDate, formatRelativeTime } from '../utils/dates';

describe('formatDate', () => {
  it('formats ISO date string with default format', () => {
    const result = formatDate('2025-02-14T12:00:00Z');
    expect(result).toBe('Feb 14, 2025');
  });

  it('formats ISO date string with custom format', () => {
    const result = formatDate('2025-02-14T12:00:00Z', 'yyyy-MM-dd');
    expect(result).toBe('2025-02-14');
  });

  it('handles date at start of day', () => {
    const result = formatDate('2025-01-01T00:00:00Z');
    expect(result).toBe('Jan 1, 2025');
  });
});

describe('formatRelativeTime', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns "just now" for very recent times', () => {
    const now = new Date('2025-02-14T12:00:00Z');
    jest.setSystemTime(now);

    const result = formatRelativeTime('2025-02-14T12:00:00Z');
    expect(result).toBe('just now');
  });

  it('returns minutes ago for recent times', () => {
    const now = new Date('2025-02-14T12:30:00Z');
    jest.setSystemTime(now);

    const result = formatRelativeTime('2025-02-14T12:00:00Z');
    expect(result).toBe('30 minutes ago');
  });

  it('returns hours ago for same-day times', () => {
    const now = new Date('2025-02-14T15:00:00Z');
    jest.setSystemTime(now);

    const result = formatRelativeTime('2025-02-14T12:00:00Z');
    expect(result).toBe('3 hours ago');
  });

  it('returns days ago for recent dates', () => {
    const now = new Date('2025-02-16T12:00:00Z');
    jest.setSystemTime(now);

    const result = formatRelativeTime('2025-02-14T12:00:00Z');
    expect(result).toBe('2 days ago');
  });
});
