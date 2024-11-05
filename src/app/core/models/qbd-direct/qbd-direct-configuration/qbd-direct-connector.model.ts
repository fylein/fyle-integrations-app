export type QbdConnectorPost = {
    file_location: string;
}

export type QbdConnectorGet = {
    id: number,
    workspace_id: number,
    username: string,
    password: string,
    ticket_id: string,
    file_location: string,
    qwc: string,
    created_at: Date,
    updated_at: Date
}
