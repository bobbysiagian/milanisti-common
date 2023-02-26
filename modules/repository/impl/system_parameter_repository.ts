import { BaseProps } from '../../typings';
import SQLRepository from '../sql_repository';

export interface SysparProps extends BaseProps {
    code: string;
    value: string;
    description: string
}

export class SystemParameterRepository extends SQLRepository<SysparProps> {
    constructor() {
        super('SystemParameter');
    }
}

export default SystemParameterRepository;
