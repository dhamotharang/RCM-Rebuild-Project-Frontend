export interface RCMRecommendationListModel {
    dateGenerated: Date;
    refId: number;
    pdfFile: string;
    temporaryRefId: string;
    isUploading?: boolean;
    error?: boolean;
    fieldId?: number;
    sowingDate?: Date;
}
