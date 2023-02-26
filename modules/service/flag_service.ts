
const thruthyMap: Record<string, boolean> = {
    '1': true,
    'true': true,
    'on': true
};

export class FlagService {
    private static flags: Record<string, boolean> = {};

    public static async initialize(): Promise<void> {
        // TODO: get feature flag data from System Parameter and replicate it on flags
    }

    public static set(key: string, isOn = true): void {
        FlagService.flags[key] = isOn;
    }

    public static isOn(key: string): boolean {
        if (key in FlagService.flags) {
            return FlagService.flags[key];
        }
        const env = process.env[key];
        return env !== undefined && thruthyMap[env.toLocaleLowerCase()] || false;
    }

    public isOn(key: string): boolean {
        return FlagService.isOn(key);
    }

}

export default FlagService;
