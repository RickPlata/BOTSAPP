const messageHandler = (message) => {
     const {from, body} = message;
     const txt = body.toLowerCase();
     console.log(from, txt);
}