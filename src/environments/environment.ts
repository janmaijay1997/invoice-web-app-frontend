// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const baseUrl = 'http://localhost:8080/webportal/v1'
export const environment = {
  production: false,

  loginUser: baseUrl + '/login',

  createInvoiceUrl: baseUrl + '/invoice/createinvoice',
  otherDetailsUrl: baseUrl + '/invoice/otherdetails',
  invoiceListUrl: baseUrl + '/invoice/invoices',
  invoiceDetailsUrl: baseUrl + '/invoice/invoiceDetails/',
  deleteInvoiceUrl: baseUrl + '/invoice/delete-invoice',


  createCostCenterUrl: baseUrl + '/invoice/create-costcenter',
  createExpenseTypeUrl: baseUrl + '/invoice/create-expensetype',
  createDepartmentUrl: baseUrl + '/invoice/create-department',
  createVendorUrl: baseUrl + '/invoice/create-vendors',


  GetCostCentersUrl: baseUrl + '/invoice/costcenters',
  GetExpenseTypesUrl: baseUrl + '/invoice/expensetypes',
  GetDepartmentsUrl: baseUrl + '/invoice/departments',
  GetVendorUrl: baseUrl + '/invoice/vendors',

  deleteCostCentersUrl: baseUrl + '/invoice/delete-costcenter',
  deleteExpenseTypesUrl: baseUrl + '/invoice/delete-expensetype',
  deleteDepartmentsUrl: baseUrl + '/invoice/delete-department',
  deleteVendorUrl: baseUrl + '/invoice/delete-vendor',
  addUser: baseUrl +'/admin/user',
  getUsersList: baseUrl +'/admin/users'



};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
