import { Injectable } from "@angular/core";
import { ApiService } from "../../common/api.service";
import { Observable } from "rxjs";
import { Sage50ImportableCOAGet, Sage50ImportableCOAType, Sage50ImportableField, Sage50ImportSettingsForm, Sage50ImportSettingsGet, Sage50MappingSettingRow } from "src/app/core/models/sage50/sage50-configuration/sage50-import-settings.model";
import { WorkspaceService } from "../../common/workspace.service";
import { FormControl, FormGroup } from "@angular/forms";
import { Sage50AttributeType } from "src/app/core/models/enum/enum.model";
import { Sage50AccountingImportDetail } from "src/app/core/models/sage50/db/sage50-import-attributes.model";
import { UploadedCSVFile } from "src/app/core/models/misc/configuration-csv-import-field.model";
import { DestinationAttributeStats } from "src/app/core/models/db/destination-attribute.model";
import { Sage50CCCExportType, Sage50ExportSettingsGet, Sage50ReimbursableExportType } from "src/app/core/models/sage50/sage50-configuration/sage50-export-settings.model";

@Injectable({
    providedIn: 'root'
})
export class Sage50ImportSettingsService {

    constructor(
        private apiService: ApiService,
        private workspaceService: WorkspaceService
    ) { }

    getSage50ImportSettings(): Observable<Sage50ImportSettingsGet> {
        return this.apiService.get(`/${this.workspaceService.getWorkspaceId()}/settings/import_settings/`, {});
    }

    getImportableChartOfAccounts(): Observable<Sage50ImportableCOAGet> {
        return this.apiService.get(`/${this.workspaceService.getWorkspaceId()}/settings/importable_chart_of_accounts/`, {});
    }

    private getLastUploadedFile(importDetail?: Sage50AccountingImportDetail): UploadedCSVFile | null {
        if (!importDetail?.last_uploaded_on || !importDetail.last_uploaded_file_name) {
            return null;
        }
        return {
            name: importDetail.last_uploaded_file_name,
            lastUploadedAt: new Date(importDetail.last_uploaded_on),
            valueCount: importDetail.imported_to_fyle_count
        };
    }

