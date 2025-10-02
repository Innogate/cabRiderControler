const sql = require("mssql");
const PDO = require("../core/pod.js");

exports.gateAllVendor = async (params) => {
  const {
    id = 0,
    PageNo,
    PageSize,
    Search = '',
    SortColumn = '1',
    SortOrder = 'ASC',
    user_id,
    company_id,
  } = params;
  const pdo = new PDO();
  const { data, output } = await pdo.callProcedure({
    procName: "sp_get_list_VendorMast",
    inputParams: [
      { name: "id", type: sql.Int, value: id },
      { name: "PageNo", type: sql.Int, value: PageNo },
      { name: "PageSize", type: sql.Int, value: PageSize },
      { name: "Search", type: sql.VarChar(200), value: Search },
      { name: "SortColumn", type: sql.NVarChar(20), value: SortColumn },
      { name: "SortOrder", type: sql.NVarChar(20), value: SortOrder },
      { name: "user_id", type: sql.Int, value: user_id },
      { name: "company_id", type: sql.Int, value: company_id },
    ],
    outputParams: [
      { name: "StatusID", type: sql.Int },
      { name: "StatusMessage", type: sql.VarChar(200) },
      { name: "TotalCount", type: sql.Int },
    ],
  });

  return {
    data: data,
    StatusID: output.StatusID,
    StatusMessage: output.StatusMessage,
    TotalCount: output.TotalCount
  };
};



exports.createUpdateVendorMaster = async (params) => {
  const {
    id = 0,
    vendor_name,
    address,
    city_id,
    pin_code,
    mobileno,
    whatsappno,
    gstno,
    panno,
    bank_name,
    bank_branch,
    bank_acno,
    bank_actype,
    bank_ifsc,
    active,
    ref_by,
    email,
    phone_no,
    vendor_type,
    tax_type,
    igst,
    cgst,
    sgst,
    tds,
    party_type,
    user_id,
    company_id,
  } = params;


  const pdo = new PDO();

  const { data, output } = await pdo.callProcedure({
    procName: "sp_app_create_VendorMast",
    inputParams: [
      { name: "id", type: sql.Int, value: id },
      { name: "vendor_name", type: sql.VarChar(50), value: vendor_name },
      { name: "address", type: sql.VarChar(500), value: address },
      { name: "city_id", type: sql.Int, value: city_id },
      { name: "pin_code", type: sql.VarChar(10), value: pin_code },
      { name: "mobileno", type: sql.VarChar(10), value: mobileno },
      { name: "whatsappno", type: sql.VarChar(10), value: whatsappno },
      { name: "gstno", type: sql.VarChar(50), value: gstno },
      { name: "panno", type: sql.VarChar(50), value: panno },
      { name: "bank_name", type: sql.VarChar(50), value: bank_name },
      { name: "bank_branch", type: sql.VarChar(50), value: bank_branch },
      { name: "bank_acno", type: sql.VarChar(50), value: bank_acno },
      { name: "bank_actype", type: sql.VarChar(50), value: bank_actype },
      { name: "bank_ifsc", type: sql.VarChar(50), value: bank_ifsc },
      { name: "active", type: sql.VarChar(1), value: active },
      { name: "ref_by", type: sql.VarChar(50), value: ref_by },
      { name: "email", type: sql.VarChar(200), value: email },
      { name: "phone_no", type: sql.VarChar(50), value: phone_no },
      { name: "vendor_type", type: sql.VarChar(50), value: vendor_type },
      { name: "tax_type", type: sql.VarChar(20), value: tax_type },
      { name: "igst", type: sql.Decimal(10, 2), value: igst },
      { name: "cgst", type: sql.Decimal(10, 2), value: cgst },
      { name: "sgst", type: sql.Decimal(10, 2), value: sgst },
      { name: "tds", type: sql.Decimal(10, 2), value: tds },
      { name: "party_type", type: sql.VarChar(50), value: party_type },
      { name: "user_id", type: sql.Int, value: user_id },
      { name: "company_id", type: sql.Int, value: company_id },
    ],
    outputParams: [
      { name: "StatusID", type: sql.Int },
      { name: "StatusMessage", type: sql.VarChar(200) },
      { name: "TotalCount", type: sql.Int },
    ],
  });

  return {
    data,
    StatusID: output.StatusID,
    StatusMessage: output.StatusMessage,
    TotalCount: output.TotalCount,
  };



};


exports.getAllVendorListDropdown = async (params) => {
  const {
    company_id = 0,
  } = params;
  const pdo = new PDO();
  const sqlQuery = `
    SELECT id, vendor_name, mobileno 
    FROM vendor_mast 
    WHERE company_id = @company_id
    ORDER BY vendor_name ASC;
  `;
  try {
    const data = await pdo.execute({
      sqlQuery,
      params: { company_id }
    });

    return {
      data: data,
      StatusID: 1,
      StatusMessage: "Vendor list fetched successfully.",
      TotalCount: data.length
    };
  } catch (error) {
    console.error("Error in getAllVendorListDropdown:", error);
    return { data: [], StatusID: 0, StatusMessage: error.message, TotalCount: 0 };
  }
};



exports.getCarTypesByVendorId = async (params) => {
  const {
    vendor_id,
    company_id = 0,
  } = params;
  const pdo = new PDO();
  const sqlQuery = `
    SELECT 
      v.id AS VendorId,
      v.vendor_name,
      v.mobileno,
      c.id AS CarId,
      c.CarNo,
      ct.id AS CarTypeId,
      ct.car_type AS CarTypeName
    FROM vendor_mast v
    INNER JOIN car_mast c 
      ON v.id = c.VendorId
    INNER JOIN car_type_mast ct 
      ON c.CarType = ct.id 
    WHERE v.company_id = @company_id
      AND v.id = @vendor_id
    ORDER BY ct.car_type ASC;
  `;
  try {
    const rows = await pdo.execute({
      sqlQuery,
      params: { company_id, vendor_id }
    });

    // Group rows by VendorId and then by CarTypeId
    const grouped = rows.reduce((acc, row) => {
      let vendor = acc.find(v => v.VendorId === row.VendorId);
      if (!vendor) {
        vendor = {
          VendorId: row.VendorId,
          vendor_name: row.vendor_name,
          mobileno: row.mobileno,
          carDetalse: []
        };
        acc.push(vendor);
      }

      // check if this CarType already exists in carDetalse
      let carType = vendor.carDetalse.find(ct => ct.CarTypeId === row.CarTypeId);
      if (!carType) {
        carType = {
          CarTypeId: row.CarTypeId,
          CarTypeName: row.CarTypeName,
          cars: []
        };
        vendor.carDetalse.push(carType);
      }

      // push the car under that CarType
      carType.cars.push({
        CarId: row.CarId,
        CarNo: row.CarNo
      });

      return acc;
    }, []);


    return {
      data: grouped,
      StatusID: 1,
      StatusMessage: "Vendor cartype fetched successfully.",
      TotalCount: grouped.length
    };
  } catch (error) {
    console.error("Error in getCarTypesByVendorId:", error);
    return { data: [], StatusID: 0, StatusMessage: error.message, TotalCount: 0 };
  }
};
