import { SysparProps, SystemParameterRepository } from '../repository';
import { Page } from '../typings';
import CacheService from './cache_service';
import Service from './service';
export declare class SystemParameterService extends Service {
    private sysParRepo;
    private cacheService;
    private cacheKey;
    constructor(sysParRepo: SystemParameterRepository, cacheService: CacheService);
    upsertSyspar(props: Partial<SysparProps>): Promise<void>;
    getSysparByCode(code: string): Promise<SysparProps>;
    paginateSyspar(page: number, perPage: number, search?: string): Promise<Page<SysparProps>>;
}
export default SystemParameterService;
//# sourceMappingURL=system_parameter_service.d.ts.map