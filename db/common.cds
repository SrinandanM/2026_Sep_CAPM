 
namespace APP1.common;
 
using { Currency } from '@sap/cds/common';
 
type Guid :UUID;
type PhoneNumber : String(31);
type Email : String(225);
type Role : String(2);
type String32 :String(32);
type String64 : String(64);
type String225 : String(225);
type String12: String(12);
 
 
Type Gender : String(1) enum {
    male ='M';
    female ='F';
    undisclosed ='D';
}
 
type AmountT : Decimal(10,2) @(
    Semantics.amount.currencyCode : 'CURRENCY_CODE',
    sap.unit : 'CURRENCY_CODE'
);
 
aspect Amount{
    GROSS_AMOUNT : AmountT;
    NET_AMOUNT : AmountT;
    TAX_AMOUNT : AmountT;
    CURRENCY : Currency;
}
 
aspect Address{
    STREET : String(225);
    POSTAL_CODE : String(12);
    CITY : String(225);
    COUNTRY : String(225);
    BUILDING : String(225);
}
 