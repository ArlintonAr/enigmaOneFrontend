


export interface APIResponsePosition {
    message: string;
    data: Position[];
    success: boolean;
}

export interface APIResponsePositionById {
    message: string;
    data: Position;
    success: boolean;
}

export interface APIResponsePositionCreate {
    message: string;
    data: Position;
    success: boolean;
}

export interface Position {
    id: number;
    positionName: string;
    code: string;
}
export interface PositionCreate {
    positionName: string;

}