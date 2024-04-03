import {BaseRecord} from './base_record';

export type IEmployee = {
    id: string;
    employeeId?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
}

export class Employee extends BaseRecord implements IEmployee {
    public id: string;
    public employeeId?: string;
    public firstName?: string;
    public lastName?: string;
    public email?: string;

    constructor(id: string, employeeId?: string,
                firstName?: string,
                lastName?: string,
                email?: string) {
        super(id);
        this.email = email;
        this.employeeId = employeeId;
        this.firstName = firstName;
        this.lastName = lastName;
    }
}
