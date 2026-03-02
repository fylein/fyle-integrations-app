import { QBDPreRequisiteState } from "../../enum/enum.model";

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
    last_file_generated_by: string | null,
    created_at: Date,
    updated_at: Date
}

export type QBDPrerequisiteObject = {
    id: number,
    label: string,
    caption: string,
    externalLink?: string,
    iconName: string,
    state: QBDPreRequisiteState
}

export type SyncDataType = {
    attribute_type: string;
    count: null | number
  };
