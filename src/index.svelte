<script context="module">
	import TrackingSettings from './widgets/TrackingSettings.svelte';
	export const Widgets = {
		"TrackingSettings": TrackingSettings
	}
</script>
<script>
	import EmojiDisplay from './EmojiDisplay.svelte';
	import DonateButton from './DonateButton.svelte';
	import ContactForm from './ContactForm.svelte';
	import ErrorModal from './ErrorModal.svelte';
	import LoginMenu from './LoginMenu.svelte';
	import Header from './Header.svelte';
	import { fade, fly } from 'svelte/transition';
	import { modalMessage } from './stores.js';
	import FixedMenu from './FixedMenu.svelte'; 
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
<title>{content.en.index.pageTitle}</title>
<meta name="description" content="{content.en.index.pageDescription}">
<!-- Other meta tags -->
</svelte:head>

{#if $modalMessage && $modalMessage.trim() !== ''}
	<ErrorModal />
{/if}

<main class="hieroglyphemojis" style="{bgImage}">
	<section class:dark={$darkMode} class="container mx-auto flex flex-col justify-center items-center h-screen py-5 overflow-auto touch-none z-10">
		<Header />
		<h2 class="md:w-1/3 w-80 text-sm text-center mb-4 dark:text-white z-10">
		{#each content.en.index.pageInstruction as instruction}
			<p>{instruction}</p>
		{/each}
		</h2>

		<div class="neumorphic pl-5 pr-5 pb-5 w-80 md:w-25r rounded-xl backdrop-blur-sm transition duration-300 ease-in-out transform bg-creme-80 dark:bg-aubergine-80 backdrop-opacity-60 backdrop-blur">
		{#if showForm}
			<ContactForm setModalMessage={setModalMessage} />
		{:else}
			<EmojiDisplay setModalMessage={setModalMessage} />
		{/if}
		</div>

		<p class="md:w-1/3 w-80 text-xs text-center mt-4 dark:text-white">
			{#if showForm}
				{content.en.index.backToMainText}<br>
				<button class="font-bold cursor-pointer" on:click={showContactForm}>{content.en.index.backToMainButtonText}</button>
			{:else}
				{content.en.index.contactText}<br>
				<button class="font-bold cursor-pointer" on:click={showContactForm}>{content.en.index.contactButtonText}</button>
			{/if}
		</p>

		<LoginMenu />

		{#if showResult}
		<div class="neumorphic fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-gray-600 dark:text-white" in:fade out:fade>
			{emojiSummary}
		</div>
		{/if}

		<DonateButton />

		<FixedMenu align={'bottom'}>
			<div slot="modal" let:selectedLink={selectedLink}>
				<svelte:component this={Widgets[selectedLink.dialogContent]}/>
			</div>
		
			<div class="fixed-menu-icon" slot="item" let:link={link} in:fly={{y: 57, duration: 300, delay: link?.id	 * 100}}>
				<span class="index-label" aria-label="menu-index-{link?.id}">
					{link?.id}
				</span>
				<img style="width: 28px; height: 28px;" src={link?.imgSrc} alt={link?.alt} />
				{link?.title}
			</div>
		</FixedMenu>
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