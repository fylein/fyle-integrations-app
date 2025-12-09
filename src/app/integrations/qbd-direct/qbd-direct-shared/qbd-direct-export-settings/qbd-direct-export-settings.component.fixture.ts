import { of } from 'rxjs';
import { PaginatedDestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { QbdDirectDestinationAttribute } from 'src/app/core/models/qbd-direct/db/qbd-direct-destination-attribuite.model';

export class QbdDirectExportSettingsComponentFixture {
  /**
   * Creates fixture data for paginated destination attributes
   */
  static createPaginatedDestinationAttributesFixture(): PaginatedDestinationAttribute {
    return {
      count: 15,
      next: null,
      previous: null,
      results: this.createQbdDirectDestinationAttributes(),
    };
  }

  /**
   * Creates fixture data for QBD Direct destination attributes
   */
  static createQbdDirectDestinationAttributes(): QbdDirectDestinationAttribute[] {
    return [
      {
        id: 1,
        attribute_type: 'ACCOUNT',
        display_name: 'Cash - Operating',
        value: 'Cash - Operating',
        destination_id: 'acc_001',
        active: true,
        code: '1000',
        created_at: new Date('2024-01-01T00:00:00Z'),
        updated_at: new Date('2024-01-01T00:00:00Z'),
        workspace: 1,
        detail: {
          account_type: 'BANK',
          account_number: 1000,
        },
      },
      {
        id: 2,
        attribute_type: 'ACCOUNT',
        display_name: 'Accounts Payable',
        value: 'Accounts Payable',
        destination_id: 'acc_002',
        active: true,
        code: '2000',
        created_at: new Date('2024-01-01T00:00:00Z'),
        updated_at: new Date('2024-01-01T00:00:00Z'),
        workspace: 1,
        detail: {
          account_type: 'ACCOUNTS_PAYABLE',
          account_number: 2000,
        },
      },
      {
        id: 3,
        attribute_type: 'ACCOUNT',
        display_name: 'Credit Card Payable',
        value: 'Credit Card Payable',
        destination_id: 'acc_003',
        active: true,
        code: '2100',
        created_at: new Date('2024-01-01T00:00:00Z'),
        updated_at: new Date('2024-01-01T00:00:00Z'),
        workspace: 1,
        detail: {
          account_type: 'ACCOUNTS_PAYABLE',
          account_number: 2100,
        },
      },
      {
        id: 4,
        attribute_type: 'ACCOUNT',
        display_name: 'Travel Expenses',
        value: 'Travel Expenses',
        destination_id: 'acc_004',
        active: true,
        code: '6000',
        created_at: new Date('2024-01-01T00:00:00Z'),
        updated_at: new Date('2024-01-01T00:00:00Z'),
        workspace: 1,
        detail: {
          account_type: 'EXPENSE',
          account_number: 6000,
        },
      },
      {
        id: 5,
        attribute_type: 'ACCOUNT',
        display_name: 'Office Supplies',
        value: 'Office Supplies',
        destination_id: 'acc_005',
        active: true,
        code: '6100',
        created_at: new Date('2024-01-01T00:00:00Z'),
        updated_at: new Date('2024-01-01T00:00:00Z'),
        workspace: 1,
        detail: {
          account_type: 'EXPENSE',
          account_number: 6100,
        },
      },
      {
        id: 6,
        attribute_type: 'ACCOUNT',
        display_name: 'Meals & Entertainment',
        value: 'Meals & Entertainment',
        destination_id: 'acc_006',
        active: true,
        code: '6200',
        created_at: new Date('2024-01-01T00:00:00Z'),
        updated_at: new Date('2024-01-01T00:00:00Z'),
        workspace: 1,
        detail: {
          account_type: 'EXPENSE',
          account_number: 6200,
        },
      },
      {
        id: 7,
        attribute_type: 'ACCOUNT',
        display_name: 'Software Licenses',
        value: 'Software Licenses',
        destination_id: 'acc_007',
        active: true,
        code: '6300',
        created_at: new Date('2024-01-01T00:00:00Z'),
        updated_at: new Date('2024-01-01T00:00:00Z'),
        workspace: 1,
        detail: {
          account_type: 'EXPENSE',
          account_number: 6300,
        },
      },
      {
        id: 8,
        attribute_type: 'ACCOUNT',
        display_name: 'Equipment',
        value: 'Equipment',
        destination_id: 'acc_008',
        active: true,
        code: '6400',
        created_at: new Date('2024-01-01T00:00:00Z'),
        updated_at: new Date('2024-01-01T00:00:00Z'),
        workspace: 1,
        detail: {
          account_type: 'EXPENSE',
          account_number: 6400,
        },
      },
      {
        id: 9,
        attribute_type: 'ACCOUNT',
        display_name: 'Professional Services',
        value: 'Professional Services',
        destination_id: 'acc_009',
        active: true,
        code: '6500',
        created_at: new Date('2024-01-01T00:00:00Z'),
        updated_at: new Date('2024-01-01T00:00:00Z'),
        workspace: 1,
        detail: {
          account_type: 'EXPENSE',
          account_number: 6500,
        },
      },
      {
        id: 10,
        attribute_type: 'ACCOUNT',
        display_name: 'Marketing',
        value: 'Marketing',
        destination_id: 'acc_010',
        active: true,
        code: '6600',
        created_at: new Date('2024-01-01T00:00:00Z'),
        updated_at: new Date('2024-01-01T00:00:00Z'),
        workspace: 1,
        detail: {
          account_type: 'EXPENSE',
          account_number: 6600,
        },
      },
      {
        id: 11,
        attribute_type: 'ACCOUNT',
        display_name: 'Utilities',
        value: 'Utilities',
        destination_id: 'acc_011',
        active: true,
        code: '6700',
        created_at: new Date('2024-01-01T00:00:00Z'),
        updated_at: new Date('2024-01-01T00:00:00Z'),
        workspace: 1,
        detail: {
          account_type: 'EXPENSE',
          account_number: 6700,
        },
      },
      {
        id: 12,
        attribute_type: 'ACCOUNT',
        display_name: 'Rent',
        value: 'Rent',
        destination_id: 'acc_012',
        active: true,
        code: '6800',
        created_at: new Date('2024-01-01T00:00:00Z'),
        updated_at: new Date('2024-01-01T00:00:00Z'),
        workspace: 1,
        detail: {
          account_type: 'EXPENSE',
          account_number: 6800,
        },
      },
      {
        id: 13,
        attribute_type: 'ACCOUNT',
        display_name: 'Insurance',
        value: 'Insurance',
        destination_id: 'acc_013',
        active: true,
        code: '6900',
        created_at: new Date('2024-01-01T00:00:00Z'),
        updated_at: new Date('2024-01-01T00:00:00Z'),
        workspace: 1,
        detail: {
          account_type: 'EXPENSE',
          account_number: 6900,
        },
      },
      {
        id: 14,
        attribute_type: 'ACCOUNT',
        display_name: 'Depreciation',
        value: 'Depreciation',
        destination_id: 'acc_014',
        active: true,
        code: '7000',
        created_at: new Date('2024-01-01T00:00:00Z'),
        updated_at: new Date('2024-01-01T00:00:00Z'),
        workspace: 1,
        detail: {
          account_type: 'EXPENSE',
          account_number: 7000,
        },
      },
      {
        id: 15,
        attribute_type: 'ACCOUNT',
        display_name: 'Other Expenses',
        value: 'Other Expenses',
        destination_id: 'acc_015',
        active: true,
        code: '7100',
        created_at: new Date('2024-01-01T00:00:00Z'),
        updated_at: new Date('2024-01-01T00:00:00Z'),
        workspace: 1,
        detail: {
          account_type: 'EXPENSE',
          account_number: 7100,
        },
      },
    ];
  }

  /**
   * Creates fixture data for specific account types
   */
  static createAccountTypeSpecificFixture(accountType: string): PaginatedDestinationAttribute {
    const allAccounts = this.createQbdDirectDestinationAttributes();
    const filteredAccounts = allAccounts.filter((account) => {
      switch (accountType) {
        case 'BANK':
          return account.detail.account_type === 'BANK';
        case 'ACCOUNTS_PAYABLE':
          return account.detail.account_type === 'ACCOUNTS_PAYABLE';
        case 'EXPENSE':
          return account.detail.account_type === 'EXPENSE';
        default:
          return true;
      }
    });

    return {
      count: filteredAccounts.length,
      next: null,
      previous: null,
      results: filteredAccounts,
    };
  }

  /**
   * Creates fixture data for search results
   */
  static createSearchResultsFixture(searchTerm: string): PaginatedDestinationAttribute {
    const allAccounts = this.createQbdDirectDestinationAttributes();
    const filteredAccounts = allAccounts.filter(
      (account) =>
        account.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.display_name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return {
      count: filteredAccounts.length,
      next: null,
      previous: null,
      results: filteredAccounts,
    };
  }

  /**
   * Creates fixture data for specific destination IDs
   */
  static createSpecificDestinationIdsFixture(destinationIds: string[]): PaginatedDestinationAttribute {
    const allAccounts = this.createQbdDirectDestinationAttributes();
    const filteredAccounts = allAccounts.filter((account) => destinationIds.includes(account.destination_id));

    return {
      count: filteredAccounts.length,
      next: null,
      previous: null,
      results: filteredAccounts,
    };
  }

  /**
   * Creates empty fixture data
   */
  static createEmptyFixture(): PaginatedDestinationAttribute {
    return {
      count: 0,
      next: null,
      previous: null,
      results: [],
    };
  }
}
