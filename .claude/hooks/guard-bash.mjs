#!/usr/bin/env node
// Blocks destructive shell actions that permission rules cannot reliably catch,
// especially write commands sent over SSH to the live All-Inkl server.

import { readFileSync } from 'node:fs';

let payload;
try {
    payload = JSON.parse(readFileSync(0, 'utf8'));
} catch {
    process.exit(0);
}

if (payload.tool_name !== 'Bash') {
    process.exit(0);
}

const command = payload.tool_input?.command ?? '';
const normalized = command.replace(/\s+/g, ' ').trim();

function block(reason) {
    process.stderr.write(
        `Blocked by guard-bash.mjs: ${reason}. Ask the user for explicit approval or run the command manually.\n`
    );
    process.exit(2);
}

const destructive = [
    [
        /(^|[;&|]\s*)rm\s+(-[A-Za-z]*[rR][A-Za-z]*[fF]?|-[A-Za-z]*[fF][A-Za-z]*[rR])/,
        'recursive force delete'
    ],
    [/(^|[;&|]\s*)sudo\s+rm\b/, 'sudo rm'],
    [
        /git\s+push\b[^\n]*(--force\b|--force-with-lease\b|\s-f\b)/,
        'force push'
    ],
    [/git\s+reset\s+--hard\b/, 'hard reset'],
    [/git\s+clean\s+-[A-Za-z]*f/, 'git clean force']
];

for (const [pattern, reason] of destructive) {
    if (pattern.test(normalized)) {
        block(reason);
    }
}

const transferMatch = normalized.match(
    /(?:^|[;&|]\s*)(ssh|scp|sftp|rsync)\b([^\n]*)/
);

if (transferMatch) {
    const rest = normalized.slice(transferMatch.index);
    const touchesLiveServer = /\bkmoji\b/.test(rest);

    if (touchesLiveServer) {
        const writeVerbs =
            /\b(rm|rmdir|mv|cp|chmod|chown|chgrp|touch|mkdir|ln|unlink|truncate|dd|install|tee|sed\s+-i|perl\s+-i|crontab|systemctl|service|reboot|shutdown|kill|pkill|killall|sudo)\b/;

        if (writeVerbs.test(rest)) {
            block('write command over ssh to kmoji');
        }

        if (/>{1,2}\s*(?!\/dev\/null)\S/.test(rest)) {
            block('output redirection over ssh to kmoji');
        }

        if (
            /^\s*(scp|sftp|rsync)\b/.test(rest) &&
            !/--dry-run\b/.test(rest)
        ) {
            block('file transfer with kmoji');
        }
    }
}

process.exit(0);
