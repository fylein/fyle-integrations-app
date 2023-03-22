import { Gusto, GustoConfiguration, GustoConfigurationPost } from "../../models/gusto/gusto.model";
import { WorkatoConnectionStatus } from "../../models/travelperk/travelperk.model";

export const GustoMockData: Gusto = {
    id: 1,
    org: 1,
    folder_id: '1',
    package_id: '1',
    created_at: new Date(),
    updated_at: new Date(),
    connection_id: 'cyx'
};

export const GustoMockWithoutToken: Gusto = {
    id: 1,
    org: 1,
    folder_id: '',
    package_id: '',
    created_at: new Date(),
    updated_at: new Date(),
    connection_id: ''
};

export const GustoMockConfiguration: GustoConfiguration = {
    id: 1,
    org: 1,
    recipe_id: '1',
    recipe_data: 'xyz',
    recipe_status: true,
    additional_email_options: [
        {
            email: 'ashwin.t+lolooi@fyle.in',
            name: 'Ashwin'
        }
    ],
    emails_selected: [
        {
            email: 'ashwin.t+lolooi@fyle.in',
            name: 'Ashwin'
        }
    ]
};

export const GustoMockConfigurationPayload: GustoConfigurationPost = {
    org: 1,
    additional_email_options: [
        {
            email: 'ashwin.t+lolooi@fyle.in',
            name: 'Ashwin'
        }
    ],
    emails_selected: [
        {
            email: 'ashwin.t+lolooi@fyle.in',
            name: 'Ashwin'
        }
    ]
};

export const connectGustoMockData = {
    'message': {
        'connection_id': '123'
    }
};

export const workatoConnectionStatusMockData: WorkatoConnectionStatus = {
    wk: true,
    type: 'travelperk',
    payload: {
        id: 1,
        provider: 'travelperk',
        connected: false
    }
};

export const workatoConnectionStatusMockDatawithTrue: WorkatoConnectionStatus = {
    wk: true,
    type: 'travelperk',
    payload: {
        id: 1,
        provider: 'travelperk',
        connected: true
    }
};