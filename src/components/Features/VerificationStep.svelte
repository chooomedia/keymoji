<!-- VerificationStep.svelte - Magic Link Verification Step -->
<script lang="ts">
    import { get } from 'svelte/store';
    import { translations } from '../../stores/contentStore';
    import Button from '../UI/Button.svelte';

    interface Props {
        isSubmitting: boolean;
        onResendMagicLink: () => void;
        onGoBack: () => void;
    }

    let {
        isSubmitting,
        onResendMagicLink,
        onGoBack
    }: Props = $props();
</script>

<div class="space-y-4">
    <Button
        variant="primary"
        size="md"
        fullWidth={true}
        on:click={onResendMagicLink}
        disabled={isSubmitting}
    >
        {#if isSubmitting}
            <span class="animate-spin mr-1">⏳</span>
            {get(translations)?.accountManager?.buttons?.sendingMagicLink || 'Sending...'}
        {:else}
            {get(translations)?.accountManager?.buttons?.resendMagicLink || '🔄 Resend Magic Link'}
        {/if}
    </Button>
    
    <Button
        variant="secondary"
        size="md"
        fullWidth={true}
        on:click={onGoBack}
    >
        {get(translations)?.accountManager?.buttons?.backToAccountOptions || '← Back to Account Options'}
    </Button>
    
    <!-- Help Section -->
    <div class="mt-6 p-4 bg-creme-600 dark:bg-aubergine-900 rounded-xl">
        <h3 class="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
            {get(translations)?.accountManager?.help?.title || '💡 Need Help?'}
        </h3>
        <ul class="text-xs text-blue-700 dark:text-blue-300 space-y-1">
            <li>{get(translations)?.accountManager?.help?.spamFolder || "• Check your spam folder if you don't see the email"}</li>
            <li>{get(translations)?.accountManager?.help?.magicLinkExpiry || '• Magic links expire after 15 minutes'}</li>
            <li>{get(translations)?.accountManager?.help?.requestNewLink || '• You can request a new link anytime'}</li>
            <li>{get(translations)?.accountManager?.help?.noPassword || '• No password required - just click the link'}</li>
        </ul>
    </div>
</div>

