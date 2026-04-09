<script>
    import { accountStore } from '../../stores/accountStore.js';
    import { goto } from '$app/navigation';

    // Reactive variables from store
    $: currentAccount = $accountStore.currentAccount;
    $: accountLoading = $accountStore.loading;
    $: accountError = $accountStore.error;
    $: accountTier = $accountStore.tier;

    function handleClick() {
        if (accountLoading) return;
        
        if (accountError) {
            // Retry loading account
            accountStore.loadAccount();
            return;
        }

        if (!currentAccount) {
            // Navigate to account creation
            goto('/account-creation');
        } else {
            // Navigate to account management
            goto('/account-manage');
        }
    }

    function getAccountStatusText() {
        if (accountLoading) return 'Loading...';
        if (accountError) return 'Error';
        if (!currentAccount) return 'JOIN';
        return accountTier || 'FREE';
    }

    function getTierIcon(tier) {
        switch (tier) {
            case 'PRO':
                return '⭐';
            case 'FREE':
                return '👤';
            default:
                return '👤';
        }
    }

    function getButtonTitle() {
        if (accountLoading) return 'Loading account status...';
        if (accountError) return 'Error loading account. Click to retry.';
        if (!currentAccount) return 'Create account to save your emoji passwords';
        return `Account: ${currentAccount.email} (${accountTier || 'FREE'})`;
    }

    function getButtonAriaLabel() {
        if (accountLoading) return 'Loading account status';
        if (accountError) return 'Error loading account, click to retry';
        if (!currentAccount) return 'Create account';
        return `Account: ${currentAccount.email}, ${accountTier || 'FREE'} tier`;
    }

    function getAccountStatusClass() {
        if (accountLoading) return 'account-status-loading';
        if (accountError) return 'account-status-error';
        if (!currentAccount) return 'account-status-guest';
        return accountTier === 'PRO' ? 'account-status-pro' : 'account-status-free';
    }
</script>

<span
    class="account-status-btn {getAccountStatusClass()}"
    on:click={handleClick}
    on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { handleClick(); } }}
    role="button"
    tabindex="0"
    title={getButtonTitle()}
    aria-label={getButtonAriaLabel()}
>
    {#if accountLoading}
        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow inline-block" aria-label="Loading account status"></div>
    {:else if accountError}
        <span class="flex items-center gap-1">⚠️ {getAccountStatusText()}</span>
    {:else}
        <span class="flex items-center gap-1">
            {#if !currentAccount}
                {getTierIcon(accountTier)}{getAccountStatusText()}
            {:else}
                {getTierIcon(accountTier)} {getAccountStatusText()}
            {/if}
        </span>
    {/if}
</span>
