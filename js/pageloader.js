const queryVars=getQueryVars();

if (queryVars){
  (async () => {
    //let file = await fetch(locationn.host+"/pages/"+queryVars['id']);
    let file = await fetch("pages/"+queryVars['id']);
    let content;

    //make the code better
    if (file.ok) {
      content = await file.blob()
      //console.log(content);

      let fileReader = new FileReader();

      fileReader.readAsArrayBuffer(content);

      fileReader.onload =async function(event) {

        let arrayBuffer = fileReader.result;
        arrayBuffer = new Uint8Array(arrayBuffer);
        //console.log(arrayBuffer);

        const encryptedMessage = await openpgp.readMessage({
          binaryMessage: arrayBuffer // parse encrypted bytes
        });

        const { data: decrypted } = await openpgp.decrypt({
          message: encryptedMessage,
          passwords: [queryVars['key']], // decrypt with password
          format: 'binary' // output as Uint8Array
        }).catch(err=>console.log("Decryption Failed"));

        //need to test for sussessfull decryption 
        document.body.innerHTML = new TextDecoder("utf-8").decode(decrypted); // Uint8Array([0x01, 0x01, 0x01])
      };
    }
  })();
}

function getQueryVars()
{
  var obj = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  if(query){
    for (var i=0;i<vars.length;i++) {
      var pair = vars[i].split("=");
      obj[pair[0]] = pair[1];
    }
    return obj;
  }else{
    return false
  }
}
