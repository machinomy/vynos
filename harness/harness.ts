import {YnosWindow} from "../ynos/YnosWindow";

let _window = (<YnosWindow>window);

window.addEventListener("load", function () {
    _window.ynos.initFrame().then(() => {
        _window.ynos.initAccount().then(() => {
            console.log("initAccount")
        })
        let activateButton = document.getElementById('activate');
        if (activateButton) {
            activateButton.addEventListener('click', function () {
                _window.ynos.getAccount().then((address: string)=> {
                    alert(address)
                }).catch(error => {
                    alert(error)
                });
            });
        } else {
            console.log("ERROR FIXME Pls");
        }
    });
});

