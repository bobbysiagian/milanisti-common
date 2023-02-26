import SystemParameterService from '../../service/system_parameter_service';
import { Context, RequestData } from '../../typings';
import Controller from '../controller';
export declare class SystemParameterController extends Controller {
    private sysparService;
    constructor(sysparService: SystemParameterService);
    paginateSyspar(data: RequestData, context: Context): Promise<any>;
    getSyspar(data: RequestData, context: Context): Promise<any>;
    upsertSyspar(data: RequestData, context: Context): Promise<any>;
    protected setRoutes(): void;
}
export default SystemParameterController;
//# sourceMappingURL=syspar_controller.d.ts.map