export interface FlagNestClientOptions {
    baseUrl: string;
    token: string;
}

export interface FlagNestClient {
    isEnabled: (flagKey: string, userId: string) => Promise<boolean>;
}