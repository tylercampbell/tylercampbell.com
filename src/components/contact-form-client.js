export function initContactForm() {
  const formElement = document.querySelector('form[name="contact-v2"]');
  if (!formElement) return;

  const messageInput = document.getElementById('message');
  const senderInput = document.getElementById('sender');
  const emailInput = document.getElementById('email');
  const submitButton = document.getElementById('submit');
  const submitHint = document.getElementById('submit-hint');
  const successElement = document.getElementById('success');

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function updateSubmitState() {
    if (!submitButton || !messageInput || !senderInput || !emailInput) return;
    const ready =
      messageInput.value.trim() !== '' &&
      senderInput.value.trim() !== '' &&
      isValidEmail(emailInput.value.trim());
    submitButton.disabled = !ready;
    if (submitHint) submitHint.style.display = ready ? 'none' : '';
  }

  function autoExpandTextarea() {
    if (!messageInput) return;
    const minRows = parseInt(messageInput.getAttribute('data-min-rows') || '4', 10);
    messageInput.rows = minRows;
    if (!messageInput._baseScrollHeight) {
      const saved = messageInput.value;
      messageInput.value = '';
      messageInput._baseScrollHeight = messageInput.scrollHeight;
      messageInput.value = saved;
    }
    if (messageInput.scrollHeight > messageInput._baseScrollHeight) {
      messageInput.rows = minRows + Math.ceil(
        (messageInput.scrollHeight - messageInput._baseScrollHeight) / 16
      );
    }
  }

  formElement.addEventListener('input', (e) => {
    updateSubmitState();
    if (e.target === messageInput) autoExpandTextarea();
  });

  formElement.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    formData.append('form-name', 'contact-v2');
    fetch(form.action, {
      method: 'POST',
      headers: {
        Accept: 'application/x-www-form-urlencoded;charset=UTF-8',
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: new URLSearchParams(formData).toString(),
    })
      .then((response) => {
        if (response.ok) {
          formElement.classList.add('hidden');
          if (successElement) {
            successElement.classList.replace('hidden', 'block');
            successElement.focus();
          }
        } else {
          throw new Error(`Submit failed: ${response.status}`);
        }
      })
      .catch((err) => console.error(err));
  });
}
