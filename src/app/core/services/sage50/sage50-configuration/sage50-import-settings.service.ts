import { Injectable } from "@angular/core";
import { ApiService } from "../../common/api.service";
import { Observable } from "rxjs";
import { Sage50FyleField, Sage50ImportableCOAGet, Sage50ImportableCOAType, Sage50ImportableField, Sage50ImportSettingsForm, Sage50ImportSettingsGet, Sage50ImportSettingsPost, Sage50MappingSettingRow } from "src/app/core/models/sage50/sage50-configuration/sage50-import-settings.model";
import { WorkspaceService } from "../../common/workspace.service";
import { FormControl, FormGroup, ValidationErrors } from "@angular/forms";
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

    putSage50ImportSettings(payload: Sage50ImportSettingsPost): Observable<void> {
        return this.apiService.put(`/${this.workspaceService.getWorkspaceId()}/settings/import_settings/`, payload);
    }

    getImportableChartOfAccounts(): Observable<Sage50ImportableCOAGet> {
        return this.apiService.get(`/${this.workspaceService.getWorkspaceId()}/settings/importable_chart_of_accounts/`, {});
    }

    getImportCodeFieldsConfig(): Observable<Record<Sage50ImportableField, boolean>> {
        return this.apiService.get(`/${this.workspaceService.getWorkspaceId()}/settings/import_code_fields_config/`, {});
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
        importStatuses: Record<Sage50ImportableField, boolean>,
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
        if (isVendorMandatory) {
            isVendorEnabled = true;
        }

        const importCodeFields = import_settings?.import_code_fields ?? [];
        const chartOfAccounts = import_settings?.chart_of_accounts ?? [Sage50ImportableCOAType.EXPENSES];

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

        const isMappedFieldEnabled = (field: Sage50ImportableField) => mappedFields[field]?.import_to_fyle ?? false;

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
            JOB: new FormGroup({
                enabled: new FormControl(isMappedFieldEnabled(Sage50ImportableField.JOB), { nonNullable: true }),
                file: new FormControl(this.getLastUploadedFile(accountingImportDetails[Sage50AttributeType.JOB])),
                importCode: new FormControl(importCodeValues[Sage50ImportableField.JOB]),
                sourceField: new FormControl(Sage50FyleField.PROJECT as Sage50FyleField),
                destinationField: new FormControl(Sage50ImportableField.JOB as Sage50ImportableField, { nonNullable: true }),
                sourcePlaceholder: new FormControl(mappedFields[Sage50ImportableField.JOB]?.source_placeholder ?? null)
            }),
            PHASE: new FormGroup({
                enabled: new FormControl(isMappedFieldEnabled(Sage50ImportableField.PHASE), { nonNullable: true }),
                file: new FormControl(this.getLastUploadedFile(accountingImportDetails[Sage50AttributeType.PHASE])),
                importCode: new FormControl(importCodeValues[Sage50ImportableField.PHASE]),
                sourceField: new FormControl(mappedFields[Sage50ImportableField.PHASE]?.source_field ?? null),
                destinationField: new FormControl(Sage50ImportableField.PHASE as Sage50ImportableField, { nonNullable: true }),
                sourcePlaceholder: new FormControl(mappedFields[Sage50ImportableField.PHASE]?.source_placeholder ?? null)
            }),
            COST_CODE: new FormGroup({
                enabled: new FormControl(isMappedFieldEnabled(Sage50ImportableField.COST_CODE), { nonNullable: true }),
                file: new FormControl(this.getLastUploadedFile(accountingImportDetails[Sage50AttributeType.COST_CODE])),
                importCode: new FormControl(importCodeValues[Sage50ImportableField.COST_CODE]),
                sourceField: new FormControl(mappedFields[Sage50ImportableField.COST_CODE]?.source_field ?? null),
                destinationField: new FormControl(Sage50ImportableField.COST_CODE as Sage50ImportableField, { nonNullable: true }),
                sourcePlaceholder: new FormControl(mappedFields[Sage50ImportableField.COST_CODE]?.source_placeholder ?? null)
            })
        }, {
            validators: (form) => {
                const errors: ValidationErrors = {};

                for (const field of Object.values(Sage50ImportableField)) {
                    const formGroup = form.get(field);
                    const hasBeenImported = importStatuses[field];

                    // If the field isn't enabled, skip validation
                    // (a field can be disabled only if it is non-mandatory)
                    if (!formGroup?.get('enabled')?.value) {
                        continue;
                    }

                    // A valid file is mandatory if the field is enabled
                    if (!formGroup?.get('file')?.value) {
                        errors[field] = {
                            ...errors[field],
                            file: { required: true }
                        };
                    }

                    // Code import is mandatory if the field is enabled and has NOT been imported before
                    // If it has been imported before, import code is not shown at all since it is a one-time setting
                    if (!hasBeenImported && formGroup?.get('importCode')?.value === null) {
                        errors[field] = {
                            ...errors[field],
                            importCode: { required: true }
                        };
                    }

                    // Source field is mandatory if the import field has one, and is enabled
                    if (!!formGroup?.get('sourceField') && !formGroup?.get('sourceField')?.value) {
                        errors[field] = {
                            ...errors[field],
                            sourceField: { required: true }
                        };
                    }
                }

                return Object.keys(errors).length > 0 ? errors : null;
            }
        });
    }

    constructPayloadAndPost(importSettingsForm: FormGroup<Sage50ImportSettingsForm>): Observable<void> {
        const importCodeFields = Object.values(Sage50ImportableField).filter((field) =>
            importSettingsForm.get(field)?.get('importCode')?.value
        );

        const mappingSettings = [] as Sage50MappingSettingRow[];
        for (const field of Object.values(Sage50ImportableField)) {
            const sourceField = importSettingsForm.get(field)?.get('sourceField')?.value;
            const sourcePlaceholder = importSettingsForm.get(field)?.get('sourcePlaceholder')?.value;
            const enabled = importSettingsForm.get(field)?.get('enabled')?.value;
            if (sourceField) {
                mappingSettings.push({
                    source_field: sourceField,
                    destination_field: field,
                    import_to_fyle: enabled ?? false,
                    is_custom: ![Sage50FyleField.PROJECT, Sage50FyleField.COST_CENTER].includes(sourceField),
                    source_placeholder: sourcePlaceholder ?? null
                });
            }
        }

        return this.putSage50ImportSettings({
            import_settings: {
                import_account_as_category: true,
                import_vendor_as_merchant: !!importSettingsForm.get('VENDOR')?.get('enabled')?.value,
                import_code_fields: importCodeFields,
                chart_of_accounts: importSettingsForm.get('ACCOUNT')?.get('accountTypes')?.value ?? [Sage50ImportableCOAType.EXPENSES]
            },
            mapping_settings: mappingSettings
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
        importCodeFieldsConfig: Record<Sage50ImportableField, boolean>
    ): Record<Sage50ImportableField, boolean> {
        const importStatuses = {} as Record<Sage50ImportableField, boolean>;

        for (const field of Object.values(Sage50ImportableField)) {
            // A field has been imported before if its import code field is not shown
            importStatuses[field] = !importCodeFieldsConfig[field];
        }
        return importStatuses;
    }
}