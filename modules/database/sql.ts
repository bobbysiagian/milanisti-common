import * as fs from 'fs';
import * as path from 'path';
import * as Sequelize from 'sequelize';
import { Options, ReplicationOptions } from 'sequelize';
import { Transaction } from 'sequelize';
import { generateDatabaseConfig } from '../utils/helpers';

interface DBOpts {
    connection_string: string;
    models_path: string;
    read_replicas?: string[];
    options?: Options;
}

interface DBModel extends Sequelize.ModelCtor<any> {
    associate?: (models: DBModelCollection) => void;
    new (): any
}

interface DBModelCollection {
    [s:string]: DBModel;
}

export interface DBInstance {
    model: DBModelCollection;
    context: Sequelize.Sequelize;
    ORMProvider: typeof Sequelize;
    db_transaction: Transaction | null;
}

const opts: Options = {
    dialect: 'postgres',
    logging: process.env.LOG_SQL ? console.log : false,
    pool: {
        min: 0,
        max: 10,
        idle: 10000,
        acquire: 20000
    },
    define: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    }
};

export class DBModule {
    private static instance: DBInstance;

    public static async initialize({ connection_string, models_path, read_replicas, options }: DBOpts): Promise<void> {
        const models: DBModelCollection = {};
        let sequelize: Sequelize.Sequelize;

        if (read_replicas && read_replicas.length) {
            const replication: ReplicationOptions = {
                write: generateDatabaseConfig(connection_string),
                read: read_replicas.map(generateDatabaseConfig)
            };
            const dbOptions: Options = { ...opts, ...options, replication };
            sequelize = new Sequelize.Sequelize(connection_string, dbOptions);
        } else {
            sequelize = new Sequelize.Sequelize(connection_string, { ...opts, ...options});
        }

        this.instance = {
            ORMProvider: Sequelize,
            context: sequelize,
            model: models,
            db_transaction: null
        };

        const modelsDir = path.join(__dirname, '../../../..', models_path);
        fs.readdirSync(modelsDir)
            .filter((file) => {
                const fileExtension: string = file.slice(-3);
                const isEligible: boolean = (fileExtension === '.js' || fileExtension === '.ts');
                return (file.indexOf('.') !== 0) && isEligible;
            })
            .forEach((fileName) => this.registerModel(modelsDir, fileName));

        /** initialize models relationship */
        Object.keys(models).forEach((modelName) => {
            const subModel = models[modelName];
            if (subModel && subModel.associate) {
                subModel.associate(models);
            }
        });
    }

    public static registerModel(modelsDir: string, fileName: string): void {
        const model: DBModel = require(path.join(modelsDir, fileName));
        this.instance.model[model.name] = model;
    }

    public static getInstance(): DBInstance {
        if (!this.instance) {
            throw new Error('Not initialize');
        }
        return this.instance;
    }

    public static getContext(): Sequelize.Sequelize {
        if (!this.instance) {
            throw new Error('Not initialize');
        }
        return this.instance.context;
    }

    public static getORMProvider(): typeof Sequelize {
        if (!this.instance) {
            throw new Error('Not initialize');
        }
        return this.instance.ORMProvider;
    }

    public static getModel(modelName: string): DBModel {
        if (!this.instance) {
            throw new Error('Not initialize');
        }
        return this.instance.model[modelName];
    }

    public static async createTransaction(isolationLevel = this.instance.ORMProvider.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED): Promise<Sequelize.Transaction> {
        return this.instance.context.transaction({ isolationLevel });
    }
}

export default DBModule;
