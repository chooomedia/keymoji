<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { fade, scale } from 'svelte/transition';
    import { currentLanguage } from '../../stores/contentStore';
    import { logout } from '../../stores/accountStore';

    const dispatch = createEventDispatcher();

    // Props (Svelte 5 Runes)
    interface Props {
        isVisible?: boolean;
        x?: number;
        y?: number;
    }
    
    let { isVisible = false, x = 0, y = 0 }: Props = $props();

    function handleLogout() {
        logout();
        dispatch('close');
    }

    function handleExportSettings() {
        dispatch('export');
        dispatch('close');
    }

    function handleImportSettings() {
        dispatch('import');
        dispatch('close');
    }

    function handleResetSettings() {
        dispatch('reset');
        dispatch('close');
    }

    function handleClose() {
        dispatch('close');
    }

    function handleBackdropClick(event) {
        if (event.target === event.currentTarget) {
            handleClose();
        }
    }

    function handleKeydown(event) {
        if (event.key === 'Escape') {
            handleClose();
        }
    }

    // Helper function to get localized text
    function getLocalizedText(textObj, fallback = '') {
        return textObj?.[$currentLanguage] || textObj?.en || fallback;
    }

    // Menu items with translations
    const menuItems = [
        {
            id: 'export',
            icon: '📤',
            title: {
                en: 'Export Settings',
                de: 'Einstellungen exportieren',
                fr: 'Exporter les paramètres',
                es: 'Exportar ajustes',
                it: 'Esportare le impostazioni',
                ja: '設定をエクスポート',
                ko: '설정 내보내기',
                nl: 'Instellingen exporteren',
                pl: 'Eksportuj ustawienia',
                ru: 'Экспортировать настройки',
                tr: 'Ayarları dışa aktar',
                af: 'Instellings uitvoer',
                sjn: 'Export Settings',
                tlh: 'Export Settings',
                'de-CH': 'Einstellungen exportieren'
            },
            action: handleExportSettings,
            color: 'text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30'
        },
        {
            id: 'import',
            icon: '📥',
            title: {
                en: 'Import Settings',
                de: 'Einstellungen importieren',
                fr: 'Importer les paramètres',
                es: 'Importar ajustes',
                it: 'Importare le impostazioni',
                ja: '設定をインポート',
                ko: '설정 가져오기',
                nl: 'Instellingen importeren',
                pl: 'Importuj ustawienia',
                ru: 'Импортировать настройки',
                tr: 'Ayarları içe aktar',
                af: 'Instellings invoer',
                sjn: 'Import Settings',
                tlh: 'Import Settings',
                'de-CH': 'Einstellungen importieren'
            },
            action: handleImportSettings,
            color: 'text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/30'
        },
        {
            id: 'reset',
            icon: '🔄',
            title: {
                en: 'Reset to Default',
                de: 'Auf Standard zurücksetzen',
                fr: 'Réinitialiser par défaut',
                es: 'Restablecer a los valores por defecto',
                it: 'Ripristina impostazioni predefinite',
                ja: 'デフォルトにリセット',
                ko: '기본값으로 초기화',
                nl: 'Standaard instellingen herstellen',
                pl: 'Przywróć ustawienia domyślne',
                ru: 'Сбросить настройки по умолчанию',
                tr: 'Varsayılır ayarlara sıfırla',
                af: 'Standaard instellings herstel',
                sjn: 'Reset to Default',
                tlh: 'Reset to Default',
                'de-CH': 'Auf Standard zurücksetzen'
            },
            action: handleResetSettings,
            color: 'text-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-900/30'
        },
        {
            id: 'logout',
            icon: '🚪',
            title: {
                en: 'Logout',
                de: 'Abmelden',
                fr: 'Se déconnecter',
                es: 'Cerrar sesión',
                it: 'Disconnetti',
                ja: 'ログアウト',
                ko: '로그아웃',
                nl: 'Uitloggen',
                pl: 'Wyloguj się',
                ru: 'Выйти',
                tr: 'Çıkış yap',
                af: 'Afmeld',
                sjn: 'Logout',
                tlh: 'Logout',
                'de-CH': 'Abmelden'
            },
            action: handleLogout,
            color: 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30'
        }
    ];
</script>

{#if isVisible}
    <div 
        class="fixed inset-0 z-50"
        onclick={handleBackdropClick}
        onkeydown={handleKeydown}
        transition:fade={{ duration: 150 }}
    >
        <div 
            class="absolute bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 min-w-48"
            style="left: {x}px; top: {y}px;"
            transition:scale={{ duration: 150, start: 0.95 }}
        >
            {#each menuItems as item}
                <button
                    onclick={item.action}
                    class="w-full px-4 py-2 text-left text-sm flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 {item.color}"
                >
                    <span class="text-lg">{item.icon}</span>
                    <span>{getLocalizedText(item.title)}</span>
                </button>
            {/each}
        </div>
    </div>
{/if} 