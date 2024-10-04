import { Manufacturing } from "./Manufacturing.interface";

export interface Part {
    partId: number;
    internalPartNumber: string;
    supplierName: string;
    deliverySiteName: string;
    drawingNumber?: string; 
    incoTerms: string;
    annualVolume: number;
    bomQty: number;
    deliveryFrequency: number;
    lotSize: number;
    manufacturingCategory: string;
    packagingType: string;
    productLifeRemaining: number;
    paymentTerms: string;
    partComplexity:string;
    lifetimeQuantityRemaining: number;
    manufacturings: {
        $values: Manufacturing[]; 
    };
  }
  