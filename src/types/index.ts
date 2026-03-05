export interface User {
    id: string;
    email: string;
}

export interface Media {
    id: string;
    filename: string;
    mimetype: string;
    size: number;
    key: string;
    url: string;
    createdAt: Date;
}

export interface Client {
    id: string;
    name: string;
    surname: string;
    email?: string;
    phone?: string;
    passportId?: string;
    status: string;
    createdAt: Date;
    creatorId?: string;
}
