<!-- src/widgets/FooterInfo.svelte -->
<script>
    import { currentLanguage, translations } from '../stores/contentStore.js';
    import { navigateToVersions } from '../utils/navigation';
    import UserCounter from '../components/Core/UserCounter.svelte';
    import { linkedinIcon } from '../assets/shapes.js';

    function navigateToVersion() {
        navigateToVersions(false);
    }
</script>

<!-- Footer slot content with E-E-A-T-S Schema Markup for SEO -->
<!-- Mobile & Desktop: Alles in einer Zeile -->
<!-- Mobile: Kleinere Schrift (text-xs), Desktop: Normale Schrift (md:text-sm) -->
<!-- Desktop Layout: Version · Creator · Visits -->
<footer 
    class="flex flex-row items-center justify-center flex-wrap md:flex-nowrap gap-x-1 md:gap-x-0 md:space-x-0 md:space-x-1 text-xs md:text-sm text-gray-400 transform -translate-y-4 whitespace-nowrap"
    itemscope 
    itemtype="https://schema.org/Person"
    aria-label="Site information">
    
    <!-- Version Information - Desktop: Links (md:order-1) -->
    <div class="flex items-center justify-center shrink-0 md:order-1">
        <button 
            on:click={navigateToVersion}
            class="hover:text-yellow-500 focus:text-yellow-500 active:text-yellow-600 transition-all duration-200 transform hover:scale-105 focus:scale-105 active:scale-95 focus:ring-2 focus:ring-yellow-50 focus:ring-offset-1 rounded px-1 whitespace-nowrap"
            type="button"
            aria-label={$translations?.footer?.versionHistory || 'View version history'}
            title={$translations?.footer?.versionHistory || 'View version history'}>
            {$translations?.header?.pageVersion || 'v0.4.3'}
        </button>
    </div>
    
    <!-- Separator nach Version -->
    <span class="px-1 md:px-2 shrink-0 md:order-2" aria-hidden="true">·</span>
    
    <!-- Creator Attribution - Desktop: Mitte (md:order-3) -->
    <div class="flex items-center justify-center shrink-0 md:order-3">
        <span class="whitespace-nowrap">Created by</span>
        <a 
            href="https://www.linkedin.com/in/chooomedia/" 
            target="_blank"
            rel="noopener noreferrer author"
            class="inline-flex items-center gap-1 hover:text-yellow-500 transition-colors duration-200 ml-1 whitespace-nowrap shrink-0"
            itemprop="author"
            itemscope
            itemtype="https://schema.org/Person">
            
            <svg 
                class="w-3 h-3 md:w-4 md:h-4 transform translate-y-[0.5px] shrink-0" 
                viewBox="0 0 24 24" 
                fill="currentColor"
                aria-hidden="true">
                {@html linkedinIcon}
            </svg>
            
            <span itemprop="name" class="whitespace-nowrap">Christopher Matt</span>
            <meta itemprop="url" content="https://www.linkedin.com/in/chooomedia/" />
            <meta itemprop="sameAs" content="https://keymoji.wtf" />
            <meta itemprop="jobTitle" content="Frontend Developer & Creator" />
            <meta itemprop="knowsAbout" content="JavaScript, Svelte, Frontend Development, UI/UX Design" />
        </a>
    </div>
    
    <!-- Separator nach Creator -->
    <span class="px-1 md:px-2 shrink-0 md:order-4" aria-hidden="true">·</span>
    
    <!-- User Counter - Desktop: Rechts (md:order-5) -->
    <div class="flex items-center justify-center shrink-0 md:order-5">
        <div class="inline-flex items-center whitespace-nowrap" role="status" aria-live="polite">
            <UserCounter />
            <span class="ml-1 whitespace-nowrap">Visits</span>
        </div>
    </div>

    <!-- Hidden Schema Markup for Software/Website -->
    <div style="display: none;">
        <div 
            itemscope 
            itemtype="https://schema.org/WebApplication"
            itemid="https://keymoji.wtf">
            <meta itemprop="name" content="Keymoji - Emoji Password Generator" />
            <meta itemprop="description" content="Generate secure, AI-resistant emoji passwords. Create memorable passwords with emojis in 15+ languages." />
            <meta itemprop="url" content="https://keymoji.wtf" />
            <meta itemprop="applicationCategory" content="SecurityApplication" />
            <meta itemprop="operatingSystem" content="Web Browser" />
            <meta itemprop="browserRequirements" content="Requires JavaScript" />
            <div itemprop="author" itemscope itemtype="https://schema.org/Person">
                <meta itemprop="name" content="Christopher Matt" />
                <meta itemprop="url" content="https://www.linkedin.com/in/chooomedia/" />
            </div>
            <div itemprop="creator" itemscope itemtype="https://schema.org/Person">
                <meta itemprop="name" content="Christopher Matt" />
                <meta itemprop="jobTitle" content="Frontend Developer" />
            </div>
            <meta itemprop="dateCreated" content="2023-11-01" />
            <meta itemprop="dateModified" content="2024-12-01" />
            <meta itemprop="version" content="{$translations?.header?.pageVersion || 'v0.4.3'}" />
        </div>
    </div>
</footer> 