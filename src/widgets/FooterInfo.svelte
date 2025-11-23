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
<!-- Mobile: Flex-col (vertikal) - Desktop: Flex-row (horizontal) -->
<footer 
    class="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-0 md:space-x-1 text-sm text-gray-400 transform -translate-y-4"
    itemscope 
    itemtype="https://schema.org/Person"
    aria-label="Site information">
    
    <!-- Mobile: Erste Zeile - Creator Attribution -->
    <!-- Desktop: In der Mitte zwischen Version und Visits -->
    <div class="flex flex-col md:flex-row items-center md:order-2">
        <span>Created by</span>
        <a 
            href="https://www.linkedin.com/in/chooomedia/" 
            target="_blank"
            rel="noopener noreferrer author"
            class="inline-flex items-center gap-1 hover:text-yellow-500 transition-colors duration-200 ml-1"
            itemprop="author"
            itemscope
            itemtype="https://schema.org/Person">
            
            <svg 
                class="w-4 h-4 transform translate-y-[0.5px]" 
                viewBox="0 0 24 24" 
                fill="currentColor"
                aria-hidden="true">
                {@html linkedinIcon}
            </svg>
            
            <span itemprop="name">Christopher Matt</span>
            <meta itemprop="url" content="https://www.linkedin.com/in/chooomedia/" />
            <meta itemprop="sameAs" content="https://keymoji.wtf" />
            <meta itemprop="jobTitle" content="Frontend Developer & Creator" />
            <meta itemprop="knowsAbout" content="JavaScript, Svelte, Frontend Development, UI/UX Design" />
        </a>
    </div>
    
    <!-- Mobile: Zweite Zeile - Version und Visits nebeneinander -->
    <!-- Desktop: Version links, Visits rechts -->
    <div class="flex items-center justify-center gap-2 md:gap-0 md:space-x-1 md:order-1">
        <!-- Version Information -->
        <button 
            on:click={navigateToVersion}
            class="hover:text-yellow-500 focus:text-yellow-500 active:text-yellow-600 transition-all duration-200 transform hover:scale-105 focus:scale-105 active:scale-95 focus:ring-2 focus:ring-yellow-50 focus:ring-offset-1 rounded px-1"
            type="button"
            aria-label={$translations?.footer?.versionHistory || 'View version history'}
            title={$translations?.footer?.versionHistory || 'View version history'}>
            {$translations?.header?.pageVersion || 'v0.4.3'}
        </button>
        
        <span class="px-2 hidden md:inline" aria-hidden="true">·</span>
        
        <!-- User Counter with accessibility -->
        <div class="inline-flex items-center" role="status" aria-live="polite">
            <UserCounter />
            <span class="ml-1">Visits</span>
        </div>
    </div>
    
    <!-- Desktop: Separator nach Creator -->
    <span class="px-2 hidden md:inline md:order-3" aria-hidden="true">·</span>

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