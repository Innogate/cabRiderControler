const sql = require("mssql");
const PDO = require("../core/pod.js");

// exports.repeatBooking = async (params) => {
//     const {
//         id,
//         Date,
//         user_id,
//         company_id
//     } = params;

//     const pod = new PDO();
//     const { data, output } = await pod.callProcedure({
//         procName: "sp_app_create_repeat_booking",
//         inputParams: [
//             { name: "id", type: sql.Int, value: id },
//             { name: "Date", type: sql.Date, value: Date},
//             { name: "user_id", type: sql.Int, value: user_id },
//             { name: "company_id", type: sql.Int, value: company_id },
//         ],
//         outputParams: [
//             { name: "StatusID", type: sql.Int },
//             { name: "StatusMessage", type: sql.VarChar(200) },
//             { name: "TotalCount", type: sql.Int },
//         ],
//     });

//     return {
//        data: data,
//         StatusID: output.StatusID,
//         StatusMessage: output.StatusMessage,
//         TotalCount: output.TotalCount
//     };

// }



exports.repeatBooking = async (params) => {
    const { id, startDate, endDate, user_id, company_id } = params;

    const convert = (date) => {
        if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
        let [dd, mm, yyyy] = date.split("-");
        return `${yyyy}-${mm}-${dd}`;
    };

    const generateDates = (start, end) => {
        let s = new Date(convert(start));
        let e = new Date(convert(end));
        let list = [];

        if (isNaN(s) || isNaN(e)) return list;

        while (s <= e) {
            list.push(s.toISOString().split("T")[0]);
            s.setDate(s.getDate() + 1);
        }
        return list;
    };

    const dateList = generateDates(startDate, endDate);

    let responses = [];

    for (let dt of dateList) {
        try {
            const pod = new PDO();
            const { data, output } = await pod.callProcedure({
                procName: "sp_app_create_repeat_booking",
                inputParams: [
                    { name: "id", type: sql.Int, value: id },
                    { name: "Date", type: sql.Date, value: dt },
                    { name: "user_id", type: sql.Int, value: user_id },
                    { name: "company_id", type: sql.Int, value: company_id }
                ],
                outputParams: [
                    { name: "StatusMessage", type: sql.VarChar(200) },
                    { name: "StatusID", type: sql.Int },
                    { name: "TotalCount", type: sql.Int }
                ]
            });
            responses.push({ Date: dt, output, data });
        } catch (err) {
            responses.push({ Date: dt, ERROR: err.message });
        }
    }


    return {
        results: responses,
        StatusID: 1,
        StatusMessage: "Repeat booking completed",
        TotalCount: responses.length
    };
};

