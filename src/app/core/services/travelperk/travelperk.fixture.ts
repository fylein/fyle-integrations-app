import { Travelperk } from "../../models/travelperk/travelperk.model";

export const travelperkMockData: Travelperk = {
    id: 1,
    folder_id: '1234',
    package_id: '467',
    is_fyle_connected: true,
    is_s3_connected: true,
    org: 1,
    travelperk_connection_id: 123,
    created_at: new Date(),
    updated_at: new Date()
};

export const connectTravelperkMockData = {
    'message': {
        'connection_id': '123'
    }
};

export const connectAwsS3MockData = {
    "application": "rest",
    "id": 22,
    "name": "S3 Connection",
    "description": null,
    "authorized_at": new Date(),
    "authorization_status": "success",
    "authorization_error": null,
    "created_at": new Date(),
    "updated_at": new Date(),
    "external_id": null,
    "folder_id": 12,
    "parent_id": null
};
