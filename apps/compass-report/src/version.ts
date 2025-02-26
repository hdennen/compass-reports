import changelog from '../CHANGELOG.md?raw';

function getLatestVersion(): string {
    const versionMatch = changelog.match(/^## \[([\d.]+)\]/m);
    return versionMatch ? versionMatch[1] : '1.0.0'; // fallback to 1.0.0 if no version found
}

export const version = getLatestVersion(); 