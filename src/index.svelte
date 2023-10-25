<script>
	import EmojiDisplay from './EmojiDisplay.svelte';
	import DonateButton from './DonateButton.svelte';
	import ContactForm from './ContactForm.svelte';
	import ErrorModal from './ErrorModal.svelte';
	import LoginMenu from './LoginMenu.svelte';
	import EraseLocalstorage from './EraseLocalstorage.svelte';
	import Header from './Header.svelte';
	import { fade } from 'svelte/transition';
	import { modalMessage } from './stores.js';
	import { Router, Route, Link } from 'svelte-routing';

	function setModalMessage(message) {
		modalMessage.set(message);  // Directly set the store value
	}

	let darkMode = localStorage.getItem('darkMode') === 'dark';
	let showResult = false;
	let emojiSummary = '';
	let showForm = false;
	let hieroglyphicEmojisSrc = './images/keymoji-emoji-pattern-background-egypt-hieroglyphes-ai-dall-e.png';

	function toggleDarkMode() {
		darkMode = !darkMode;
		localStorage.setItem('darkMode', darkMode ? 'dark' : 'light');
	}

	function showContactForm() {
		showForm = !showForm;
	}

	$: bgImage = `background-image: url("${hieroglyphicEmojisSrc}");background-size:16%;`;
</script>

<svelte:head>
<title>Keymoji - High securely Emoji Password Generator</title>
<meta name="description" content="Generate passwords using emojis. Safe, fun, and innovative.">
<!-- Other meta tags -->
</svelte:head>

{#if $modalMessage && $modalMessage.trim() !== ''}
	<ErrorModal />
{/if}

<main class="hieroglyphemojis" style="{bgImage}">
	<section class:dark={darkMode} class=" container container mx-auto flex flex-col justify-center items-center h-screen py-5 overflow-auto touch-none z-10">
		<Header />
		<h2 class="md:w-1/3 w-80 text-sm text-center mb-8 dark:text-white">
		Emoji Passwort Generator
		</h2>
		<h2 class="md:w-1/3 w-80 text-sm text-center mb-4 dark:text-white z-10">
		Click "Story" for your AI emoji tale 📖<br> 
		"Random" is self-explanatory 😜.<br>
		After generating, it's saved to your clipboard! 📋
		</h2>

		<div class="neumorphic pl-5 pr-5 pb-5 w-80 md:w-23r rounded-xl backdrop-blur-sm bg-creme-80 dark:bg-aubergine-80 backdrop-opacity-60 backdrop-blur">
		{#if showForm}
			<ContactForm setModalMessage={setModalMessage} />
		{:else}
			<EmojiDisplay setModalMessage={setModalMessage} />
		{/if}
		</div>

		<p class="md:w-1/3 w-80 text-xs text-center mt-4 dark:text-white">
			{#if showForm}
				Click on below 👇 to get back<br>
				<button class="font-bold cursor-pointer" on:click={showContactForm}>Back to main view 🔙</button>
			{:else}
				Got a question or a cool suggestion?<br>
				<button class="font-bold cursor-pointer" on:click={showContactForm}>Send me a message! 💌</button>
			{/if}
		</p>

		<LoginMenu />

		<button class="bg-blue transition transform hover:scale-105 fixed top-4 right-4 py-2 px-3 rounded-full" on:click={toggleDarkMode}>
			{darkMode ? '🌙' : '☀️'}
		</button>

		{#if showResult}
		<div class="neumorphic fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-gray-600 dark:text-white" in:fade out:fade>
			{emojiSummary}
		</div>
		{/if}

		<EraseLocalstorage />

		<DonateButton />
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