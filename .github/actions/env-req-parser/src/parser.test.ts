import * as core from '@actions/core'
import * as github from '@actions/github'
import exp from 'constants';

import {
    parseAppName,
    parseBusinessJustification,
    parseApps,
    templateForInstaller
} from './parser';

describe('when parsing the body of an issue', () => {

    const body = `### Application Information
    Application Name: Some application
    Business Justification: Some reason
    that goes over some lines
    
    ### Technical Information
    **Check applications to be installed**
    - [x] test-key-1
    - [x] test-key-2
    `;

    it('should extract the application name', async () => {
        const appName = parseAppName(body);
        expect(appName).toBe("Some application");
    });

    it('should extract the business justification', async () => {
        const businessJustification = parseBusinessJustification(body);
        expect(businessJustification).toBe("Some reason\n    that goes over some lines");
    });

    it('should extract the first environment type', async () => {
        const appName = parseApps(body);
        expect(appName).toBe("test-key-1");
    });
//})

// describe('when selecting a template', () => {
//     it('should understand a web app', () => {
//         expect(templateForEnvironment('test-key-1', './templates.json')).toBe('test-value-1');
//     })
//     it('should understand AKS', () => {
//         expect(templateForEnvironment('test-key-2', './templates.json')).toBe('test-value-2');
//     })
//     it('should use a sensible default when nothing is recognised', () => {
//         expect(templateForEnvironment('jaskdlfjsaklfjsakldfj', './templates.json')).toBe('default');
//     })
});