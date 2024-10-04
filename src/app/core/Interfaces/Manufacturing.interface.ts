export interface Manufacturing {
    manufacturingId: number; 
    processType: string;
    subprocessType:string,
    machineDetails:string,
    machineDescription: string;
    cost: number;
    machineName:string;
    mcAutomation:string;
    machineEfficiency:string;
    toolingCost:number;
    loadingTime:number;
    // Foreign key reference to the Part
    partId: number;
}
