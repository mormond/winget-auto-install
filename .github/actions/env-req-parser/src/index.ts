import * as github from '@actions/github';
import * as core from '@actions/core';
import type { IssuesLabeledEvent } from "@octokit/webhooks-types";
import { parseAppName, parseEnvironmentType, templateForEnvironment } from './parser';

async function run(): Promise<void> {
    try {
        const payload = github.context.payload as IssuesLabeledEvent;

        const approved = ((payload.label?.name || "none") === "approved");
        const ready = ((payload.label?.name || "none") === "ready");

        if (!approved && !ready) {
            core.setOutput('approved', 'false')
            core.setOutput('ready', 'false')
            return
        }

        const issueBody = payload.issue.body ?? "";
        const environmentType = parseEnvironmentType(issueBody);
        const templatePath = core.getInput('templatePath');
        const template = templateForEnvironment(environmentType, templatePath);

        core.setOutput('appName', parseAppName(issueBody));
        core.setOutput('template', template)
        core.setOutput('approved', approved ? 'true' : 'false');
        core.setOutput('ready', ready ? 'true' : 'false');
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();