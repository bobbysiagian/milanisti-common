import { SQLContext } from '../database';
import { SysparProps, SystemParameterRepository } from '../repository';
import { Page } from '../typings';
import CacheService from './cache_service';
import Service from './service';

export class SystemParameterService extends Service {

    private sysParRepo: SystemParameterRepository;
    private cacheService: CacheService;

    private cacheKey = 'syspar-';

    constructor(sysParRepo: SystemParameterRepository, cacheService: CacheService) {
        super();
        this.sysParRepo = sysParRepo;
        this.cacheService = cacheService;
    }

    public async upsertSyspar(props: Partial<SysparProps>): Promise<void> {
        await this.sysParRepo.upsert({ code: props.code }, props);
        await this.cacheService.delete(this.cacheKey + props.code);
    }

    public async getSysparByCode(code: string): Promise<SysparProps> {
        const key = this.cacheKey + code;
        let syspar = await this.cacheService.get(key);
        if (!syspar) {
            syspar = await this.sysParRepo.findOneOrFail({ code });
            await this.cacheService.set(key, syspar);
        }
        return syspar;
    }

    public async paginateSyspar(page: number, perPage: number, search?: string): Promise<Page<SysparProps>> {
        const { Op } = SQLContext.getORMProvider();
        const conditions: any =  search ? { code: { [Op.iLike]: '%search%' }} : {};
        return this.sysParRepo.paginate(conditions, { page, per_page: perPage});
    }

}

export default SystemParameterService;
