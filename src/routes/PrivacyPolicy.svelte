<!-- src/routes/PrivacyPolicy.svelte -->
<script>
    import { onMount } from 'svelte';
    import { translations } from '../stores/contentStore.js';
    import { navigateToHome } from '../utils/navigation.js';
    import { appVersion } from '../utils/version.js';
    
    let currentDate = new Date().toLocaleDateString($translations?.meta?.locale || 'de-DE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    onMount(() => {
        // SEO
        document.title = $translations?.privacy?.title || 'Datenschutzerklärung | Keymoji';
        
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
            {$translations?.privacy?.backToHome || 'Zurück zur Startseite'}
        </button>

        <!-- Header -->
        <div class="mb-12">
            <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {$translations?.privacy?.pageTitle || 'Datenschutzerklärung'}
            </h1>
            <p class="text-sm text-gray-600 dark:text-gray-400">
                {$translations?.privacy?.lastUpdated || 'Letzte Aktualisierung'}: {currentDate} | Version: {appVersion}
            </p>
        </div>

        <!-- Content -->
        <div class="prose prose-lg dark:prose-invert max-w-none">
            
            <!-- 1. Einleitung -->
            <section class="mb-12">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {$translations?.privacy?.sections?.intro?.title || '1. Einleitung'}
                </h2>
                <p class="text-gray-700 dark:text-gray-300 mb-4">
                    Der Schutz Ihrer Privatsphäre ist uns sehr wichtig. Diese Datenschutzerklärung informiert Sie über die Art, den Umfang und Zweck der Verarbeitung personenbezogener Daten auf unserer Website <strong>keymoji.wtf</strong> (im Folgenden "Dienst" oder "Website").
                </p>
                <p class="text-gray-700 dark:text-gray-300 mb-4">
                    Wir verarbeiten Ihre Daten ausschließlich auf Grundlage der gesetzlichen Bestimmungen (DSGVO, revDSGV, TKG 2003).
                </p>
            </section>

            <!-- 2. Verantwortlicher -->
            <section class="mb-12">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {$translations?.privacy?.sections?.responsible?.title || '2. Verantwortlicher'}
                </h2>
                <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                    <p class="text-gray-700 dark:text-gray-300 mb-2">
                        <strong>Christopher Matt</strong><br>
                        Chooomedia<br>
                        Email: <a href="mailto:hello@keymoji.wtf" class="text-blue-600 dark:text-blue-400 hover:underline">hello@keymoji.wtf</a><br>
                        Website: <a href="https://keymoji.wtf" class="text-blue-600 dark:text-blue-400 hover:underline">keymoji.wtf</a>
                    </p>
                </div>
            </section>

            <!-- 3. Datenverarbeitung -->
            <section class="mb-12">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {$translations?.privacy?.sections?.dataProcessing?.title || '3. Datenverarbeitung'}
                </h2>
                
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                    3.1 Client-Side Verarbeitung (Privacy-First)
                </h3>
                <p class="text-gray-700 dark:text-gray-300 mb-4">
                    <strong>Keymoji ist primär eine Client-Side Anwendung.</strong> Das bedeutet:
                </p>
                <ul class="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                    <li>Alle Passwort- und Emoji-Generierungen erfolgen <strong>lokal in Ihrem Browser</strong></li>
                    <li>Wir sehen Ihre generierten Passwörter <strong>niemals</strong> (Zero-Knowledge)</li>
                    <li>Keine Übertragung von Passwörtern an unsere Server</li>
                    <li>Keine Speicherung von Passwörtern in unserer Datenbank</li>
                </ul>

                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                    3.2 Kontoerstellung (optional)
                </h3>
                <p class="text-gray-700 dark:text-gray-300 mb-4">
                    Wenn Sie ein kostenloses oder PRO-Konto erstellen, verarbeiten wir folgende Daten:
                </p>
                <ul class="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                    <li><strong>E-Mail-Adresse:</strong> Für Magic Link Login und Kontoverwaltung</li>
                    <li><strong>Name (optional):</strong> Zur Personalisierung Ihres Kontos</li>
                    <li><strong>Nutzungsstatistiken:</strong> Anzahl täglicher Generierungen (für Limit-Verwaltung)</li>
                    <li><strong>Einstellungen:</strong> Sprache, Theme, Emoji-Präferenzen</li>
                    <li><strong>Account-Tier:</strong> FREE oder PRO</li>
                    <li><strong>Erstellungsdatum:</strong> Zeitpunkt der Kontoerstellung</li>
                </ul>
                <p class="text-gray-700 dark:text-gray-300 mt-4">
                    <strong>Rechtsgrundlage:</strong> Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO)
                </p>

                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                    3.3 Story Mode & AI Integration
                </h3>
                <p class="text-gray-700 dark:text-gray-300 mb-4">
                    Wenn Sie den <strong>Story Mode</strong> nutzen, können Sie Ihren eigenen AI API Key hinterlegen:
                </p>
                <ul class="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                    <li><strong>API Keys:</strong> Werden verschlüsselt in unserem Backend gespeichert</li>
                    <li><strong>AI Provider:</strong> OpenAI, Google Gemini, Mistral, oder Custom API</li>
                    <li><strong>Story-Texte:</strong> Werden temporär an den gewählten AI Provider übermittelt</li>
                    <li><strong>Generierte Emojis:</strong> Werden lokal gecacht (7 Tage) zur Kostenoptimierung</li>
                </ul>
                <p class="text-gray-700 dark:text-gray-300 mt-4">
                    <strong>Wichtig:</strong> Sie nutzen Ihren eigenen API Key - wir haben keinen Zugriff auf Ihre AI Provider Konten. Bitte beachten Sie auch die Datenschutzerklärungen der jeweiligen AI Provider.
                </p>
                <p class="text-gray-700 dark:text-gray-300 mt-4">
                    <strong>Rechtsgrundlage:</strong> Einwilligung (Art. 6 Abs. 1 lit. a DSGVO)
                </p>
            </section>

            <!-- 4. Externe Dienste -->
            <section class="mb-12">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {$translations?.privacy?.sections?.externalServices?.title || '4. Externe Dienste & APIs'}
                </h2>
                
                <div class="space-y-6">
                    <!-- Vercel -->
                    <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            4.1 Vercel (Hosting & Serverless Functions)
                        </h3>
                        <p class="text-gray-700 dark:text-gray-300 mb-2">
                            Unsere Website wird auf <strong>Vercel</strong> gehostet (Vercel Inc., San Francisco, USA).
                        </p>
                        <ul class="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                            <li>Server-Logs (IP-Adressen, Zugriffszeitpunkte)</li>
                            <li>API Request Logs (für Backend-Funktionen)</li>
                            <li>Datenschutzerklärung: <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">vercel.com/legal/privacy-policy</a></li>
                        </ul>
                    </div>

                    <!-- Google Sheets -->
                    <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            4.2 Google Sheets (Datenbank)
                        </h3>
                        <p class="text-gray-700 dark:text-gray-300 mb-2">
                            Kontodaten werden in <strong>Google Sheets</strong> gespeichert (Google LLC, Mountain View, USA).
                        </p>
                        <ul class="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                            <li>Verschlüsselte Speicherung der API Keys</li>
                            <li>Nutzungsstatistiken für Limitverwaltung</li>
                            <li>Datenschutzerklärung: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">policies.google.com/privacy</a></li>
                        </ul>
                    </div>

                    <!-- n8n Automation -->
                    <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            4.3 n8n Automation (Workflow Engine)
                        </h3>
                        <p class="text-gray-700 dark:text-gray-300 mb-2">
                            Backend-Workflows laufen über <strong>n8n</strong> (selbst gehostet auf n8n.chooomedia.com).
                        </p>
                        <ul class="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                            <li>Account Management (Erstellen, Aktualisieren, Löschen)</li>
                            <li>Magic Link Versand</li>
                            <li>Usage Tracking</li>
                        </ul>
                    </div>

                    <!-- Brevo -->
                    <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            4.4 Brevo (E-Mail-Versand)
                        </h3>
                        <p class="text-gray-700 dark:text-gray-300 mb-2">
                            E-Mails (Magic Links, Kontaktformular) werden über <strong>Brevo</strong> versendet (Sendinblue SAS, Paris, Frankreich).
                        </p>
                        <ul class="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                            <li>E-Mail-Adressen für Versand</li>
                            <li>Versandstatistiken</li>
                            <li>Datenschutzerklärung: <a href="https://www.brevo.com/legal/privacypolicy/" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">brevo.com/legal/privacypolicy</a></li>
                        </ul>
                    </div>

                    <!-- AI Providers (User's own keys) -->
                    <div class="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 p-6 rounded-lg">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            4.5 AI Provider (Story Mode - Ihre eigenen API Keys)
                        </h3>
                        <p class="text-gray-700 dark:text-gray-300 mb-2">
                            Wenn Sie Story Mode nutzen, werden Ihre Texte an den von Ihnen gewählten AI Provider gesendet:
                        </p>
                        <ul class="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                            <li><strong>OpenAI:</strong> <a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">openai.com/policies/privacy-policy</a></li>
                            <li><strong>Google Gemini:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">policies.google.com/privacy</a></li>
                            <li><strong>Mistral AI:</strong> <a href="https://mistral.ai/terms/" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">mistral.ai/terms</a></li>
                        </ul>
                        <p class="text-sm text-yellow-800 dark:text-yellow-300 mt-3">
                            ⚠️ Sie verwenden Ihre eigenen API Keys. Bitte prüfen Sie die Datenschutzbestimmungen Ihres gewählten Providers.
                        </p>
                    </div>
                </div>
            </section>

            <!-- 5. Cookies & Lokale Speicherung -->
            <section class="mb-12">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {$translations?.privacy?.sections?.cookies?.title || '5. Cookies & Lokale Speicherung'}
                </h2>
                <p class="text-gray-700 dark:text-gray-300 mb-4">
                    Wir verwenden <strong>keine Tracking-Cookies</strong>. Folgende lokale Speicherungen werden genutzt:
                </p>
                <ul class="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                    <li><strong>localStorage:</strong> Einstellungen, Sprache, Theme, Session-Daten</li>
                    <li><strong>Service Worker Cache:</strong> Offline-Funktionalität (PWA)</li>
                    <li><strong>Cookies:</strong> Session-Management (Magic Link Login)</li>
                </ul>
                <p class="text-gray-700 dark:text-gray-300 mt-4">
                    Sie können diese jederzeit in den Browser-Einstellungen löschen.
                </p>
            </section>

            <!-- 6. Ihre Rechte -->
            <section class="mb-12">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {$translations?.privacy?.sections?.rights?.title || '6. Ihre Rechte (DSGVO)'}
                </h2>
                <p class="text-gray-700 dark:text-gray-300 mb-4">
                    Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:
                </p>
                <ul class="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                    <li><strong>Auskunftsrecht (Art. 15 DSGVO):</strong> Sie können Auskunft über Ihre gespeicherten Daten verlangen</li>
                    <li><strong>Berichtigungsrecht (Art. 16 DSGVO):</strong> Sie können die Korrektur falscher Daten verlangen</li>
                    <li><strong>Löschungsrecht (Art. 17 DSGVO):</strong> Sie können die Löschung Ihrer Daten verlangen</li>
                    <li><strong>Einschränkung der Verarbeitung (Art. 18 DSGVO)</strong></li>
                    <li><strong>Datenübertragbarkeit (Art. 20 DSGVO):</strong> Sie können Ihre Daten in einem strukturierten Format erhalten</li>
                    <li><strong>Widerspruchsrecht (Art. 21 DSGVO):</strong> Sie können der Verarbeitung widersprechen</li>
                    <li><strong>Beschwerderecht:</strong> Sie können sich an eine Datenschutzbehörde wenden</li>
                </ul>
                <p class="text-gray-700 dark:text-gray-300 mt-4">
                    Für Anfragen kontaktieren Sie uns unter: <a href="mailto:hello@keymoji.wtf" class="text-blue-600 dark:text-blue-400 hover:underline">hello@keymoji.wtf</a>
                </p>
            </section>

            <!-- 7. Datensicherheit -->
            <section class="mb-12">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {$translations?.privacy?.sections?.security?.title || '7. Datensicherheit'}
                </h2>
                <p class="text-gray-700 dark:text-gray-300 mb-4">
                    Wir setzen technische und organisatorische Sicherheitsmaßnahmen ein:
                </p>
                <ul class="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                    <li><strong>HTTPS/SSL:</strong> Alle Datenübertragungen sind verschlüsselt</li>
                    <li><strong>API Key Encryption:</strong> API Keys werden verschlüsselt gespeichert</li>
                    <li><strong>Zero-Knowledge:</strong> Wir sehen Ihre Passwörter nie</li>
                    <li><strong>Minimal Data Collection:</strong> Wir sammeln nur notwendige Daten</li>
                    <li><strong>Regular Security Audits</strong></li>
                </ul>
            </section>

            <!-- 8. Datenspeicherung & Löschung -->
            <section class="mb-12">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {$translations?.privacy?.sections?.retention?.title || '8. Datenspeicherung & Löschung'}
                </h2>
                <ul class="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                    <li><strong>Kontodaten:</strong> Bis zur Löschung des Kontos durch Sie</li>
                    <li><strong>Nutzungsstatistiken:</strong> 365 Tage (für Charts)</li>
                    <li><strong>Story Mode Cache:</strong> 7 Tage lokal im Browser</li>
                    <li><strong>Server-Logs:</strong> Maximal 30 Tage (Vercel)</li>
                    <li><strong>E-Mail-Logs:</strong> Maximal 90 Tage (Brevo)</li>
                </ul>
            </section>

            <!-- 9. Änderungen -->
            <section class="mb-12">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {$translations?.privacy?.sections?.changes?.title || '9. Änderungen dieser Datenschutzerklärung'}
                </h2>
                <p class="text-gray-700 dark:text-gray-300 mb-4">
                    Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie an geänderte Rechtslage oder Änderungen unserer Dienste anzupassen.
                </p>
                <p class="text-gray-700 dark:text-gray-300 mb-4">
                    <strong>Aktualisierungen werden auf dieser Seite mit neuem Datum veröffentlicht.</strong>
                </p>
            </section>

            <!-- 10. Kontakt -->
            <section class="mb-12">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {$translations?.privacy?.sections?.contact?.title || '10. Kontakt'}
                </h2>
                <div class="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 p-6 rounded-lg">
                    <p class="text-gray-700 dark:text-gray-300 mb-2">
                        Bei Fragen zum Datenschutz kontaktieren Sie uns:
                    </p>
                    <p class="text-gray-700 dark:text-gray-300">
                        <strong>Email:</strong> <a href="mailto:hello@keymoji.wtf" class="text-blue-600 dark:text-blue-400 hover:underline">hello@keymoji.wtf</a><br>
                        <strong>Website:</strong> <a href="https://keymoji.wtf" class="text-blue-600 dark:text-blue-400 hover:underline">keymoji.wtf</a>
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
                {$translations?.privacy?.backToTop || 'Nach oben'}
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

