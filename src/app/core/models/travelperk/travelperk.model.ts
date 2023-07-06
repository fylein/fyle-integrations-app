import { Org} from 'fyle-integrations-ui-lib';

export type Travelperk = {
    id: number;
    folder_id: string;
    package_id: string;
    is_fyle_connected: boolean;
    is_s3_connected: boolean;
    org: number;
    travelperk_connection_id: number;
    created_at: Date;
    updated_at: Date;
}

export type TravelperkConfiguration = {
    id: number,
    org: Org,
    recipe_id: string,
    recipe_data: string
    is_recipe_enabled: boolean
}


export type WorkatoConnectionStatus = {
    wk: boolean,
    type: string,
    payload: {
        id: number,
        provider: string
        connected?: boolean,
        error?: string,
    }
}
