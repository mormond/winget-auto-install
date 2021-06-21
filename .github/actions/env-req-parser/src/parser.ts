import fs from 'fs';

export const parseAppName = (body: string) => {
    const result = /Application Name: (.+)/.exec(body);
    if (result && result.length > 1) {
        return result[1].trim();
    }
    throw new Error("Could not parse application name");
};

export const parseBusinessJustification = (body: string) => {
    const result = body.match(/Business Justification: ([\s\S]+?)###/) ?? [];
    if (result.length > 1) {
        return result[1].trim();
    }
    throw new Error("Could not parse application name");
};

const selectedLines: (body: string) => string[] = (body: string) => {
    const matches = body.match(/- \[[^ ]\] ([^\n]+)/g) ?? [];
    return matches.map(line => /\] (.+)/.exec(line)![1]);
}

export const parseEnvironmentType = (body: string) => {
    const lines = selectedLines(body);
    if (lines.length > 0) {
        return lines[0];
    }
    throw new Error("Could not parse environment type");
};

export const templateForEnvironment: (env: string, mappingFile: string | undefined) => string = (environment: string, mappingFile: string | undefined) => {
    const data = fs.readFileSync(mappingFile ?? './templates.json', 'utf8');
    const lookup: Record<string, string> = JSON.parse(data);
    return lookup[environment] ?? "default";
}