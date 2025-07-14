const { getBookingSearch } = require("../controllers/bookingController");
const { createBookingDetails } = require("../controllers/bookingController");
const { broadcast } = require("../utility/functions");

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
          ...body
        };
        const result = await getBookingSearch(payload);
        if (result.status != 1) {
          ws.send(
            JSON.stringify({
              msg: "Something went wrong please try again later",
              type: "warn",
              ...result,
            })
          )
        }
        ws.send(
          JSON.stringify({
            // msg: "Fetch successful",
            // type: "success",
            for: "bookingTableData",
            ...result,
          })
        );
      } catch (err) {
        console.error(err);
        ws.send(JSON.stringify({ msg: "Server error", type: "error" }));
      }
    }
    else if (type === "POST" && parts[0] === "create") {
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
          ...body
        };
        const result = await createBookingDetails(payload);
        if (result.status != 1) {
          ws.send(
            JSON.stringify({
              msg: "Something went wrong please try again later",
              type: "warn",
              ...result,
            })
          )
        }
    }catch (err) {
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
