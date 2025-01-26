const baseUrl = 'https://hr.iteckstar.net/InvoiceWebApp/webportal/v1'
export const environment = {
  production: true,
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