    mapApiResponseToFormGroup(
        importSettings: Sage50ImportSettingsGet | null,
        accountingImportDetails: Record<Sage50AttributeType, Sage50AccountingImportDetail>,
        exportSettings: Sage50ExportSettingsGet | null,
        accountStats?: DestinationAttributeStats,
        vendorStats?: DestinationAttributeStats
    ): FormGroup<Sage50ImportSettingsForm> {
        /*
            In onboarding, we show importable attributes count in the valueCount field.
            We get accountStats only in onboarding, so we replace valueCount
            from importDetail.imported_to_fyle_count to accountStats.active_attributes_count
            This applies to account and vendor only, since only these files can be uploaded in prerequisites.

            Post onboarding, we show imported attributes count in the valueCount field
            We don't get accountStats or vendorStats in this case, so we default to
            showing importDetail.imported_to_fyle_count
        */

        const accountFile = this.getLastUploadedFile(accountingImportDetails[Sage50AttributeType.ACCOUNT]);
        if (accountFile && accountStats) {
            accountFile.valueCount = accountStats.active_attributes_count;
        }
        const vendorFile = this.getLastUploadedFile(accountingImportDetails[Sage50AttributeType.VENDOR]);
        if (vendorFile && vendorStats) {
            vendorFile.valueCount = vendorStats.active_attributes_count;
        }

        const {import_settings, mapping_settings} = importSettings ?? {};
        let isVendorEnabled = import_settings?.import_vendor_as_merchant ?? false;
        const isVendorMandatory = this.isVendorMandatory(exportSettings);
        if (isVendorMandatory || vendorFile) {
            isVendorEnabled = true;
        }

        const importCodeFields = import_settings?.import_code_fields ?? [];
        const chartOfAccounts = import_settings?.chart_of_accounts ?? [Sage50ImportableCOAType.EXPENSES];

        const importStatuses = this.getImportStatusesByField(importSettings);
        const importCodeValues = {} as Record<Sage50ImportableField, boolean | null>;
        for (const field of Object.values(Sage50ImportableField)) {
            // If the field has been imported before, hide its importCode field but
            // Initialize it with true/false for the payload
            // If the field has not been imported before, show null (blank dropdown)
            importCodeValues[field] = importStatuses[field] ? importCodeFields.includes(field) : null;
        }

        const mappedFields = {} as Record<Sage50ImportableField, Sage50MappingSettingRow>;
        for (const setting of mapping_settings ?? []) {
            mappedFields[setting.destination_field] = setting;
        }

        return new FormGroup<Sage50ImportSettingsForm>({
            ACCOUNT: new FormGroup({
                enabled: new FormControl(true, { nonNullable: true }),
                accountTypes: new FormControl(chartOfAccounts),
                file: new FormControl(accountFile),
                importCode: new FormControl(importCodeValues[Sage50ImportableField.ACCOUNT])
            }),
            VENDOR: new FormGroup({
                enabled: new FormControl(isVendorEnabled, { nonNullable: true }),
                file: new FormControl(vendorFile),
                importCode: new FormControl(importCodeValues[Sage50ImportableField.VENDOR])
            }),
            // TODO(sage50): check mapping_settings to see if these fields are enabled
            JOB: new FormGroup({
                enabled: new FormControl(!!mappedFields[Sage50ImportableField.JOB], { nonNullable: true }),
                file: new FormControl(this.getLastUploadedFile(accountingImportDetails[Sage50AttributeType.JOB])),
                importCode: new FormControl(importCodeValues[Sage50ImportableField.JOB]),
                sourceField: new FormControl(mappedFields[Sage50ImportableField.JOB]?.source_field ?? null),
                destinationField: new FormControl(Sage50ImportableField.JOB as Sage50ImportableField, { nonNullable: true }),
                sourcePlaceholder: new FormControl(mappedFields[Sage50ImportableField.JOB]?.source_placeholder ?? null)
            }),
            PHASE: new FormGroup({
                enabled: new FormControl(!!mappedFields[Sage50ImportableField.PHASE], { nonNullable: true }),
                file: new FormControl(this.getLastUploadedFile(accountingImportDetails[Sage50AttributeType.PHASE])),
                importCode: new FormControl(importCodeValues[Sage50ImportableField.PHASE]),
                sourceField: new FormControl(mappedFields[Sage50ImportableField.PHASE]?.source_field ?? null),
                destinationField: new FormControl(Sage50ImportableField.PHASE as Sage50ImportableField, { nonNullable: true }),
                sourcePlaceholder: new FormControl(mappedFields[Sage50ImportableField.PHASE]?.source_placeholder ?? null)
            }),
            COST_CODE: new FormGroup({
                enabled: new FormControl(!!mappedFields[Sage50ImportableField.COST_CODE], { nonNullable: true }),
                file: new FormControl(this.getLastUploadedFile(accountingImportDetails[Sage50AttributeType.COST_CODE])),
                importCode: new FormControl(importCodeValues[Sage50ImportableField.COST_CODE]),
                sourceField: new FormControl(mappedFields[Sage50ImportableField.COST_CODE]?.source_field ?? null),
                destinationField: new FormControl(Sage50ImportableField.COST_CODE as Sage50ImportableField, { nonNullable: true }),
                sourcePlaceholder: new FormControl(mappedFields[Sage50ImportableField.COST_CODE]?.source_placeholder ?? null)
            })
        });
    }

    /**
     * If payments or purchases are being exported, vendor is mandatory
     */
    isVendorMandatory(exportSettings: Sage50ExportSettingsGet | null): boolean {
        const cccExportType = exportSettings?.credit_card_expense_export_type;
        const reimbursableExportType = exportSettings?.reimbursable_expense_export_type;

        return (
            // Is CCC set to payments or purchases?
            [
                Sage50CCCExportType.PAYMENTS_JOURNAL,
                Sage50CCCExportType.PURCHASES_RECEIVE_INVENTORY
            ].includes(cccExportType!)
        ) || (
            // Or, is reimbursable set to purchases?
            reimbursableExportType === Sage50ReimbursableExportType.PURCHASES_RECEIVE_INVENTORY
        );
    }

    getImportStatusesByField(
        importSettings: Sage50ImportSettingsGet | null
    ): Record<Sage50ImportableField, boolean> {
        const {import_settings, mapping_settings} = importSettings ?? {};

        const mappedDestinationFields = mapping_settings?.map((setting) => setting.destination_field);
        const importStatuses = {} as Record<Sage50ImportableField, boolean>;

        for (const field of Object.values(Sage50ImportableField)) {
            importStatuses[field] = mappedDestinationFields?.includes(field) ?? false;
        }

        importStatuses[Sage50ImportableField.ACCOUNT] = import_settings?.import_account_as_category ?? false;
        importStatuses[Sage50ImportableField.VENDOR] = import_settings?.import_vendor_as_merchant ?? false;
        return importStatuses;
    }
}