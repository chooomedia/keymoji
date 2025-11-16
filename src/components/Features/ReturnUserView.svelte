<!-- ReturnUserView.svelte - Simplified View für Return Users -->
<script lang="ts">
    import { get } from 'svelte/store';
    import { translations } from '../../stores/contentStore';
    import Button from '../UI/Button.svelte';

    interface Props {
        email: string;
        isSubmitting: boolean;
        isEmailValid: boolean;
        intelligentButtonText: string;
        anonymizeEmail: (email: string) => string;
        onSubmit: (event: Event) => void;
        onShowExpandedView: () => void;
    }

    let {
        email,
        isSubmitting,
        isEmailValid,
        intelligentButtonText,
        anonymizeEmail,
        onSubmit,
        onShowExpandedView
    }: Props = $props();
</script>

<!-- Pro upgrade hint -->
<div class="bg-creme-600 dark:bg-aubergine-900 rounded-xl p-4 mb-6 border border-purple-200 dark:border-purple-700">
    <div class="flex items-center justify-center space-x-2 mb-2">
        <span class="text-purple-600 dark:text-purple-400">💎</span>
        <span class="font-semibold text-purple-800 dark:text-purple-200">
            {get(translations)?.accountManager?.upgrade?.upgradeToPro || 'Upgrade to PRO'}
        </span>
    </div>
    <p class="text-sm text-purple-700 dark:text-purple-300">
        {get(translations)?.accountManager?.upgrade?.unlimitedGenerations || 'Unlimited generations and advanced security features'}
    </p>
</div>

<!-- Login form -->
<form onsubmit={(e) => { e.preventDefault(); onSubmit(e); }} class="space-y-4">
    <Button
        type="submit"
        variant="primary"
        size="md"
        fullWidth={true}
        disabled={isSubmitting || !isEmailValid}
    >
        <div class="flex flex-col items-center justify-center -m-2">
            <span>{intelligentButtonText}</span>
            <span class="text-sm text-gray-500">
                ({anonymizeEmail(email)})
            </span>
        </div>
    </Button>
    
    <!-- Alternative actions -->
    <Button
        type="button"
        variant="secondary"
        size="sm"
        fullWidth={true}
        onclick={onShowExpandedView}
    >
        {get(translations)?.accountManager?.buttons?.showFullForm || 'Show full form'}
    </Button>
</form>

