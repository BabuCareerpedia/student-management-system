export interface IPhone {
    phoneCountryCode: string;
    phoneNumber: string;
}

export class Phone implements IPhone {
    public phoneCountryCode: string;
    public phoneNumber: string;

    constructor(phoneCountryCode: string, phoneNumber: string) {
        this.phoneCountryCode = phoneCountryCode;
        this.phoneNumber = phoneNumber;

    }
}
