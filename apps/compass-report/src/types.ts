export interface dataEntry<T = string | number | boolean | dataEntry<any>> {
    [key: string]: T;
}