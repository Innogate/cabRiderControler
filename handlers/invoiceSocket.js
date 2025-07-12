const {
  getInvoiceAdjustmentDetails,
} = require("../controllers/invoiceController");

module.exports = async function handleWS(context) {
  try {
    const { ws, type, command, body, parts, clients } = context;
    if (type === "POST" && parts[0] === "search") {
      if (!ws._authenticated) {
        ws.send(
          JSON.stringify({
            msg: "Something went wrong please try again",
            type: "warn",
          })
        );
        return;
      }
      try {
        const payload = {
          user_id: ws._user.Id,
          company_id: ws._user.company_id,
          ...body,
        };
        const result = await getInvoiceAdjustmentDetails(payload);
        if (result.status != 1) {
          ws.send(
            JSON.stringify({
              msg: "Something went wrong please try again later",
              type: "warn",
              ...result,
            })
          );
        }
        ws.send(
          JSON.stringify({
            // msg: "Fetch successful",
            // type: "success",
            for: "invoiceTableData",
            ...result,
          })
        );
      } catch (err) {
        console.error(err);
        ws.send(JSON.stringify({ msg: "Server error", type: "error" }));
      }
    }
  } catch (e) {
    console.error(e);
    context.ws.send(
      JSON.stringify({ msg: "Bad request format", type: "error" })
    );
  }
};
