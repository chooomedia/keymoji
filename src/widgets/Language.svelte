<script context="module">
  import { writable } from 'svelte/store';
  import content from '../content.js';

  function getLanguage() {
    const lang = document.documentElement.lang || navigator.language || 'en';
    return content[lang] ? lang : 'en';
  }

  let language = getLanguage();
  let textContent = content[language];

  export const languageStore = writable(language);
  export const languageText = writable(textContent);

  export function setLanguage(newLang) {
    if (content[newLang]) {
      language = newLang;
      textContent = content[newLang];
      languageStore.set(newLang);
      languageText.set(textContent);
      document.documentElement.lang = newLang;

      // Set the body class to change the font
      if (newLang === 'qya') {
        document.body.classList.add('font-elvish');
      } else {
        document.body.classList.remove('font-elvish');
      }
    }
  }
</script>

