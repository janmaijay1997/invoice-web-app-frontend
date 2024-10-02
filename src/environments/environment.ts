// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const baseUrl = 'http://localhost:8080/webportal/v1'
export const environment = {
  production: false,
  createInvoiceUrl: baseUrl + '/createinvoice',
  otherDetailsUrl: baseUrl + '/otherdetails',
  invoiceListUrl: baseUrl + '/invoices',
  invoiceDetailsUrl: baseUrl + '/invoice/',
  createCostCenterUrl: baseUrl + '/create-costcenter',
  createExpenseTypeUrl: baseUrl + '/create-expensetype',
  createDepartmentUrl: baseUrl + '/create-department',
  createVendorUrl: baseUrl + '/create-vendors',


  GetCostCentersUrl: baseUrl + '/costcenters',
  GetExpenseTypesUrl: baseUrl + '/expensetypes',
  GetDepartmentsUrl: baseUrl + '/departments',
  GetVendorUrl: baseUrl + '/vendors',

  deleteCostCentersUrl: baseUrl + '/delete-costcenter',
  deleteExpenseTypesUrl: baseUrl + '/delete-expensetype',
  deleteDepartmentsUrl: baseUrl + '/delete-department',
  deleteVendorUrl: baseUrl + '/delete -vendor',



};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
