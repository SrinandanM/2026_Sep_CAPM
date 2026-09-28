const cds = require('@sap/cds-dk/lib/cds');
const INSERT = require('@sap/cds/lib/ql/INSERT');
const { uuid, exists, isdir, read, mkdirp } = cds.utils;
 
 
module.exports = cds.service.impl(async function() {
    // Declare Employee service from entities
    const { EmployeeSrv, AddressesSrv, ProductsSrv, BusinessPartnerSrv, PurchaseItemSrv, PurchaseOrderSrv } = this.entities;
 
    this.on('createEmployee', async (request, response) => {
        // Get data from the request
        const empData = request.data;
 
        // Instantiate the transaction object
        const transaction = cds.tx(request);
 
        // Insert data into DB
        let returnData = await transaction.run([
            INSERT.into(EmployeeSrv).entries(empData)
        ]).then((resolve, reject) => {
            if (typeof resolve !== undefined) {
                return empData;
            } else {
                request.reject(500, 'An error occured while inserting data into DB.');
            }
        }).catch((err) => {
            request.error('An error occured:', err.toString());
        });
       
        // Return data on success
        return returnData;
    });

///////////////////////////////////////////////////////////////////////////////////////////////////////
    //Using this.before for validation and pre-checks

    this.before('UPDATE', EmployeeSrv, async (request, response) => {
        const salaryAmount = request.data.salaryAmount;
        if(salaryAmount > 100000){
            request.error(500, '  Please get the approval from your line Manager.  ');
        }
    })

    this.before('UPDATE', ProductsSrv, async(request, response) => {
        const PRICE = request.data.PRICE;
        if(PRICE > 1000) {
            request.error(500, ' Get Approval from your manager. ')
        }
    })
///////////////////////////////////////////////////////////////////////////////////////////////
    this.before('UPDATE', AddressesSrv, async(request, response) =>
    {
        const COUNTRY = request.data.COUNTRY;
        if(COUNTRY == 'US' || 'GB'){
            request.error(500, ' Please contact your Administrator ')
        }
    })

   this.before('UPDATE',EmployeeSrv, async(request, response) => 
    {
        const phoneNumber = request.data.phoneNumber;
        if(phoneNumber && phoneNumber.startsWith('+1')) {
            request.error(500,  'We cannot update the phone number')
        }
    })

    this.before('UPDATE', BusinessPartnerSrv, async(request, response) => 
    {
        const COMPANY_NAME = request.data.COMPANY_NAME;
        if(COMPANY_NAME && (COMPANY_NAME.includes(',') || COMPANY_NAME.includes('.') || COMPANY_NAME.includes('-')))
        {
            request.error(500, 'Invalid Company Name')
        }
    })

    this.before('UPDATE', PurchaseItemSrv, async(request, response) => {
        const PO_ITEMS_POS = request.data.PO_ITEMS_POS;
    if (PO_ITEMS_POS && PO_ITEMS_POS % 10 !== 0) { 
        request.error(500, "Only multiples of 10 are allowed")  
    } 
    })
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Using this.after   

    
    this.on('createAddress', async (request, response) => {
        const addressData = request.data;
       
        const transaction = cds.tx(request);
       
        let returnData = await transaction.run([
            INSERT.into(AddressesSrv).entries(addressData)
        ]).then((resolve, reject) => {
            if (typeof resolve !== undefined) {
                return addressData;
            } else {
                request.reject(500, 'An error occured while inserting data into DB.');
            }
        }).catch((err) => {
            request.error('An error occured:', err.toString());
        });
 
        return returnData;
    });
 
    this.on('updateEmployee', async (request, response) => {
        const { ID, salaryAmount, Currency_code } = request.data;
 
        try {
            const transaction = cds.tx(request);
 
            await transaction.update(EmployeeSrv).with({
                salaryAmount,
                Currency_code
            }).where({
                ID:ID
            });
 
            return 'Update successful!';
        } catch (err) {
            request.error('An error occured:', err.toString());
        }
    });
 
    this.on('updateAddress', async (request, response) => {
        const { NODE_KEY, ADDRESS_TYPE, CITY } = request.data;
 
        try {
            const transaction = cds.tx(request);
 
            await transaction.update(AddressesSrv).with({
                ADDRESS_TYPE,
                CITY
            }).where({
                NODE_KEY
            });
 
            return 'Update successful!';
        } catch (err) {
            request.error('An error occured:', err.toString());
        }
    });
 
    this.on('createProduct', async (request, response) => {
        const prodData = request.data;
 
        const transaction = cds.tx(request);
 
        let returnData = await transaction.run([
            INSERT.into(ProductsSrv).entries(prodData)
        ]).then((resolve, reject) => {
            if (typeof resolve !== undefined) {
                return prodData;
            } else {
                request.reject(500, 'An error occured while inserting data.');
            }
        }).catch((err) => {
            request.error(500, 'An error occured:', err.toString());
        });
 
        return returnData;
    });
 
    this.on('updateProduct', async (request, response) => {
        const { NODE_KEY, PRICE, CURRENCY_CODE } = request.data;
 
        try {
            const transaction = cds.tx(request);
 
            await transaction.update(ProductsSrv).with({
                PRICE,
                CURRENCY_CODE
            }).where({
                NODE_KEY
            });
 
            return 'Update successful!';
        } catch (err) {
            request.error('An error occured:', err.toString());
        }
    });
 
    this.on('deleteAddress', async (request, response) => {
        const { NODE_KEY } = request.data;
 
        try {
            const transaction = cds.tx(request);
 
            await transaction.delete(AddressesSrv).where({
                NODE_KEY
            });
 
            return 'Deleted successfully!';
        } catch (err) {
            request.error('An error occured:', err.toString());
        }
    });
        this.on('deleteEmployee', async (request, response) => {
        const { ID } = request.data;
 
        try {
            const transaction = cds.tx(request);
 
            await transaction.delete(EmployeeSrv).where({
                ID : ID
            });
 
            return 'Deleted successfully!';
        } catch (err) {
            request.error('An error occured:', err.toString());
        }
    });

    //Implementation of Custom Functions
    this.on('getHighestSalariedEmployees', async(request, response) =>
    {
        try{
            //Step 1 : Create an object for Transaction
            const transaction = cds.tx(request);

            //Step 2 : Get salaries of Employees using transaction object 
            const response = await transaction.read(EmployeeSrv).orderBy({
                salaryAmount : 'desc'
            }).limit(10);

            //Display
            return response;
        }catch (error) {
            request.error('Error :', error)
        }

    })
    // Cunstom function impl for Products
    this.on('getHighestPriceProducts', async (request) => {
    try {
        const tx = cds.tx(request);

        const result = await tx.read(ProductSrv)
            .orderBy({ PRICE: 'desc' })
            .limit(10);

        return result;

    } catch (error) {
        request.error(500, error.message);
    }
})

//Instance based function implementation
this.on('LargestOrder', async (request, response) => {
    try {

        // Create transaction
        const transaction = cds.tx(request);

        // Get top 5 orders with highest gross amount
        const reply = await transaction.read(PurchaseOrderSrv)
            .orderBy({
                GROSS_AMOUNT: 'desc'
            })
            .limit(5);

        return reply;

    } catch (error) {
        return "Error : " + error.toString();
    }
})

//Instance Bounded Action : The employee salary should be increased by 15% using Employee Entity.

this.on('increaseSalary', async(request, response) => {

    try {

        // Step-1 : Get the parameter from the entity
        const ID = request.params[0];

        // Step-2 : Creating object for transaction service using request
        const transaction = cds.tx(request);

        // Step-3 : Update the employee salary by 15%
        await transaction.update(EmployeeSrv).with({
            salaryAmount : {
                '*=' : 1.15
            }
        }).where(ID);

        // Step-4 : Get the updated employee information
        const updatedEmployeeInfo = await transaction.read(EmployeeSrv).where(ID);

        // Step-5 : Return the updated employee information
        return updatedEmployeeInfo;

    } catch (error) {

        return "Error : " + error.toString();

    }

})
this.on('getTop20Employees', async(request, response) => {

    try {

        // Step-1 : Creating object for transaction service using request
        const transaction = cds.tx(request);

        // Step-2 : Get top 20 highest paid employees
        const reply = await transaction.read(EmployeeSrv).orderBy({
            salaryAmount : 'desc'
        }).limit(20);

        // Step-3 : Return top 20 highest paid employee information
        return reply;

    } catch (error) {

        return "Error : " + error.toString();

    }

})

    this.on('getUtilities', async (request, response) => {
    let vUUID = uuid(), 
        vPackageContent = null, 
        vInput = "%EXA4%A", 
        uri, 
        dirExists = false, 
        isFileExists = false;

    // To check if it Exists
    if (exists('srv/request.http')) {
        isFileExists = true;
    }

    // If Directory exist
    if(isdir('srv'))
    {
        dirExists = true;
    }

    // Decode URI
    try{
        uri = decodeURI(vInput);
        // Make Directory
        await mkdirp('srv/lib');
    } 
    catch 
    {
        uri = vInput;
    }

    vPackageContent = await read('package.json');

    // Final Value
    var finalVallue = {
        uuid : vUUID,
        uri : uri,
        isFileExists : isFileExists,
        dirExists : dirExists,
        packageInfo : vPackageContent
    }

    return finalVallue;
})
});