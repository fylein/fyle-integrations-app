export type LocationEntityMapping = {
  id?: number;
  location_entity_name: string;
  country_name: string | null;
  destination_id: string;
  created_at?: Date;
  updated_at?: Date;
  workspace: number;
};
