import * as github from '@actions/github';
import * as core from '@actions/core';
import type { IssuesLabeledEvent } from '@octokit/webhooks-types';
import { parseApps, templateForInstaller } from './parser';

async function run(): Promise<void> {
    try {
        console.log('Action starting...');

        const payload = github.context.payload as IssuesLabeledEvent;
        console.log(payload);

        const approved = ((payload.label?.name || "none") === "approved");
        const ready = ((payload.label?.name || "none") === "ready");

        if (!approved && !ready) {
            core.setOutput('approved', 'false')
            core.setOutput('ready', 'false')
            return
        }

        const issueBody = payload.issue.body ?? "";
        console.log("Issue Body\r\n" + issueBody);

        const selectedApps = parseApps(issueBody);
        console.log("Selected Apps\r\n" + selectedApps);

        const template = templateForInstaller(selectedApps);
        console.log("Template\r\n" + template);   

        core.setOutput('template', template);
        core.setOutput('approved', approved ? 'true' : 'false');
        core.setOutput('ready', ready ? 'true' : 'false');

    } catch (error) {
        core.setFailed(error.message);
    }
}

run();