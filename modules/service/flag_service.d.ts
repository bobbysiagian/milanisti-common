export declare class FlagService {
    private static flags;
    static initialize(): Promise<void>;
    static set(key: string, isOn?: boolean): void;
    static isOn(key: string): boolean;
    isOn(key: string): boolean;
}
export default FlagService;
//# sourceMappingURL=flag_service.d.ts.map