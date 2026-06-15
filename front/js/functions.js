export function request(url, params=null, json=false) {
    return new Promise((resolve, reject) => {
        let req = new XMLHttpRequest()
		    req.open('post', url)

		    req.onreadystatechange = () => {
            if (req.readyState == 4) {
                if (req.status == 200) {
                    if (json) {
                        resolve(JSON.parse(req.responseText))
                    } else {
                        resolve(req.responseText)
                    }                    
                } else {
                    reject('Requisição rejeitada');
                }
            }
        }

        let formParams = new FormData();
        if (params) {
            params.forEach((param) => {
                param = param.split('=');
                formParams.append(param[0], param[1]);
            });
        }
        req.send(formParams);
    });
}

export function processError(sender, e, mess='') {
    alert(mess)
    console.log('Component: ' +sender)
    console.log('Error: ' +e)
}

export function getControl(chave) {
    return document.querySelector(chave)
}