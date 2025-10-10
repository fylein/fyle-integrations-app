import { Injectable } from "@angular/core";
import { ApiService } from "../../common/api.service";
import { Observable } from "rxjs";
import { Sage50ImportableCOAGet, Sage50ImportableCOAType, Sage50ImportableField, Sage50ImportSettingsForm, Sage50ImportSettingsGet } from "src/app/core/models/sage50/sage50-configuration/sage50-import-settings.model";
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

        let isVendorEnabled = importSettings?.import_vendor_as_merchant ?? false;
        const isVendorMandatory = this.isVendorMandatory(exportSettings);
        if (isVendorMandatory || vendorFile) {
            isVendorEnabled = true;
        }

        return new FormGroup({
            ACCOUNT: new FormGroup({
                enabled: new FormControl(true, { nonNullable: true }),
                accountTypes: new FormControl(importSettings?.chart_of_accounts ?? [Sage50ImportableCOAType.EXPENSES]),
                file: new FormControl(accountFile),
                importCode: new FormControl(importSettings?.import_code_fields?.includes(Sage50ImportableField.ACCOUNT) ?? null)
            }),
            // TODO(sage50): check if VENDOR is required, if yes, hard-code enabled
            VENDOR: new FormGroup({
                enabled: new FormControl(isVendorEnabled, { nonNullable: true }),
                file: new FormControl(vendorFile),
                importCode: new FormControl(importSettings?.import_code_fields?.includes(Sage50ImportableField.VENDOR) ?? null)
            }),
            // TODO(sage50): check mapping_settings to see if these fields are enabled
            JOB: new FormGroup({
                enabled: new FormControl(false, { nonNullable: true }),
                file: new FormControl(this.getLastUploadedFile(accountingImportDetails[Sage50AttributeType.JOB])),
                importCode: new FormControl(importSettings?.import_code_fields?.includes(Sage50ImportableField.JOB) ?? null)
            }),
            PHASE: new FormGroup({
                enabled: new FormControl(false, { nonNullable: true }),
                file: new FormControl(this.getLastUploadedFile(accountingImportDetails[Sage50AttributeType.PHASE])),
                importCode: new FormControl(importSettings?.import_code_fields?.includes(Sage50ImportableField.PHASE) ?? null)
            }),
            COST_CODE: new FormGroup({
                enabled: new FormControl(false, { nonNullable: true }),
                file: new FormControl(this.getLastUploadedFile(accountingImportDetails[Sage50AttributeType.COST_CODE])),
                importCode: new FormControl(importSettings?.import_code_fields?.includes(Sage50ImportableField.COST_CODE) ?? null)
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
}