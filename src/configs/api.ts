const backendAPI = "http://localhost:3000/api-v1";
const socketAPI = "http://localhost:3005"

// Login - Register
const Login_API = `${backendAPI}/auth/login`;
const Register_API = `${backendAPI}/auth/register`;
// CHange Password
const ChangePassword_API = `${backendAPI}/auth/change-password`;

// Staffs
const AddStaff_API = `${backendAPI}/staff/add`;
const EditStaffInfo_API = `${backendAPI}/staff`;
const GetStaffList_API= `${backendAPI}/staff`;
const UploadStaffSalary_API= `${backendAPI}/staff/upload-salary`;
const UploadStaffAttendance_API= `${backendAPI}/staff/upload-attendance`;
const UploadStaffDailyRecord_API= `${backendAPI}/staff/upload-daily-records`;
const UpdateSalary_API = `${backendAPI}/staff/update-salary`;

// Operating Costs
const GetOperatingCost_API = `${backendAPI}/operating-costs`;
const AddOperatingCost_API = `${backendAPI}/operating-costs/add`;
const UploadOperatingCost_API = `${backendAPI}/operating-costs/upload`;

// Money In Out
const GetMoneyInOut_API = `${backendAPI}/money-in-out`;
const AddMoneyInOut_API = `${backendAPI}/money-in-out/add`;
const UploadMoneyInOut_API = `${backendAPI}/money-in-out/upload`;

// Money Banks
const GetBank_API = `${backendAPI}/money-banks`;
const AddBank_API = `${backendAPI}/money-banks/add`;

// Ads Costs
const GetAdsCosts_API = `${backendAPI}/ads-costs`;
const AddAdsCosts_API = `${backendAPI}/ads-costs/add`;
const UploadAdsCosts_API = `${backendAPI}/ads-costs/upload`;

// Product
const GetProducts_API = `${backendAPI}/products`;
const AddProduct_API = `${backendAPI}/products/add`;
const UploadProductImage_API = `${backendAPI}/products/upload`;

//Shop Orders
const GetShopOrders_API = `${backendAPI}/shop-orders`;
const AddShopOrders_API = `${backendAPI}/shop-orders/add`;

const UpdateDataOrderForStaff_API = `${backendAPI}/update-order/update-order-for-staffs`;

const HeartBeat_API = `${backendAPI}/ping`;
const HeartBeat_Result_API = `${backendAPI}/staff-status`;

// New order
const NewOrderComing_API = `${backendAPI}/new-order`;
const RedistributionOrder_API =  `${backendAPI}/new-orders/redistribute`;
const ClaimOrderStats_API = `${backendAPI}/new-orders/manager-stats`;
const ClaimOrderInMorning_API = `${backendAPI}/new-orders/claim-morning`;

//Import Export Inventory
const GetImpExpIn_API = `${backendAPI}/imp-exp-ivt`;
const AddImpExpIn_API = `${backendAPI}/imp-exp-ivt`;
const UploadImpExpIn_API = `${backendAPI}/imp-exp-ivt/upload-excel`;

// -- Routes
const frontend_API = "http://localhost:5185";
const ListOrder_Route = `${frontend_API}/quan-li-don-hang`;
const ListProduct_Route = `${frontend_API}/danh-sach-san-pham`;
export {
    backendAPI,
    socketAPI,
    frontend_API,

    // Login-Register
    Login_API,
    Register_API,
    ChangePassword_API,

    // Staff
    AddStaff_API,
    EditStaffInfo_API,
    GetStaffList_API,
    UploadStaffAttendance_API,
    UploadStaffSalary_API,
    UploadStaffDailyRecord_API,
    UpdateSalary_API, 

    // Operating Costs
    GetOperatingCost_API,
    AddOperatingCost_API,
    UploadOperatingCost_API,

    // Money In Out
    GetMoneyInOut_API,
    AddMoneyInOut_API,
    UploadMoneyInOut_API,

    GetBank_API,
    AddBank_API,

    // Ads Costs
    GetAdsCosts_API,
    AddAdsCosts_API,
    UploadAdsCosts_API,

    //Product
    GetProducts_API,
    AddProduct_API,
    UploadProductImage_API,

    // Shop Orders
    GetShopOrders_API,
    AddShopOrders_API,

    UpdateDataOrderForStaff_API,

    HeartBeat_API,
    HeartBeat_Result_API,

    // New Order
    NewOrderComing_API,
    RedistributionOrder_API,
    ClaimOrderStats_API,
    ClaimOrderInMorning_API,

    //Import Export Inventory
    GetImpExpIn_API,
    AddImpExpIn_API,
    UploadImpExpIn_API,



    // -- Routes
    ListProduct_Route,
    ListOrder_Route,
}