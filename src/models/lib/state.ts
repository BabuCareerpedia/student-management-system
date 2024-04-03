import {BaseRecord} from './base_record';

export type IState = {
    code?: string;
    id: string;
    name?: string;
}

export class State extends BaseRecord implements IState {
    public code?: string;
    public name?: string;
    public id: string;

    constructor(id: string, name?: string, code?: string) {
        super(id, name);
        this.code = code;
    }
}
