import Joi = require('joi');
import SystemParameterService from '../../service/system_parameter_service';
import { Context, RequestData } from '../../typings';
import Controller from '../controller';

const UpsertSchema = Joi.object().keys({
    body: Joi.object().keys({
        code: Joi.string().max(15).required(),
        value: Joi.string().required(),
        description: Joi.string().max(255).optional().allow(null, '')
    })
});

const PaginateSchema = Joi.object().keys({
    query: Joi.object().keys({
        page: Joi.number().positive().integer().default(1),
        per_page: Joi.number().positive().integer().default(10),
        search: Joi.string().optional().allow(null, '')
    })
});

export class SystemParameterController extends Controller {

    private sysparService: SystemParameterService;

    constructor(sysparService: SystemParameterService) {
        super({ path: '/internal/system-parameter' });
        this.sysparService = sysparService;
    }

    public async paginateSyspar(data: RequestData, context: Context): Promise<any> {
        const { data: systemParameters, meta} = await this.sysparService
            .paginateSyspar(data.query.page, data.query.per_page, data.query.search);
        return {
            message: 'syspar list',
            data: {
                content: systemParameters,
                meta
            }
        };
    }

    public async getSyspar(data: RequestData, context: Context): Promise<any> {
        const syspar = await this.sysparService.getSysparByCode(data.params.code);
        return {
            message: 'syspar found',
            data: syspar
        };
    }

    public async upsertSyspar(data: RequestData, context: Context): Promise<any> {
        const { body } = data;

        await this.sysparService.upsertSyspar({
            code: body.code,
            value: body.value,
            description: body.description
        });

        return {
            message: 'syspar upserted'
        };
    }

    protected setRoutes(): void {
        this.addRoute('get', '/', this.paginateSyspar.bind(this), { validate: PaginateSchema });
        this.addRoute('post', '/', this.upsertSyspar.bind(this), { validate: UpsertSchema });
        this.addRoute('get', '/:code', this.getSyspar.bind(this));
    }
}

export default SystemParameterController;
