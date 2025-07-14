exports.broadcast = async (clients, message, user_id = 0, company_id = 0) => {
  clients.forEach((clientObj, clientId) => {
    const ws = clientObj.ws;
    const user = ws._user || {};

    if (typeof ws.send === 'function') {
      if (user_id && company_id) {
        if (user.Id === user_id && user.company_id === company_id) {
          ws.send(message);
        }
      } else if (user_id) {
        if (user.Id === user_id) {
          ws.send(message);
        }
      } else if (company_id) {
        if (user.company_id === company_id) {
          ws.send(message);
        }
      } else {
        ws.send(message);
      }
    } else {
      console.warn(`Invalid ws object for client ${clientId}`);
    }
  });
};


function broadcastToAll(clients, message, filterFn = () => true) {
  clients.forEach(({ ws }, id) => {
    if (typeof ws.send === 'function' && filterFn(ws)) {
      ws.send(message);
    }
  });
}
