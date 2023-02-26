import { Transaction } from 'sequelize/types';
import { SQLContext } from '../database';
import { EventPublisher } from '../event';
import { LOG_SOURCE } from '../utils/constant';
import Logger from '../utils/logger';
import FlagService from './flag_service';

export abstract class Service extends Logger {

    protected event: EventPublisher;
    protected flag: FlagService;

    constructor() {
        super({ source: LOG_SOURCE.SERVICE });
        this.event = new EventPublisher();
        this.flag = new FlagService();
    }

    protected createTransaction(): Promise<Transaction> {
        return SQLContext.createTransaction();
    }

}

export default Service;