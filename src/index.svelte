<script>
	import EmojiDisplay from './EmojiDisplay.svelte';
	import ContactForm from './ContactForm.svelte';
	import ErrorModal from './ErrorModal.svelte';
	import LoginMenu from './LoginMenu.svelte';
	import Header from './Header.svelte';
	import { fade, fly } from 'svelte/transition';
	import { modalMessage } from './stores.js';
	import FixedMenu from './widgets/FixedMenu.svelte'; 
	import { darkMode } from './stores.js';
	import content from './content.js';

	function setModalMessage(message) {
		modalMessage.set(message);  // Directly set the store value
	}
	
	let showResult = false;
	let emojiSummary = '';
	let showForm = false;
	let hieroglyphicEmojisSrc = './images/keymoji-emoji-pattern-background-egypt-hieroglyphes-ai-dall-e.png';

	function showContactForm() {
		showForm = !showForm;
	}

	$: bgImage = `background-image: url("${hieroglyphicEmojisSrc}");background-size:16%;`;
	function toggleDarkMode() {
		darkMode.update(currentMode => !currentMode);
	}
</script>

<svelte:head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{content.en.index.pageTitle}</title>
  <meta name="description" content="{content.en.index.pageDescription}">
  <meta name="keywords" content="{content.en.index.pageKeywords}">
  <meta name="author" content="Keymoji Team">
  <!-- Open Graph / Social Media Tags -->
  <meta property="og:title" content="{content.en.index.pageTitle}">
  <meta property="og:description" content="{content.en.index.pageDescription}">
  <meta property="og:image" content="URL_zum_Keymoji_Logo">
  <meta property="og:url" content="https://🔑moji.ws/images/keymoji-c-matt-frontend-developer-javascript-php-svelte-wordpress-creator-smirking-face_1f60f.gif">
  <meta property="og:type" content="website">
  <!-- Weitere relevante Tags -->
</svelte:head>

{#if $modalMessage && $modalMessage.trim() !== ''}
	<ErrorModal />
{/if}

<main class="hieroglyphemojis" style="{bgImage}">
	<section class:dark={$darkMode} class="container mx-auto flex flex-col justify-center items-center min-h-screen py-5 overflow-auto touch-none z-10">
		<Header />

		<div class="neumorphic pl-5 pr-5 pb-5 w-80 md:w-25r rounded-xl backdrop-blur-sm bg-creme-80 dark:bg-aubergine-80 backdrop-opacity-60 backdrop-blur transition duration-300 ease-in-out transform ">
		{#if showForm}
			<ContactForm setModalMessage={setModalMessage} />
		{:else}
			<EmojiDisplay setModalMessage={setModalMessage} />
		{/if}

			<p class="text-xs text-center mt-2 pt-2 pb-1 px-2 rounded-xl dark:text-white bg-creme-80 dark:bg-aubergine-80">
				{#if showForm}
					{content.en.index.backToMainText}<br>
					<button class="font-bold cursor-pointer" on:click={showContactForm}>{content.en.index.backToMainButtonText}</button>
				{:else}
					{content.en.index.contactText}<br>
					<button class="font-bold cursor-pointer" on:click={showContactForm}>{content.en.index.contactButtonText}</button>
				{/if}
			</p>
		</div>

		<LoginMenu />

		{#if showResult}
		<div class="neumorphic fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-gray-600 dark:text-white" in:fade out:fade>
			{emojiSummary}
		</div>
		{/if}

		<FixedMenu align={'bottom'} />
	</section>
</main>

<style>
	section.dark {
		background-image: linear-gradient(-45deg, #050413f8, #040320f5, #080715f7, #040310f8);
	}
	section {
		background-image: linear-gradient(-45deg, #e0e0e0eb, #e0e0e0e7, #ecececef, #e0e0e0ee);
	}

	.hieroglyphemojis {
		animation: gradient 270s ease infinite;
		background-size: 16%;
	}

	@keyframes gradient {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}

	.neumorphic {
	  box-shadow:  20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff;
	}
	.dark .neumorphic {
	  box-shadow:  20px 20px 60px #0c0d22, -20px -20px 60px #1c1c1c;
	}
</style>