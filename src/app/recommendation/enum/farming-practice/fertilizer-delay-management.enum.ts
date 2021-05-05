export enum FertilizerDelayManagement {
    BASE64IMG = "",
    HEADER = "When field has overflow of water or drought at active tillering:",
    COMBINE_ALL_FERTILIZER = "If overflow of water or drought ends by @activeTilleringHigh " +
    "@daysAfter, then combine all fertilizer for active " +
    "tillering and panicle initiation into one application after the overflow " +
    "of water or drought. ",

    APPLY_FERTILIZER_FOR_ACTIVE_AND_PANICLE = "If overflow of water or drought ends by @activeTilleringHigh " +
    "@daysAfter, apply fertilizer for active tillering " +
    "after the overflow of water or drought. Apply the fertilizer for panicle " +
    "initiation within @panicleInitiationLow to @panicleInitiationHigh @daysAfter. ",

    APPLY_FERTILIZER_FOR_ACTIVE_TILLERING = "If overflow of water or drought ends by @activeTilleringHigh " +
    "@daysAfter, apply fertilizer for active tillering after the overflow " +
    "of water or drought. ",

    APPLY_FERTILIZER_FOR_PANICLE_INITIATION = "If overflow of water or drought extends beyond @activeTilleringHigh " +
    "@daysAfter, eliminate application for active " +
    "tillering. Only apply fertilizer for panicle initiation.",

}
