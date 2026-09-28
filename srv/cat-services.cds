using { APP1.db as database } from '../db/schema';
using {APP1.common as common } from '../db/common';
using {Currency} from '@sap/cds/common';
 
 
service CatalogService  {


    entity EmployeeSrv as projection on database.master.Employees {
        *
    } actions {

    // Declare Instance Bounded Action
    action increaseSalary() returns EmployeeSrv;

    // Instance Bounded Function
    function getTop20Employees() returns array of EmployeeSrv;

}; 

    entity ProductSrv as projection on database.master.Products;
 
    entity BusinessPartnerSrv as projection on database.master.BusinessPartners;
 
    entity AddressSrv as projection on database.master.Addresses;
    entity PurchaseOrderSrv as projection on database.transaction.PurchaseOrders

    actions {
        function LargestOrder() returns array of PurchaseOrderSrv;
    }; 
    entity PurchaseItemSrv as projection on database.transaction.PurchaseItems;
   
 
 
action createEmployee(
    Currency_code: String(3),
    ID: UUID,
    accountNumber: common.String32,
    bankId: String(16),
    bankName: common.String64,
    email: common.Email,
    gender: common.Gender,
    language: String(2),
    loginName: String(16),
    nameFirst: common.String64,
    nameInitials: common.String64,
    nameLast: common.String64,
    nameMiddle: common.String64,
    phoneNumber: common.PhoneNumber,
    salaryAmount: common.AmountT
) returns array of EmployeeSrv;
 
action createAddress(
     STREET : common.String225,
     POSTAL_CODE : common.String12,
     CITY : common.String225,
     COUNTRY : common.String225,
     BUILDING : common.String225,
     NODE_KEY : UUID,
     ADDRESS_TYPE : common.String32,
     VAL_START : Date,
     VAL_END : Date,
     LATITUDE : Decimal,
     LONGITUDE : Decimal
)returns array of AddressSrv;
 
action updateEmployee(
    ID : UUID,
    salaryAmount : common.AmountT,
    Currency_code : String(3)
   )returns String;

action updateAddress(
    NODE_KEY : UUID,
    LATITUDE : Decimal,
) returns String;
action createProduct(
        NODE_KEY : UUID,
        PRODUCT_ID : common.String32,
        TYPE_CODE : String(2),
        CATEGORY : common.String32,
        DESCRIPTION : String(225),
        TAX_TARRIF_CODE : Integer,
        MEASURE_UNIT : String(2),
        WEIGHT_MEASURE : Decimal(5, 2),
        WEIGHT_UNIT : String(2),
        PRICE : Decimal (15, 2),
        CURRENCY_CODE : String(5),
        WIDTH : Decimal(5, 2),
        DEPTH : Decimal(5, 2),
        HEIGHT : Decimal(5, 2),
        DIM_UINT : String(2)
 
)returns array of ProductSrv;

action deleteEmployee(
    ID : UUID
) returns String;

//Custom function declaration
function getHighestSalariedEmployees() returns array of EmployeeSrv; 

// Custom function to get highest priced product
function getHighestPricedProduct() returns array of ProductSrv;
 
function getUtilities() returns String;

}