import {IAuditInfo} from './audit_info';
import {BaseRecord, IBaseRecord} from './base_record';

export type IBaseRecordAudit = {
    auditInfo?: IAuditInfo;
    clientId?: string;
} & IBaseRecord

export class BaseRecordAudit extends BaseRecord implements IBaseRecordAudit {
    public auditInfo?: IAuditInfo;
    public clientId?: string;

    constructor(id?: string, name?: string, auditInfo?: IAuditInfo, clientId?: string) {
        super(id, name);
        this.auditInfo = auditInfo;
        this.clientId = clientId?.toString();
    }
}
