import fs from 'fs';

const apps = new Map<string, string>([
    ['App Installer', '9NBLGGH4NNS1'],
    ['Windows Terminal', '9N0DX20HK701'],
    ['PowerShell', '9MZ1SNWT0N5D'],
    ['PowerToys (Preview)', 'Microsoft.PowerToys'],
    ['Visual Studio Code', 'XP9KHM4BK9FZ7Q'],
    ['Power BI Desktop', '9NTXR16HNW1T'],
    ['EarTrumpet', '9NBLGGH516XP'],
    ['Netflix', '9WZDNCRFJ3TJ'],
    ['MusicBee', '9P4CLT2RJ1RS'],
    ['ShareX', '9NBLGGH4Z1SP'],
    ['Ditto Clipboard', '9NBLGGH3ZBJQ'],
    ['PureText', '9PKJV6319QTL'],
    ['Ubuntu', '9NBLGGH4MSV6'],
    ['Sysinternals Suite', '9P7KNL5RWT25'],
    ['Microsoft Whiteboard', '9MSPC6MP8FM4'],
    ['Microsoft To Do: Lists, Tasks & Reminders', '9NBLGGH5R558'],
    ['7-Zip', '7zip.7zip'],
    ['Microsoft 365 Apps for enterprise', 'Microsoft.Office'],
    ['Microsoft Teams', 'Microsoft.Teams'],
    ['OneNote for Windows 10', '9WZDNCRFHVJL']
]);

const selectedLines: (body: string) => string[] = (body: string) => {
    const matches = body.match(/- \[[^ ]\] ([^\n]+)/g) ?? [];
    return matches.map(line => /\] (.+)/.exec(line)![1]);
}

export const parseApps = (body: string) => {
    const lines = selectedLines(body);
    if (lines.length > 0) {
        return lines;
    }
    throw new Error("Could not parse app selection");
};

export const templateForInstaller = (selectedApps: string[]) => {

    var temp:string = '';

    selectedApps.forEach(selectedApp => {
        temp += '\n  @{id = "' + apps.get(selectedApp) + '"; name = "' + selectedApp + '" },';
    });

    const appString: string = temp.slice(0, -1);

    const startString:string = 
        '\nWrite-Host "Installing Apps"\n' + 
        '$apps_to_install = @(\n';

    const endString:string = 
        '\n)\n' + 
        'Foreach ($app in $apps_to_install) {\n' +
        '  $listApp = winget list --exact -q $app.id\n' +        
        '  if (!($listApp -join "").Contains($app.name)) {\n' +
        '    Write-Host\n' + 
        '    Write-Host "Installing:" $app.name\n' +
        '    winget install --exact --silent --accept-package-agreements $app.id\n' +
        '  }\n' +
        '  else {\n' +
        '    Write-Host "Skipping Install of" $app.name\n' +
        '  }\n' +
        '}\n';     

    return '```' + startString + appString + endString + '```';

}