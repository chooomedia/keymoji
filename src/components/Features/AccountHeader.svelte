<!-- AccountHeader.svelte - Zeigt Account-Status mit Email, Badge und Context Menu -->
<script lang="ts">
    import { get } from 'svelte/store';
    import { currentAccount, accountTier } from '../../stores/appStores';
    import { translations } from '../../stores/contentStore';
    import ContextBadge from '../UI/ContextBadge.svelte';
    import ContextMenu from '../UI/ContextMenu.svelte';
    import { slide } from 'svelte/transition';

    interface Props {
        accountAgeLabel: string;
        onExportSettings: () => void;
        onImportSettings: () => void;
        onResetSettings: () => void;
        onLogout: () => void;
        onTriggerFileInput: () => void;
    }

    let {
        accountAgeLabel,
        onExportSettings,
        onImportSettings,
        onResetSettings,
        onLogout,
        onTriggerFileInput
    }: Props = $props();

    let showContextMenu = $state(false);
    let contextMenuPosition = $state({ x: 0, y: 0 });

    function toggleContextMenu(event: MouseEvent) {
        event.stopPropagation();
        showContextMenu = !showContextMenu;
        if (showContextMenu) {
            contextMenuPosition = { x: event.clientX, y: event.clientY };
        }
    }

    function closeContextMenu() {
        showContextMenu = false;
    }

    // Close context menu when clicking outside
    function handleClickOutside(event: MouseEvent) {
        if (showContextMenu && !(event.target as HTMLElement).closest('.context-menu')) {
            closeContextMenu();
        }
    }

    $effect(() => {
        if (typeof document !== 'undefined') {
            document.addEventListener('click', handleClickOutside);
            return () => {
                document.removeEventListener('click', handleClickOutside);
            };
        }
    });
</script>

<div class="flex items-center justify-between mb-6">
    <p class="text-gray-600 dark:text-gray-400">
        {get(currentAccount)?.email}
    </p>

    <!-- PRO Badge and Context Menu -->
    <div class="flex items-center gap-2">
        <ContextBadge 
            tier={get(accountTier)} 
            {accountAgeLabel}
            translations={get(translations)?.accountManager?.accountAge}
            position="top"
            variant="standard"
            trigger="hover"
            size="sm"
            width={null}
            intro={true}
            introDelay={2000}
            introDuration={4000}
        />

        <div class="relative context-menu">
            <button
                onclick={toggleContextMenu}
                class="p-2 rounded-full bg-powder-300 dark:bg-aubergine-950 text-gray-700 dark:text-white hover:bg-creme-600 dark:hover:bg-aubergine-900 focus:bg-creme-600 dark:focus:bg-aubergine-900 active:bg-creme-700 dark:active:bg-aubergine-800 transition-all transform hover:scale-105 focus:scale-105 active:scale-95 focus:ring-2 focus:ring-yellow-50 focus:ring-offset-2"
                aria-label={get(translations)?.accountManager?.contextMenu?.settingsMenu || 'Settings menu'}
                title={get(translations)?.accountManager?.contextMenu?.settingsMenu || 'Settings menu'}
            >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
            </button>
            
            <!-- Context Menu Dropdown -->
            {#if showContextMenu}
                <div 
                    class="absolute right-0 mt-2 w-48 bg-white dark:bg-aubergine-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                    style="top: 100%;"
                    transition:slide={{ duration: 200 }}
                >
                    <div class="py-1">
                        <button
                            onclick={() => { onExportSettings(); closeContextMenu(); }}
                            class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-aubergine-700 focus:bg-gray-100 dark:focus:bg-aubergine-700 active:bg-gray-200 dark:active:bg-aubergine-600 transition-all flex items-center focus:ring-2 focus:ring-yellow-50 focus:ring-offset-1"
                            aria-label={get(translations)?.accountManager?.contextMenu?.exportSettings || 'Export Settings'}
                        >
                            <span class="mr-2">📤</span>
                            {get(translations)?.accountManager?.contextMenu?.exportSettings || 'Export Settings'}
                        </button>
                        
                        <button
                            onclick={() => { onTriggerFileInput(); closeContextMenu(); }}
                            class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-aubergine-700 focus:bg-gray-100 dark:focus:bg-aubergine-700 active:bg-gray-200 dark:active:bg-aubergine-600 transition-all flex items-center focus:ring-2 focus:ring-yellow-50 focus:ring-offset-1"
                            aria-label={get(translations)?.accountManager?.contextMenu?.importSettings || 'Import Settings'}
                        >
                            <span class="mr-2">📥</span>
                            {get(translations)?.accountManager?.contextMenu?.importSettings || 'Import Settings'}
                        </button>
                        
                        <div class="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                        
                        <button
                            onclick={() => { onResetSettings(); closeContextMenu(); }}
                            class="w-full text-left px-4 py-2 text-sm text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 focus:bg-orange-50 dark:focus:bg-orange-900/20 active:bg-orange-100 dark:active:bg-orange-900/30 transition-all flex items-center focus:ring-2 focus:ring-orange-300 focus:ring-offset-1"
                            aria-label={get(translations)?.accountManager?.contextMenu?.resetToDefault || 'Reset to Default'}
                        >
                            <span class="mr-2">🔄</span>
                            {get(translations)?.accountManager?.contextMenu?.resetToDefault || 'Reset to Default'}
                        </button>
                        
                        <div class="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                        
                        <button
                            onclick={() => { onLogout(); closeContextMenu(); }}
                            class="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 focus:bg-red-50 dark:focus:bg-red-900/20 active:bg-red-100 dark:active:bg-red-900/30 transition-all flex items-center focus:ring-2 focus:ring-red-300 focus:ring-offset-1"
                            aria-label={get(translations)?.accountManager?.contextMenu?.logout || 'Logout'}
                        >
                            <span class="mr-2">🚪</span>
                            {get(translations)?.accountManager?.contextMenu?.logout || 'Logout'}
                        </button>
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>

