<!-- AccountCreationForm.svelte - Login/Account Creation Form -->
<script lang="ts">
    import { get } from 'svelte/store';
    import { translations } from '../../stores/contentStore';
    import Input from '../UI/Input.svelte';
    import Button from '../UI/Button.svelte';

    interface Props {
        email: string;
        name: string;
        showProfileForm: boolean;
        isSubmitting: boolean;
        isEmailValid: boolean;
        isNameValid: boolean;
        isFormValid: boolean;
        loginButtonText: string;
        magicLinkButtonText: string;
        intelligentButtonText: string;
        onToggleProfileForm: () => void;
        onSubmit: (event: Event) => void;
        onShowExpandedView?: () => void;
        showExpandedViewToggle?: boolean;
        anonymizeEmail?: (email: string) => string;
    }

    let {
        email = $bindable(''),
        name = $bindable(''),
        showProfileForm,
        isSubmitting,
        isEmailValid,
        isNameValid,
        isFormValid,
        loginButtonText,
        magicLinkButtonText,
        intelligentButtonText,
        onToggleProfileForm,
        onSubmit,
        onShowExpandedView,
        showExpandedViewToggle = false,
        anonymizeEmail
    }: Props = $props();
</script>

<div class="bg-transparent mb-2 relative z-20">
    <form on:submit|preventDefault={onSubmit} class="space-y-4">
        <div>
            <label for="email" class="sr-only">{get(translations)?.accountManager?.emailLabel || 'Email'}</label>
            <Input
                id="email"
                type="email"
                bind:value={email}
                placeholder={get(translations)?.accountManager?.emailLabel || 'Email'}
                required={true}
                disabled={isSubmitting}
                invalid={!isEmailValid && email.trim() !== ''}
                valid={isEmailValid && email.trim() !== ''}
                autocomplete="email"
            />
        </div>

        {#if showProfileForm}
            <div>
                <label for="name" class="sr-only">{get(translations)?.accountManager?.nameLabel || 'Name'}</label>
                <Input
                    id="name"
                    type="text"
                    bind:value={name}
                    placeholder={get(translations)?.accountManager?.nameLabel || 'Name'}
                    required={true}
                    disabled={isSubmitting}
                    invalid={!isNameValid && name.trim() !== ''}
                    valid={isNameValid && name.trim() !== ''}
                    autocomplete="name"
                />
            </div>
        {/if}

        <!-- Form Validation -->
        {#if !isFormValid && email}
            <div class="text-sm text-red-600 dark:text-red-400 text-center">
                {#if !isEmailValid}
                    <p id="email-error">⚠️ {get(translations)?.accountManager?.validation?.emailInvalid || 'Please enter a valid email address'}</p>
                {/if}
                {#if showProfileForm && !isNameValid}
                    <p id="name-error">⚠️ {get(translations)?.accountManager?.validation?.nameInvalid || 'Please enter your name (minimum 2 characters)'}</p>
                {/if}
            </div>
        {/if}

        <Button
            type="submit"
            variant="primary"
            size="md"
            fullWidth={true}
            disabled={!isFormValid || isSubmitting}
        >
            {#if isSubmitting}
                <span class="flex items-center justify-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {loginButtonText}
                </span>
            {:else}
                {magicLinkButtonText}
            {/if}
        </Button>
        
        <!-- Small buttons side by side -->
        <div class="flex gap-3">
            <Button
                variant="secondary"
                size="sm"
                fullWidth={true}
                on:click={onToggleProfileForm}
            >
                <span class="mr-1.5">👤</span>{showProfileForm ? (get(translations)?.accountManager?.buttons?.hideProfile || 'Hide') : (get(translations)?.accountManager?.buttons?.addProfile || 'Add')} {get(translations)?.accountManager?.buttons?.name || 'Name'}
            </Button>
            
            {#if showExpandedViewToggle && onShowExpandedView}
                <Button
                    variant="secondary"
                    size="sm"
                    fullWidth={true}
                    on:click={onShowExpandedView}
                >
                    {get(translations)?.accountManager?.buttons?.compactView || 'Compact view'}
                </Button>
            {/if}
        </div>
    </form>
</div>

<!-- Footer -->
<div class="pt-4 border-t border-gray-200 dark:border-gray-700">
    <div class="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
        <span class="flex items-center">
            🔗 {get(translations)?.accountManager?.footer?.magicLink || 'Magic link'}
        </span>
        <span class="flex items-center">
            ⚡ {get(translations)?.accountManager?.footer?.instantSetup || 'Instant Setup'}
        </span>
        <span class="flex items-center">
            🛡️ {get(translations)?.accountManager?.footer?.noSpam || 'No Spam'}
        </span>
    </div>
</div>

