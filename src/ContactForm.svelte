<script>
  import { onMount } from 'svelte';
  import VanillaCaptcha, { validate } from 'vanilla-captcha';
  import { modalMessage } from './stores.js';
  import content from './content.js';

  // State für Formularfelder und Fehler
  let name = '';
  let email = '';
  let message = '';
  let captchaImageSrc = '';
  let answer;
  let userInput = '';
  let emoijSmirkingFace = './images/keymoji-c-matt-frontend-developer-javascript-php-svelte-wordpress-creator-smirking-face_1f60f.gif';
  let whileLoading = "😏";
  let isImageLoaded = false;
  let isMessageSent = false;

  function handleImageLoad() {
    isImageLoaded = true;
  }
  
  // Webhook-URL für den N8N-Workflow
  const proxyURL = 'https://cors-anywhere.herokuapp.com/';
  const webhookUrl = 'https://n8n.chooomedia.com/webhook/xn--moji-pb73c-mail';
  const webhookOptin = 'https://n8n.chooomedia.com/webhook/optin-keymoji';

  function generateCaptcha() {
    const { answer: generatedAnswer, captcha } = VanillaCaptcha(
      4, 90, 30, "#FFF", "Bold 18px Ubuntu", "#777", "#777", 12, false, false
    );
    captchaImageSrc = captcha;
    answer = generatedAnswer;
  }

  function validateCaptcha() {
    const isValid = validate(userInput, answer, true);
    if (!isValid) {
      modalMessage.set(content.en.contactForm.captchaIncorrectMessage);
    }
    return isValid;
  }

  // Svelte-Komponente
  async function handleSubmit() {
    if (!validateCaptcha()) return;

    try {
      const response = await fetch(proxyURL + webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ 
          name, 
          email, 
          message,
          targetEmail: "hey@🔑moji.ws",
          emailData: compileEmailTemplate(name, webhookOptin),
        }),
      });

      const result = await response.json();
      if (result.message === 'Workflow was started') {
        modalMessage.set(content.en.contactForm.successMessage);
        isMessageSent = true;
        // modalMessage.set(content.en.contactForm.successMessage);
        generateCaptcha();

        setTimeout(() => {
          window.location.href = '/'; // Ändern Sie diese URL entsprechend Ihrer Anwendung
        }, 3000);
      } else {
        modalMessage.set(content.en.contactForm.requestErrorMessage);
      }
    } catch (error) {
      modalMessage.set(content.en.contactForm.errorMessage);
      throw error;
    }
  }

  function navBack() {
      if (browser) window.history.back();
  }

  function compileEmailTemplate(name, webhookOptin) {
    const emailTemplate = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome Email</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 20px auto 10px auto;border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; width: 100%;" width="100%">
          <tbody>
            <tr>
              <td style="margin: 20px auto 10px auto;text-align: center; font-size: 48px; font-weight: bolder; color: #000000; padding: 0 0;" align="center" valign="top">
                <a href="https://🔑moji.ws" style="text-decoration: none; color: #000000;">
                  Keymoji
                </a>
              </td>
            </tr>
          </tbody>
        </table>
          <table style="max-width: 480px;margin: 0 auto;padding: 10px;width: 480px;background-color: rgb(37, 56, 82)!important;font-size: 14px; overflow: hidden; box-sizing: border-box; padding: 20px; border-radius: 0.75rem;" role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
              <tr>
                  <td style="padding: 20px 0 0 0; text-align: center;">
                      <h1 style="font-size: 24px; font-weight: bold; color: #ffffff;">${content.en.contactForm.emailText.greeting}, ${name} 👋🥳</h1>
                  </td>
              </tr>
              <tr>
                  <td style="padding: 0 0 20px 0; text-align: center;">
                      <p style="font-size: 14px; color: #ffffff;">${content.en.contactForm.emailText.intro}</p>
                      <p style="font-size: 14px; color: #ffffff;">${content.en.contactForm.emailText.doubleCheck}</p>
                      <ul style="list-style-type: none; padding: 0;">
                          <li style="font-size: 14px; color: #ffffff;">Name: ${name}</li>
                          <li style="font-size: 14px; color: #ffffff;">Email: ${email}</li>
                          <li style="font-size: 14px; color: #ffffff;">Message: ${message}</li>
                      </ul>
                  </td>
              </tr>
              <tr>
                  <td style="text-align: center;">
                      <a href="${webhookOptin}?email=${email}&name=${name}" style="font-size: 16px; font-weight: 500; background-color: rgb(2, 117, 255); padding: 15px 25px; border-radius: 50px; text-decoration: none; color: #FFF;">${content.en.contactForm.emailText.button}</a>
                  </td>
              </tr>
              <tr>
                  <td style="padding: 20px 0; text-align: center;">
                      <p style="font-size: 12px; color: #ffffff;">${content.en.contactForm.emailText.privacy}</p>
                  </td>
              </tr>
          </table>
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 5px auto;border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; width: 100%;" width="100%">
          <tbody>
            <tr>
                <td style="padding: 10px 0; text-align: center;">
                    <p style="font-size: 12px; color: #666;">${content.en.contactForm.footerText}</p>
                </td>
              </tr>
          </tbody>
        </table>
      </body>
    </html>`;

      // Zeilenumbrüche entfernen
      return emailTemplate.replace(/\n/g, '');
  }

  onMount(() => {
    generateCaptcha();
  });

  $: if (isMessageSent) {
    name = '';
    email = '';
    message = '';
    userInput = '';
    isMessageSent = false; // Zurücksetzen des Status
  }
</script>

<div class="w-full md:pt-4 pt-2">
  <div class="flex flex-wrap md:mt-0 md:mb-4 my-3 md:pt-1 items-center bg-creme-80 dark:bg-aubergine-80 transition rounded-xl pb-2 px-4 ">
    <div class="w-1/4 m-auto md:w-1/3 px-0 py-2">
      {#if !isImageLoaded}
      <div class="text-9xl">{whileLoading}</div>
      {/if}
      <img src="{emoijSmirkingFace}" alt="{content.en.contactForm.smirkingFaceImageAlt}" class="md:w-90 w-96 mx-auto" while-loading="{whileLoading}" on:load={handleImageLoad} />
    </div>
    <div class="w-full md:w-2/3 md:pl-3 md:pt-3">
      <h2 class="text-2xl font-semibold md:text-left mb-2 dark:text-white">{content.en.contactForm.introductionTitle}</h2>
      <p class="text-sm text-left dark:text-white">{content.en.contactForm.introductionText}</p>
    </div>
  </div>
  <div class="flex flex-wrap -mx-3 my-2">
    <div class="w-full md:w-1/2 px-3 mb-2 md:mb-0">
      <input class="appearance-none block w-full dark:text-white text-gray-dark rounded-2xl pt-4 pb-3 px-4 md:mb-3 leading-tight transition duration-300 ease-in-out transform dark:bg-aubergine-dark focus:outline-none focus:bg-white" id="name" type="text" bind:value={name} placeholder="{content.en.contactForm.nameLabel}"/>
    </div>
    <div class="w-full md:w-1/2 px-3">
      <input class="appearance-none block w-full dark:text-white text-gray-dark rounded-2xl pt-4 pb-3 px-4 leading-tight transition duration-300 ease-in-out transform dark:bg-aubergine-dark focus:outline-none focus:bg-white" id="email" type="email" bind:value={email} placeholder="{content.en.contactForm.emailLabel}" />
    </div>
  </div>
  <div class="flex flex-wrap -mx-3 my-2">
    <div class="w-full px-3">
      <textarea class="appearance-none block w-full dark:text-white text-gray-dark rounded-2xl pt-4 pb-3 px-4 md:mb-3 leading-tight transition duration-300 ease-in-out transform dark:bg-aubergine-dark focus:outline-none focus:bg-white" id="message" bind:value={message} placeholder="{content.en.contactForm.messageLabel}"></textarea>
    </div>
  </div>

  <div class="flex flex-wrap -mx-3 md:mb-4">
    <div class="w-full md:w-2/3 px-3 mb-4 md:mb-0 flex">
      <input id="captcha-response" class="appearance-none block md:w-full w-1/2 text-gray-dark rounded-l-2xl pt-4 pb-3 px-4 leading-tight transition duration-300 ease-in-out transform dark:bg-aubergine-dark focus:outline-none focus:bg-white" type="text" bind:value={userInput} placeholder="{content.en.contactForm.captchaLabel}" />
        <img id="captcha-container" class="w-1/2" src={captchaImageSrc} alt="Code" />
      <button on:click={generateCaptcha} class="bg-blue text-white p-2 rounded-r-full">
        {content.en.contactForm.regenerateCaptchaButton}
      </button>
    </div>
    <div class="w-full md:w-1/3 px-3 mb-4 md:mb-0">
      <button on:click={handleSubmit} class="w-full bg-blue text-white pt-4 pb-3 rounded-full transition transform hover:scale-105">
        {content.en.contactForm.sendButton}
      </button>
    </div>
  </div>
</div>