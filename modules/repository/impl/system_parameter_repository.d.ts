import { BaseProps } from '../../typings';
import SQLRepository from '../sql_repository';
export interface SysparProps extends BaseProps {
    code: string;
    value: string;
    description: string;
}
export declare class SystemParameterRepository extends SQLRepository<SysparProps> {
    constructor();
}
export default SystemParameterRepository;
//# sourceMappingURL=system_parameter_repository.d.ts.map