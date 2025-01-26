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
  invoiceListForCreatedUserUrl: baseUrl + '/invoice/invoices-by-users',
  invoiceDetailsUrl: baseUrl + '/invoice/invoiceDetails/',
  vendorInvoiceRefAlreadyExistUrl: baseUrl + '/invoice/is-vendor-invoiceRef-exists/',
  deleteInvoiceUrl: baseUrl + '/invoice/delete-invoice',
  getInvoicePdfUrl: baseUrl + '/invoice/generateinvoice',
  filteredInvoiceListUrl: baseUrl + '/invoice/filtered-invoices',



  createCostCenterUrl: baseUrl + '/invoice/create-costcenter',
  createExpenseTypeUrl: baseUrl + '/invoice/create-expensetype',
  createDepartmentUrl: baseUrl + '/invoice/create-department',
  createVendorUrl: baseUrl + '/invoice/create-vendors',


  GetCostCentersUrl: baseUrl + '/invoice/costcenters',
  GetExpenseTypesUrl: baseUrl + '/invoice/expensetypes',
  GetExpenseTypesByCategoryUrl: baseUrl + '/invoice/expensetypes-by-category',
  GetDepartmentsUrl: baseUrl + '/invoice/departments',
  GetVendorUrl: baseUrl + '/invoice/vendors',

  deleteCostCentersUrl: baseUrl + '/invoice/delete-costcenter',
  deleteExpenseTypesUrl: baseUrl + '/invoice/delete-expensetype',
  deleteDepartmentsUrl: baseUrl + '/invoice/delete-department',
  deleteVendorUrl: baseUrl + '/invoice/delete-vendor',
  addUser: baseUrl + '/admin/user',
  updateUser: baseUrl + '/admin/user',
  getUserDetails: baseUrl + '/user',


  getUsersListWithoutPagination: baseUrl + '/usersList',
  getUsersList: baseUrl + '/admin/users',
  changePassword: baseUrl + '/user/change-password',
  changePasswordAdmin: baseUrl + '/admin/change-password'




};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
