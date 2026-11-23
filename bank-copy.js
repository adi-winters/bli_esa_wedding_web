(() => {
  const button = document.getElementById('copy-bank-button');
  const accountNumber = document.querySelector('.bank-card strong')?.textContent.trim();

  if (!button || !accountNumber) return;

  const originalLabel = button.textContent;
  let resetTimer;

  const fallbackCopy = (text) => {
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.appendChild(field);
    field.select();

    let copied = false;
    try {
      copied = document.execCommand('copy');
    } catch {
      copied = false;
    }

    field.remove();
    return copied;
  };

  button.addEventListener('click', async () => {
    let copied = false;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(accountNumber);
        copied = true;
      }
    } catch {
      copied = false;
    }

    if (!copied) copied = fallbackCopy(accountNumber);

    button.textContent = copied ? 'Tersalin!' : 'Gagal menyalin';
    window.clearTimeout(resetTimer);
    resetTimer = window.setTimeout(() => {
      button.textContent = originalLabel;
    }, 1800);
  });
})();
