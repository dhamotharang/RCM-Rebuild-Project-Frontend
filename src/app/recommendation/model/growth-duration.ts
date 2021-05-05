export class GrowthDuration {
    constructor(
        public earlyLow: string,
        public earlyHigh: number,
        public activeTilleringLow: number,
        public activeTilleringHigh: number,
        public panicleInitiationLow: number,
        public panicleInitiationHigh: number,
        public headingLow: number,
        public headingHigh: number,
        public harvestLow: number,
        public harvestHigh: number,
        public rainfedActiveTilleringLow: number,
        public rainfedActiveTilleringHigh: number,
        public rainfedPanicleInitiationLow: number,
        public rainfedPanicleInitiationHigh: number
    ) { }
}
