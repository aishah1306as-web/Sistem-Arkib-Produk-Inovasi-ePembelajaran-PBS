export function formatDateMs(dateInput?: string | Date | null): string {
  if (!dateInput) return '-';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return '-';

  const monthsMs = [
    'Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun',
    'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'
  ];

  const day = date.getDate();
  const month = monthsMs[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

export function formatDateTimeMs(dateInput?: string | Date | null): string {
  if (!dateInput) return '-';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return '-';

  const dateStr = formatDateMs(date);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${dateStr}, ${hours}:${minutes}`;
}

export function formatRelativeTimeMs(dateInput?: string | Date | null): string {
  if (!dateInput) return '-';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return '-';

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return 'Sebentar tadi';
  if (diffMinutes < 60) return `${diffMinutes} minit yang lalu`;
  if (diffHours < 24) return `${diffHours} jam yang lalu`;
  if (diffDays === 1) return 'Semalam';
  if (diffDays < 7) return `${diffDays} hari yang lalu`;

  return formatDateMs(date);
}
