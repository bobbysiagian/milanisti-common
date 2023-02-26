declare module '*.json' {
    const value: any;
    export default value;
}

declare function require(name: string): any;

export interface Context extends JWTAuthClaims {
    request_id: string;
}

export interface JWTAuthClaims {
    user_id: number;
    email: string;
    fullname: string;
    role_id: number;
}

export interface IObject<D = any> {
    [s: string]: D;
}

export interface PaginationMeta {
    page: number;
    per_page: number;
    total_page: number;
    total_data: number;
}

export interface Page<T> {
    data: T[];
    meta: PaginationMeta;
}

export interface RequestData<Query = any, Params = any, Body = any, Files = any, Headers = any> {
    query: Query;
    params: Params;
    body: Body;
    files?: Files;
    headers: Headers;
}

export type RawResponseData = string | Buffer | Uint8Array;

export interface FileData {
    buffer: Buffer;
    options?: {
        mimeType: string;
        fileName: string;
        size: number;
    }
}

export interface ResponseData {
    data?: any;
    message?: string;
    code?: number;
    pagination?: PaginationMeta;
    file?: FileData;
    html?: string;
}

export type HandlerMethod<HandlerOutput extends ResponseData = any> = (data: RequestData, context: Context) => Promise<HandlerOutput>;

export type MakeAny<T> = {
    [P in keyof T]?: any;
};

export type BasicType<T> = {
    [P in keyof T]?: P extends string | number | boolean ? T[P] : never;
};

export type OptionalRelation = IObject[] | undefined;

export type Attributes = string[];

export interface QueryOptions {
    page?: number;
    per_page?: number;
    sort?: string;
    attributes?: Attributes;
    cache?: boolean;
}

export interface BaseProps {
    id: number;
    created_at: string | null;
    updated_at: string | null;
    deleted_at?: string | null;
}

export interface GenericStaticClass<ClassInstance> {
    new(...params: any): ClassInstance
}

export type ModelProperties<ModelClass extends GenericStaticClass<ModelClass>> = ConstructorParameters<ModelClass>[0];
