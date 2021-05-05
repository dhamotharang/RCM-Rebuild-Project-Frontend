/**
 * @deprecated Use Log model in v2 folder instead
 */
export interface Log {
    id: number;
    service: string;
    method: string;
    error: string;
    date: Date;
    user_id: number;
    name: string;

}
