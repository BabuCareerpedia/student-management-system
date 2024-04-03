import {IListAPIResponse, ListAPIResponse} from '@models';

export type IStudentListAPIResponse = {
    studentId?: number;
} & IListAPIResponse

export class StudentListAPIResponse extends ListAPIResponse implements IStudentListAPIResponse {
    public studentId?: number;

    constructor(resultsList: any[], hasMoreResults?: boolean, fromIndex?: number, toIndex?: number,
                totalResultsCount?: number, queryId?: string, sortBy?: string, sortOrder?: string, url?: string,
                studentId?: number) {
        super(resultsList, hasMoreResults, fromIndex, toIndex, totalResultsCount, queryId, sortBy, sortOrder, url);

        this.studentId = studentId;
    }
}
