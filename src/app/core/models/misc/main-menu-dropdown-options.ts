import { SelectItem, SelectItemGroup } from 'primeng/api';

interface MainMenuDropdownOption extends Partial<SelectItem> {
  handler?: () => void;
}

export interface MainMenuDropdownGroup extends Omit<SelectItemGroup, 'items'> {
  items: MainMenuDropdownOption[];
}
