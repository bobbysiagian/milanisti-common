import * as Sequelize from 'sequelize';
import { Options } from 'sequelize';
import { Transaction } from 'sequelize';
interface DBOpts {
    connection_string: string;
    models_path: string;
    read_replicas?: string[];
    options?: Options;
}
interface DBModel extends Sequelize.ModelCtor<any> {
    associate?: (models: DBModelCollection) => void;
    new (): any;
}
interface DBModelCollection {
    [s: string]: DBModel;
}
export interface DBInstance {
    model: DBModelCollection;
    context: Sequelize.Sequelize;
    ORMProvider: typeof Sequelize;
    db_transaction: Transaction | null;
}
export declare class DBModule {
    private static instance;
    static initialize({ connection_string, models_path, read_replicas, options }: DBOpts): Promise<void>;
    static registerModel(modelsDir: string, fileName: string): void;
    static getInstance(): DBInstance;
    static getContext(): Sequelize.Sequelize;
    static getORMProvider(): typeof Sequelize;
    static getModel(modelName: string): DBModel;
    static createTransaction(isolationLevel?: Transaction.ISOLATION_LEVELS): Promise<Sequelize.Transaction>;
}
export default DBModule;
//# sourceMappingURL=sql.d.ts.map