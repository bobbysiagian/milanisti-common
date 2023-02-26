import { Transaction } from 'sequelize/types';
import { EventPublisher } from '../event';
import Logger from '../utils/logger';
import FlagService from './flag_service';
export declare abstract class Service extends Logger {
    protected event: EventPublisher;
    protected flag: FlagService;
    constructor();
    protected createTransaction(): Promise<Transaction>;
}
export default Service;
//# sourceMappingURL=service.d.ts.map