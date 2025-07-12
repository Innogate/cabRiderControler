const { gatAllCityList, gatAllDriverListDropdown, deleteTableData } = require("../controllers/comonApiController")

module.exports = async function handleWS(context) {
    try {
        const { ws, type, command, body, parts, clients } = context;
        // car type master

        if (type === "POST" && parts[0] === "gatAllCityDropDown") {
            const user = ws._user;

            const params = {
                ...body,
                company_id: user?.company_id,
                user_id: user?.Id
            };
            try {
                const result = await gatAllCityList(params);
                if (result?.data?.length > 0) {
                    ws.send(
                        JSON.stringify({
                            for: 'getAllCityDropdown',
                            ...result,
                        })
                    );
                } else {
                    ws.send(
                        JSON.stringify({
                            msg: "No data found",
                            type: "warning",
                            ...result,
                        })
                    );
                }
            } catch (err) {
                ws.send(JSON.stringify({ msg: "Server error", type: "error" }));
            }
        }


        else if (type === "POST" && parts[0] === "deleteData") {
            const user = ws._user;

            const params = {
                ...body,
                company_id: user?.company_id,
                user_id: user?.Id
            };
            try {
                const result = await deleteTableData(params);
                if (result) {
                    ws.send(
                        JSON.stringify({
                            for: 'deleteData',
                            ...result,
                        })
                    );
                } else {
                    ws.send(
                        JSON.stringify({
                            msg: "No data found",
                            type: "warning",
                            ...result,
                        })
                    );
                }
            } catch (err) {
                ws.send(JSON.stringify({ msg: "Server error", type: "error" }));
            }
        }

        else if (type === "POST" && parts[0] === "gatAllDriverDropDown") {
            const user = ws._user;

            const params = {
                ...body,
                company_id: user?.company_id,
                user_id: user?.Id
            };
            try {
                const result = await gatAllDriverListDropdown(params);
                if (result?.data?.length > 0) {
                    ws.send(
                        JSON.stringify({
                            for: 'getAllDriverDropdown',
                            ...result,
                        })
                    );
                } else {
                    ws.send(
                        JSON.stringify({
                            msg: "No data found",
                            type: "warning",
                            ...result,
                        })
                    );
                }
            } catch (err) {
                ws.send(JSON.stringify({ msg: "Server error", type: "error" }));
            }
        }




    } catch (e) {
        console.error("WS Handler Error:", e);
        context.ws.send(
            JSON.stringify({ msg: "Bad request format", type: "error" })
        );
    }
}