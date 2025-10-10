// src/data/staticPages.js
// Static page content for Privacy Policy and Legal Notice
// Supports DE (default) and EN (fallback)

export const privacyContent = {
    de: {
        title: 'Datenschutzerklärung',
        description:
            'Informationen zum Datenschutz und zur Verarbeitung personenbezogener Daten',
        lastUpdated: '2025-10-10',
        content: `
            <section class="mb-12">
                <h2>1. Einleitung</h2>
                <p>Der Schutz Ihrer Privatsphäre ist uns sehr wichtig. Diese Datenschutzerklärung informiert Sie über die Art, den Umfang und Zweck der Verarbeitung personenbezogener Daten auf unserer Website <strong>keymoji.wtf</strong>.</p>
                <p>Wir verarbeiten Ihre Daten ausschließlich auf Grundlage der gesetzlichen Bestimmungen (DSGVO, revDSGV, TKG 2003).</p>
            </section>

            <section class="mb-12">
                <h2>2. Verantwortlicher</h2>
                <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                    <p><strong>Christopher Matt</strong><br>
                    Chooomedia<br>
                    Email: <a href="mailto:hello@keymoji.wtf">hello@keymoji.wtf</a><br>
                    Website: <a href="https://keymoji.wtf">keymoji.wtf</a></p>
                </div>
            </section>

            <section class="mb-12">
                <h2>3. Datenverarbeitung</h2>
                
                <h3>3.1 Client-Side Verarbeitung (Privacy-First)</h3>
                <p><strong>Keymoji ist primär eine Client-Side Anwendung.</strong> Das bedeutet:</p>
                <ul>
                    <li>Alle Passwort- und Emoji-Generierungen erfolgen <strong>lokal in Ihrem Browser</strong></li>
                    <li>Wir sehen Ihre generierten Passwörter <strong>niemals</strong> (Zero-Knowledge)</li>
                    <li>Keine Übertragung von Passwörtern an unsere Server</li>
                    <li>Keine Speicherung von Passwörtern in unserer Datenbank</li>
                </ul>

                <h3>3.2 Kontoerstellung (optional)</h3>
                <p>Wenn Sie ein Konto erstellen, verarbeiten wir:</p>
                <ul>
                    <li><strong>E-Mail-Adresse:</strong> Für Magic Link Login</li>
                    <li><strong>Name (optional):</strong> Zur Personalisierung</li>
                    <li><strong>Nutzungsstatistiken:</strong> Anzahl täglicher Generierungen</li>
                    <li><strong>Einstellungen:</strong> Sprache, Theme, Präferenzen</li>
                </ul>
                <p><strong>Rechtsgrundlage:</strong> Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO)</p>

                <h3>3.3 Story Mode & AI Integration</h3>
                <p>Wenn Sie den <strong>Story Mode</strong> nutzen:</p>
                <ul>
                    <li><strong>API Keys:</strong> Werden verschlüsselt gespeichert</li>
                    <li><strong>AI Provider:</strong> OpenAI, Google Gemini, Mistral, oder Custom</li>
                    <li><strong>Story-Texte:</strong> Werden an gewählten AI Provider übermittelt</li>
                    <li><strong>Generierte Emojis:</strong> Werden lokal gecacht (7 Tage)</li>
                </ul>
                <p><strong>Wichtig:</strong> Sie nutzen Ihren eigenen API Key. Bitte beachten Sie die Datenschutzerklärungen der AI Provider.</p>
                <p><strong>Rechtsgrundlage:</strong> Einwilligung (Art. 6 Abs. 1 lit. a DSGVO)</p>
            </section>

            <section class="mb-12">
                <h2>4. Externe Dienste & APIs</h2>
                
                <div class="space-y-6">
                    <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                        <h3>4.1 Vercel (Hosting)</h3>
                        <p>Website-Hosting (Vercel Inc., USA)</p>
                        <p><a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">vercel.com/legal/privacy-policy</a></p>
                    </div>

                    <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                        <h3>4.2 Google Sheets (Datenbank)</h3>
                        <p>Kontodaten werden in Google Sheets gespeichert</p>
                        <p><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a></p>
                    </div>

                    <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                        <h3>4.3 Brevo (E-Mail-Versand)</h3>
                        <p>Magic Links und Benachrichtigungen</p>
                        <p><a href="https://www.brevo.com/legal/privacypolicy/" target="_blank" rel="noopener noreferrer">brevo.com/legal/privacypolicy</a></p>
                    </div>

                    <div class="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 p-6 rounded-lg">
                        <h3>4.4 AI Provider (Ihre eigenen API Keys)</h3>
                        <p>Bei Nutzung von Story Mode:</p>
                        <ul>
                            <li><strong>OpenAI:</strong> <a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer">openai.com/policies/privacy-policy</a></li>
                            <li><strong>Google Gemini:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a></li>
                            <li><strong>Mistral AI:</strong> <a href="https://mistral.ai/terms/" target="_blank" rel="noopener noreferrer">mistral.ai/terms</a></li>
                        </ul>
                        <p class="text-sm text-yellow-800 dark:text-yellow-300 mt-3">⚠️ Sie verwenden Ihre eigenen API Keys. Bitte prüfen Sie die Datenschutzbestimmungen Ihres Providers.</p>
                    </div>
                </div>
            </section>

            <section class="mb-12">
                <h2>5. Cookies & Lokale Speicherung</h2>
                <p>Wir verwenden <strong>keine Tracking-Cookies</strong>. Folgende lokale Speicherungen:</p>
                <ul>
                    <li><strong>localStorage:</strong> Einstellungen, Sprache, Theme</li>
                    <li><strong>Service Worker Cache:</strong> Offline-Funktionalität (PWA)</li>
                    <li><strong>Cookies:</strong> Session-Management (Magic Link Login)</li>
                </ul>
            </section>

            <section class="mb-12">
                <h2>6. Ihre Rechte (DSGVO)</h2>
                <ul>
                    <li><strong>Auskunftsrecht (Art. 15 DSGVO)</strong></li>
                    <li><strong>Berichtigungsrecht (Art. 16 DSGVO)</strong></li>
                    <li><strong>Löschungsrecht (Art. 17 DSGVO)</strong></li>
                    <li><strong>Einschränkung der Verarbeitung (Art. 18 DSGVO)</strong></li>
                    <li><strong>Datenübertragbarkeit (Art. 20 DSGVO)</strong></li>
                    <li><strong>Widerspruchsrecht (Art. 21 DSGVO)</strong></li>
                </ul>
                <p class="mt-4">Kontakt: <a href="mailto:hello@keymoji.wtf">hello@keymoji.wtf</a></p>
            </section>

            <section class="mb-12">
                <h2>7. Datensicherheit</h2>
                <ul>
                    <li><strong>HTTPS/SSL:</strong> Verschlüsselte Datenübertragung</li>
                    <li><strong>API Key Encryption:</strong> Verschlüsselte Speicherung</li>
                    <li><strong>Zero-Knowledge:</strong> Wir sehen Ihre Passwörter nie</li>
                    <li><strong>Minimal Data Collection:</strong> Nur notwendige Daten</li>
                </ul>
            </section>

            <section class="mb-12">
                <h2>8. Kontakt</h2>
                <div class="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 p-6 rounded-lg">
                    <p><strong>Email:</strong> <a href="mailto:hello@keymoji.wtf">hello@keymoji.wtf</a><br>
                    <strong>Website:</strong> <a href="https://keymoji.wtf">keymoji.wtf</a></p>
                </div>
            </section>
        `
    },
    en: {
        title: 'Privacy Policy',
        description:
            'Information about data protection and processing of personal data',
        lastUpdated: '2025-10-10',
        content: `
            <section class="mb-12">
                <h2>1. Introduction</h2>
                <p>Protecting your privacy is very important to us. This privacy policy informs you about the nature, scope and purpose of processing personal data on our website <strong>keymoji.wtf</strong>.</p>
                <p>We process your data exclusively on the basis of legal regulations (GDPR, revDSGV, TKG 2003).</p>
            </section>

            <section class="mb-12">
                <h2>2. Responsible Party</h2>
                <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                    <p><strong>Christopher Matt</strong><br>
                    Chooomedia<br>
                    Email: <a href="mailto:hello@keymoji.wtf">hello@keymoji.wtf</a><br>
                    Website: <a href="https://keymoji.wtf">keymoji.wtf</a></p>
                </div>
            </section>

            <section class="mb-12">
                <h2>3. Data Processing</h2>
                
                <h3>3.1 Client-Side Processing (Privacy-First)</h3>
                <p><strong>Keymoji is primarily a client-side application.</strong> This means:</p>
                <ul>
                    <li>All password and emoji generations happen <strong>locally in your browser</strong></li>
                    <li>We <strong>never</strong> see your generated passwords (Zero-Knowledge)</li>
                    <li>No transmission of passwords to our servers</li>
                    <li>No storage of passwords in our database</li>
                </ul>

                <h3>3.2 Account Creation (optional)</h3>
                <p>When you create an account, we process:</p>
                <ul>
                    <li><strong>Email address:</strong> For Magic Link login</li>
                    <li><strong>Name (optional):</strong> For personalization</li>
                    <li><strong>Usage statistics:</strong> Number of daily generations</li>
                    <li><strong>Settings:</strong> Language, theme, preferences</li>
                </ul>
                <p><strong>Legal basis:</strong> Contract fulfillment (Art. 6 para. 1 lit. b GDPR)</p>

                <h3>3.3 Story Mode & AI Integration</h3>
                <p>When you use <strong>Story Mode</strong>:</p>
                <ul>
                    <li><strong>API Keys:</strong> Stored encrypted</li>
                    <li><strong>AI Provider:</strong> OpenAI, Google Gemini, Mistral, or Custom</li>
                    <li><strong>Story texts:</strong> Transmitted to selected AI provider</li>
                    <li><strong>Generated emojis:</strong> Cached locally (7 days)</li>
                </ul>
                <p><strong>Important:</strong> You use your own API key. Please review the privacy policies of your AI provider.</p>
                <p><strong>Legal basis:</strong> Consent (Art. 6 para. 1 lit. a GDPR)</p>
            </section>

            <section class="mb-12">
                <h2>4. External Services & APIs</h2>
                
                <div class="space-y-6">
                    <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                        <h3>4.1 Vercel (Hosting)</h3>
                        <p>Website hosting (Vercel Inc., USA)</p>
                        <p><a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">vercel.com/legal/privacy-policy</a></p>
                    </div>

                    <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                        <h3>4.2 Google Sheets (Database)</h3>
                        <p>Account data stored in Google Sheets</p>
                        <p><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a></p>
                    </div>

                    <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                        <h3>4.3 Brevo (Email Service)</h3>
                        <p>Magic links and notifications</p>
                        <p><a href="https://www.brevo.com/legal/privacypolicy/" target="_blank" rel="noopener noreferrer">brevo.com/legal/privacypolicy</a></p>
                    </div>

                    <div class="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 p-6 rounded-lg">
                        <h3>4.4 AI Providers (Your own API Keys)</h3>
                        <p>When using Story Mode:</p>
                        <ul>
                            <li><strong>OpenAI:</strong> <a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer">openai.com/policies/privacy-policy</a></li>
                            <li><strong>Google Gemini:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a></li>
                            <li><strong>Mistral AI:</strong> <a href="https://mistral.ai/terms/" target="_blank" rel="noopener noreferrer">mistral.ai/terms</a></li>
                        </ul>
                        <p class="text-sm text-yellow-800 dark:text-yellow-300 mt-3">⚠️ You use your own API keys. Please review your provider's privacy policies.</p>
                    </div>
                </div>
            </section>

            <section class="mb-12">
                <h2>5. Your Rights (GDPR)</h2>
                <ul>
                    <li><strong>Right to access (Art. 15 GDPR)</strong></li>
                    <li><strong>Right to rectification (Art. 16 GDPR)</strong></li>
                    <li><strong>Right to erasure (Art. 17 GDPR)</strong></li>
                    <li><strong>Right to restriction (Art. 18 GDPR)</strong></li>
                    <li><strong>Right to data portability (Art. 20 GDPR)</strong></li>
                    <li><strong>Right to object (Art. 21 GDPR)</strong></li>
                </ul>
                <p class="mt-4">Contact: <a href="mailto:hello@keymoji.wtf">hello@keymoji.wtf</a></p>
            </section>

            <section class="mb-12">
                <h2>6. Contact</h2>
                <div class="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 p-6 rounded-lg">
                    <p><strong>Email:</strong> <a href="mailto:hello@keymoji.wtf">hello@keymoji.wtf</a><br>
                    <strong>Website:</strong> <a href="https://keymoji.wtf">keymoji.wtf</a></p>
                </div>
            </section>
        `
    }
};

