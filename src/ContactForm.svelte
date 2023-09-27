<script>
  import { onMount } from 'svelte';

  // State für Formularfelder und Fehler
  let name = '';
  let email = '';
  let message = '';
  let captchaInput = '';
  let captcha = '';
  let errors = {
      name: null,
      email: null,
      message: null,
      captcha: null,
  };
  let feedback = '';

  // Generiere ein einfaches Captcha (zum Testen)
  function generateCaptcha() {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let captchaText = '';
      for (let i = 0; i < 5; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          captchaText += characters.charAt(randomIndex);
      }
      captcha = captchaText;
  }

  // Validiere das Captcha
  function validateCaptcha() {
      if (captchaInput === captcha) {
          return true;
      } else {
          errors.captcha = 'Captcha is incorrect. Please try again. 🤖';
          return false;
      }
  }

  // Validiere E-Mail
  function validateEmail() {
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      if (!email.match(emailRegex)) {
          errors.email = 'Invalid email address. 📧';
          return false;
      }
      return true;
  }

  // Validiere Nachricht
  function validateMessage() {
      if (message.trim() === '') {
          errors.message = 'Message must not be empty. 📝';
          return false;
      }
      return true;
  }

  // Handler für das Absenden des Formulars
  async function handleSubmit() {
      // Zurücksetzen der Fehlermeldungen
      errors = {
          name: null,
          email: null,
          message: null,
          captcha: null,
      };

      if (validateCaptcha() && validateEmail() && validateMessage()) {
          // Hier kannst du den Code für den E-Mail-Versand einfügen
          // Beispiel: Verwende Fetch oder Axios, um die Daten an einen Server zu senden
          // Wenn der Versand erfolgreich ist, setze feedback auf eine Bestätigungsmeldung
          // Wenn ein Fehler auftritt, setze errors auf entsprechende Fehlermeldungen
          // Hier ein einfaches Beispiel (ersetze es durch deine Logik):

          try {
              const response = await fetch('/send-email', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name, email, message }),
              });

              if (response.ok) {
                  feedback = 'Message sent successfully. 🚀✉️';
                  // Nach dem erfolgreichen Senden das Captcha aktualisieren
                  generateCaptcha();
              } else {
                  errors.general = 'Error sending the message. Please try again later. 🙁';
              }
          } catch (err) {
              errors.general = 'An unexpected error occurred. 😟';
          }
      }
  }

  // Initialisiere das Captcha bei Komponentenmontage
  onMount(() => {
      generateCaptcha();
  });
</script>

<div class="w-full max-w-lg pt-5">
  <div class="flex flex-wrap -mx-3 mb-5">
    <div class="w-full px-3">
      {#if errors.name}
        <p class="text-dark-grey dark:text-white text-m italic">{errors.name}</p>
      {/if}
      {#if errors.email}
        <p class="text-dark-grey dark:text-white text-m italic">{errors.email}</p>
      {/if}
      {#if errors.message}
        <p class="text-dark-grey dark:text-white text-m italic">{errors.message}</p>
      {/if}
      {#if errors.captcha}
        <p class="text-dark-grey dark:text-white text-m italic">{errors.captcha}</p>
      {/if}
    </div>
    <!-- You can add additional fields like City, State, Zip here -->
  </div>
  <div class="flex flex-wrap -mx-3 mb-4">
    <div class="w-full md:w-1/2 px-3 mb-4 md:mb-0">
      <input class="appearance-none block w-full text-gray-dark border-2 border-gray-light dark:border-aubergine-dark rounded-2xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="name" type="text" bind:value={name} placeholder="🧑🏻 Your Name"/>
    </div>
    <div class="w-full md:w-1/2 px-3">
      <input class="appearance-none block w-full text-gray-dark border-2 border-gray-light dark:border-aubergine-dark rounded-2xl py-3 px-4 leading-tight focus:outline-none focus:bg-white" id="email" type="email" bind:value={email} placeholder="📧 Your Email" />
    </div>
  </div>
  <div class="flex flex-wrap -mx-3 mb-4">
    <div class="w-full px-3">
      <textarea class="appearance-none block w-full text-gray-dark border-2 border-gray-light dark:border-aubergine-dark rounded-2xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="message" bind:value={message} placeholder="✍🏻 Your Message"></textarea>

    </div>
  </div>

  <div class="flex flex-wrap -mx-3 mb-4">
    <div class="w-full md:w-1/2 px-3 mb-4 md:mb-0 flex">
        <input class="appearance-none block w-full text-gray-dark border-2 border-gray-light dark:border-aubergine-dark rounded-l-2xl py-3 px-4 leading-tight focus:outline-none focus:bg-white" id="captcha" type="text" bind:value={captchaInput} placeholder="🗝️ Captcha" />
        <div class="px-2 py-3 text-dark-grey dark:text-white bg-gray-light dark:bg-aubergine-dark">{captcha}</div>
        <button on:click={generateCaptcha} class="bg-blue text-white p-2 rounded-r-full">
          🔄
        </button>
    </div>
    <div class="w-full md:w-1/2 px-3 mb-4 md:mb-0">
      <button on:click={handleSubmit} class="w-full bg-blue text-white py-3 rounded-full transition transform hover:scale-105">
        🚀 Send
      </button>
    </div>
  </div>
</div>