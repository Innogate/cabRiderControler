exports.broadcast = async (clients, message, user_id=0, company_id=0) => {
    clients.forEach((client) => {
      if(client){
        client.forEach(ws => {
            if(user_id != 0 && company_id != 0){
                if(ws._user.Id == user_id && ws._user.company_id == company_id){
                    ws.send(message);
                }
                else if (user_id != 0 && company_id == 0){
                    if(ws._user.Id == user_id){
                        ws.send(message);
                    }
                }
                else if (company_id != 0 && user_id == 0){
                    if(ws._user.company_id == company_id){
                        ws.send(message);
                    }
                }
                else if (user_id == 0 && company_id == 0){
                    ws.send(message);
                }
            }
        });
      }
    });
}