export const legalContent = {
    de: {
        title: 'Impressum',
        description: 'Angaben gemäß § 5 TMG / § 25 MedienG',
        lastUpdated: '2025-10-10',
        content: `
            <section class="mb-12">
                <h2>1. Dienstanbieter</h2>
                <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                    <p><strong>Christopher Matt</strong><br>
                    Chooomedia<br><br>
                    <strong>Email:</strong> <a href="mailto:hello@keymoji.wtf">hello@keymoji.wtf</a><br>
                    <strong>Website:</strong> <a href="https://keymoji.wtf">keymoji.wtf</a></p>
                </div>
            </section>

            <section class="mb-12">
                <h2>2. Kontakt</h2>
                <ul class="list-none">
                    <li>📧 <strong>Email:</strong> <a href="mailto:hello@keymoji.wtf">hello@keymoji.wtf</a></li>
                    <li>🌐 <strong>Website:</strong> <a href="https://keymoji.wtf">keymoji.wtf</a></li>
                    <li>🐛 <strong>GitHub:</strong> <a href="https://github.com/chooomedia/keymoji/issues" target="_blank" rel="noopener noreferrer">github.com/chooomedia/keymoji/issues</a></li>
                </ul>
            </section>

            <section class="mb-12">
                <h2>3. Haftungsausschluss</h2>
                
                <h3>3.1 Haftung für Inhalte</h3>
                <p>Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.</p>

                <h3>3.2 Haftung für Passwort-Sicherheit</h3>
                <div class="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 p-6 rounded-lg">
                    <p><strong>Wichtig:</strong> Keymoji ist ein Passwort-Generator Tool. Wir übernehmen keine Haftung für Schäden, die durch unsachgemäße Verwendung generierter Passwörter entstehen.</p>
                </div>

                <h3>3.3 Haftung für AI-Generierung (Story Mode)</h3>
                <div class="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 p-6 rounded-lg">
                    <p>Bei Nutzung des Story Modes:</p>
                    <ul>
                        <li>Sie verwenden Ihre eigenen API Keys</li>
                        <li>Wir haben keine Kontrolle über AI-generierte Inhalte</li>
                        <li>Sie sind für die Einhaltung der Provider-Nutzungsbedingungen verantwortlich</li>
                        <li>Kosten für AI API Calls gehen zu Ihren Lasten</li>
                    </ul>
                </div>
            </section>

            <section class="mb-12">
                <h2>4. Urheberrecht</h2>
                <p>Die Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht.</p>
                <div class="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 p-6 rounded-lg mt-4">
                    <p><strong>Open Source:</strong> Keymoji ist Open Source Software unter MIT Lizenz.</p>
                    <p>Source Code: <a href="https://github.com/chooomedia/keymoji" target="_blank" rel="noopener noreferrer">github.com/chooomedia/keymoji</a></p>
                </div>
            </section>

            <section class="mb-12">
                <h2>5. Streitbeilegung</h2>
                <p>Online-Streitbeilegung (OS): <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">ec.europa.eu/consumers/odr</a></p>
                <p>Wir sind nicht bereit an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
            </section>

            <section class="mb-12">
                <h2>6. Technical Credits</h2>
                <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                    <p><strong>Frontend:</strong> Svelte, Tailwind CSS, Webpack<br>
                    <strong>Backend:</strong> Vercel Serverless, n8n Automation<br>
                    <strong>Database:</strong> Google Sheets<br>
                    <strong>Email:</strong> Brevo<br>
                    <strong>AI:</strong> OpenAI, Google Gemini, Mistral AI<br>
                    <strong>Hosting:</strong> Vercel</p>
                </div>
            </section>
        `
    },
    en: {
        title: 'Legal Notice',
        description: 'Legal information according to § 5 TMG / § 25 MedienG',
        lastUpdated: '2025-10-10',
        content: `
            <section class="mb-12">
                <h2>1. Service Provider</h2>
                <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                    <p><strong>Christopher Matt</strong><br>
                    Chooomedia<br><br>
                    <strong>Email:</strong> <a href="mailto:hello@keymoji.wtf">hello@keymoji.wtf</a><br>
                    <strong>Website:</strong> <a href="https://keymoji.wtf">keymoji.wtf</a></p>
                </div>
            </section>

            <section class="mb-12">
                <h2>2. Contact</h2>
                <ul class="list-none">
                    <li>📧 <strong>Email:</strong> <a href="mailto:hello@keymoji.wtf">hello@keymoji.wtf</a></li>
                    <li>🌐 <strong>Website:</strong> <a href="https://keymoji.wtf">keymoji.wtf</a></li>
                    <li>🐛 <strong>GitHub:</strong> <a href="https://github.com/chooomedia/keymoji/issues" target="_blank" rel="noopener noreferrer">github.com/chooomedia/keymoji/issues</a></li>
                </ul>
            </section>

            <section class="mb-12">
                <h2>3. Disclaimer</h2>
                
                <h3>3.1 Liability for Content</h3>
                <p>As a service provider, we are responsible for our own content on these pages according to general laws.</p>

                <h3>3.2 Password Security Liability</h3>
                <div class="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 p-6 rounded-lg">
                    <p><strong>Important:</strong> Keymoji is a password generator tool. We assume no liability for damages resulting from improper use of generated passwords.</p>
                </div>

                <h3>3.3 AI Generation Liability (Story Mode)</h3>
                <div class="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 p-6 rounded-lg">
                    <p>When using Story Mode:</p>
                    <ul>
                        <li>You use your own API keys</li>
                        <li>We have no control over AI-generated content</li>
                        <li>You are responsible for compliance with provider terms</li>
                        <li>AI API costs are your responsibility</li>
                    </ul>
                </div>
            </section>

            <section class="mb-12">
                <h2>4. Copyright</h2>
                <p>The content and works on these pages are subject to German copyright law.</p>
                <div class="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 p-6 rounded-lg mt-4">
                    <p><strong>Open Source:</strong> Keymoji is open source software under MIT License.</p>
                    <p>Source Code: <a href="https://github.com/chooomedia/keymoji" target="_blank" rel="noopener noreferrer">github.com/chooomedia/keymoji</a></p>
                </div>
            </section>

            <section class="mb-12">
                <h2>5. Technical Credits</h2>
                <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                    <p><strong>Frontend:</strong> Svelte, Tailwind CSS, Webpack<br>
                    <strong>Backend:</strong> Vercel Serverless, n8n Automation<br>
                    <strong>Database:</strong> Google Sheets<br>
                    <strong>Email:</strong> Brevo<br>
                    <strong>AI:</strong> OpenAI, Google Gemini, Mistral AI<br>
                    <strong>Hosting:</strong> Vercel</p>
                </div>
            </section>
        `
    }
};
