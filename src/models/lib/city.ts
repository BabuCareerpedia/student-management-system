import {BaseRecord} from './base_record';

export type ICity = {
    name?: string;
    id: string;
    code?: string;
}

export class City extends BaseRecord implements ICity {
    public id: string;
    public name?: string;
    public code?: string;

    constructor(id: string, name?: string, code?: string) {
        super(id, name);
        this.code = code;
    }
}
