import { Transaction } from 'sequelize/types';
import SQLContext, { DBInstance } from '../database/sql';
import { Attributes, BaseProps, Page, QueryOptions } from '../typings';
interface SqlOptions {
    transaction?: Transaction;
}
export declare class SQLRepository<Props extends BaseProps = any> extends SQLContext {
    protected modelName: string;
    constructor(modelName: string);
    createTransaction(): Promise<Transaction>;
    protected getInstance(): DBInstance;
    findById(id: number, attributes?: Attributes, opts?: SqlOptions): Promise<Props | null>;
    findOne(conditions: Partial<Props>, attributes?: Attributes, opts?: SqlOptions): Promise<Props | null>;
    findOneOrFail(conditions: Partial<Props>, attributes?: Attributes, opts?: SqlOptions): Promise<Props>;
    findAll(conditions: Partial<Props>, { sort, attributes }: QueryOptions, opts?: SqlOptions): Promise<Props[]>;
    upsert(search: Partial<Props>, data: Partial<Props>, opts?: SqlOptions): Promise<void>;
    create(data: Partial<Props>, opts?: SqlOptions): Promise<Props>;
    createMany(data: Partial<Props[]>, opts?: SqlOptions): Promise<Props[]>;
    update(conditions: Partial<Props>, data: Partial<Props>, opts?: SqlOptions): Promise<[number, any]>;
    delete(conditions: Partial<Props>, opts?: SqlOptions): Promise<number>;
    increment(conditions: Partial<Props>, fields: {
        [P in keyof Props]?: number;
    }, opts?: SqlOptions): Promise<any>;
    count(conditions: Partial<Props>, opts?: SqlOptions): Promise<number>;
    protected mapPaginate(page: number, perPage: number, { rows, count }: {
        rows: any[];
        count: number;
    }): Page<Props>;
    paginate(conditions: Partial<Props>, { page, per_page, sort, attributes }: QueryOptions, opts?: SqlOptions): Promise<Page<Props>>;
}
export default SQLRepository;
//# sourceMappingURL=sql_repository.d.ts.map