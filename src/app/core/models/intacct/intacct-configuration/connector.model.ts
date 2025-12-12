export type IntacctAuthorizationCodePayload = {
  code: string;
  redirect_uri: string;
}

export type LocationEntityPost = {
  location_entity_name: string,
  destination_id: string,
  country_name: null | string,
  workspace: number
}