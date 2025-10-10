<!-- src/routes/LegalNotice.svelte -->
<script>
    import { onMount } from 'svelte';
    import { translations } from '../stores/contentStore.js';
    import { navigateToHome } from '../utils/navigation.js';
    import { appVersion } from '../utils/version.js';
    
    onMount(() => {
        // SEO
        document.title = $translations?.legal?.title || 'Impressum | Keymoji';
        
        // Scroll to top
        window.scrollTo(0, 0);
    });
</script>

<div class="min-h-screen bg-white dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
        <!-- Back Button -->
        <button
            on:click={navigateToHome}
            class="mb-8 inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {$translations?.legal?.backToHome || 'Zurück zur Startseite'}
        </button>

        <!-- Header -->
        <div class="mb-12">
            <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {$translations?.legal?.pageTitle || 'Impressum'}
            </h1>
            <p class="text-sm text-gray-600 dark:text-gray-400">
                {$translations?.legal?.legalNotice || 'Angaben gemäß § 5 TMG / § 25 MedienG'} | Version: {appVersion}
            </p>
        </div>

        <!-- Content -->
        <div class="prose prose-lg dark:prose-invert max-w-none">
            
            <!-- 1. Service Provider / Dienstanbieter -->
            <section class="mb-12">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {$translations?.legal?.sections?.provider?.title || '1. Dienstanbieter'}
                </h2>
                <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                    <p class="text-gray-700 dark:text-gray-300 mb-2">
                        <strong>Christopher Matt</strong><br>
                        Chooomedia<br>
                        <br>
                        <strong>Email:</strong> <a href="mailto:hello@keymoji.wtf" class="text-blue-600 dark:text-blue-400 hover:underline">hello@keymoji.wtf</a><br>
                        <strong>Website:</strong> <a href="https://keymoji.wtf" class="text-blue-600 dark:text-blue-400 hover:underline">keymoji.wtf</a>
                    </p>
                </div>
            </section>

            <!-- 2. Contact / Kontakt -->
            <section class="mb-12">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {$translations?.legal?.sections?.contact?.title || '2. Kontakt'}
                </h2>
                <p class="text-gray-700 dark:text-gray-300 mb-4">
                    Für Anfragen, Support und Feedback:
                </p>
                <ul class="list-none text-gray-700 dark:text-gray-300 space-y-2">
                    <li>📧 <strong>Email:</strong> <a href="mailto:hello@keymoji.wtf" class="text-blue-600 dark:text-blue-400 hover:underline">hello@keymoji.wtf</a></li>
                    <li>🌐 <strong>Website:</strong> <a href="https://keymoji.wtf" class="text-blue-600 dark:text-blue-400 hover:underline">keymoji.wtf</a></li>
                    <li>🐛 <strong>GitHub Issues:</strong> <a href="https://github.com/chooomedia/keymoji/issues" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">github.com/chooomedia/keymoji/issues</a></li>
                </ul>
            </section>

            <!-- 3. Verantwortlich für den Inhalt -->
            <section class="mb-12">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {$translations?.legal?.sections?.responsible?.title || '3. Verantwortlich für den Inhalt'}
                </h2>
                <p class="text-gray-700 dark:text-gray-300 mb-4">
                    Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:
                </p>
                <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                    <p class="text-gray-700 dark:text-gray-300">
                        <strong>Christopher Matt</strong><br>
                        Chooomedia<br>
                        Email: <a href="mailto:hello@keymoji.wtf" class="text-blue-600 dark:text-blue-400 hover:underline">hello@keymoji.wtf</a>
                    </p>
                </div>
            </section>

            <!-- 4. Haftungsausschluss -->
            <section class="mb-12">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {$translations?.legal?.sections?.disclaimer?.title || '4. Haftungsausschluss (Disclaimer)'}
                </h2>
                
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                    4.1 Haftung für Inhalte
                </h3>
                <p class="text-gray-700 dark:text-gray-300 mb-4">
                    Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
                </p>
                <p class="text-gray-700 dark:text-gray-300 mb-4">
                    Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
                </p>

                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                    4.2 Haftung für Links
                </h3>
                <p class="text-gray-700 dark:text-gray-300 mb-4">
                    Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
                </p>
                <p class="text-gray-700 dark:text-gray-300 mb-4">
                    Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
                </p>

                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                    4.3 Haftung für Passwort-Sicherheit
                </h3>
                <div class="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 p-6 rounded-lg">
                    <p class="text-gray-700 dark:text-gray-300 mb-2">
                        <strong>Wichtig:</strong> Keymoji ist ein Passwort-Generator Tool. Die Sicherheit der generierten Passwörter hängt von verschiedenen Faktoren ab:
                    </p>
                    <ul class="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                        <li>Länge und Komplexität des Passworts</li>
                        <li>Verwendung auf sicheren Systemen</li>
                        <li>Regelmäßige Aktualisierung</li>
                        <li>Sicherer Umgang durch den Nutzer</li>
                    </ul>
                    <p class="text-gray-700 dark:text-gray-300 mt-3">
                        Wir übernehmen keine Haftung für Schäden, die durch unsachgemäße Verwendung generierter Passwörter entstehen. Nutzer sind selbst für die sichere Aufbewahrung und Verwendung ihrer Passwörter verantwortlich.
                    </p>
                </div>

                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                    4.4 Haftung für AI-Generierung (Story Mode)
                </h3>
                <div class="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 p-6 rounded-lg">
                    <p class="text-gray-700 dark:text-gray-300 mb-2">
                        Bei Nutzung des Story Modes mit eigenen AI API Keys:
                    </p>
                    <ul class="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                        <li>Sie verwenden Ihre eigenen API Keys der jeweiligen Provider</li>
                        <li>Wir haben keine Kontrolle über die AI-generierten Inhalte</li>
                        <li>Sie sind für die Einhaltung der Nutzungsbedingungen Ihres AI Providers verantwortlich</li>
                        <li>Kosten für AI API Calls gehen zu Ihren Lasten</li>
                        <li>Wir übernehmen keine Haftung für Fehlfunktionen oder Kosten der AI Provider</li>
                    </ul>
                </div>
            </section>

            <!-- 5. Urheberrecht -->
            <section class="mb-12">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {$translations?.legal?.sections?.copyright?.title || '5. Urheberrecht'}
                </h2>
                <p class="text-gray-700 dark:text-gray-300 mb-4">
                    Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
                </p>
                <p class="text-gray-700 dark:text-gray-300 mb-4">
                    Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet.
                </p>
                <div class="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 p-6 rounded-lg">
                    <p class="text-gray-700 dark:text-gray-300 mb-2">
                        <strong>Open Source:</strong>
                    </p>
                    <p class="text-gray-700 dark:text-gray-300">
                        Keymoji ist Open Source Software unter der MIT Lizenz.<br>
                        Source Code: <a href="https://github.com/chooomedia/keymoji" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">github.com/chooomedia/keymoji</a><br>
                        Lizenz: <a href="https://github.com/chooomedia/keymoji/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">MIT License</a>
                    </p>
                </div>
            </section>

            <!-- 6. Streitbeilegung -->
            <section class="mb-12">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {$translations?.legal?.sections?.dispute?.title || '6. Streitbeilegung'}
                </h2>
                <p class="text-gray-700 dark:text-gray-300 mb-4">
                    Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">ec.europa.eu/consumers/odr</a>
                </p>
                <p class="text-gray-700 dark:text-gray-300 mb-4">
                    Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
                </p>
            </section>

            <!-- 7. Technical Credits -->
            <section class="mb-12">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {$translations?.legal?.sections?.credits?.title || '7. Technical Credits'}
                </h2>
                <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                    <p class="text-gray-700 dark:text-gray-300 mb-4">
                        <strong>Frontend:</strong> Svelte, Tailwind CSS, Webpack<br>
                        <strong>Backend:</strong> Vercel Serverless, n8n Automation<br>
                        <strong>Database:</strong> Google Sheets<br>
                        <strong>Email:</strong> Brevo<br>
                        <strong>AI Integration:</strong> OpenAI, Google Gemini, Mistral AI<br>
                        <strong>Hosting:</strong> Vercel<br>
                        <strong>Version:</strong> {appVersion}
                    </p>
                    <p class="text-gray-700 dark:text-gray-300 mb-2">
                        <strong>Base Template:</strong> <a href="https://github.com/davi-mbatista/start" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">start template project</a> by davi-mbatista
                    </p>
                    <p class="text-gray-700 dark:text-gray-300">
                        <strong>Emoji Data:</strong> Unicode Emoji Standard
                    </p>
                </div>
            </section>

        </div>

        <!-- Back to Top -->
        <div class="mt-12 text-center">
            <button
                on:click={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                class="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                {$translations?.legal?.backToTop || 'Nach oben'}
            </button>
        </div>
    </div>
</div>

<style>
    /* Prose styling for better readability */
    .prose h2 {
        border-bottom: 2px solid currentColor;
        padding-bottom: 0.5rem;
        margin-top: 2rem;
    }
    
    .prose h3 {
        margin-top: 1.5rem;
    }
    
    .prose a {
        word-break: break-word;
    }
</style>

