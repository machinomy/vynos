import {YnosWindow} from "../ynos/YnosWindow";
import {error} from "util";

let _window = (<YnosWindow>window);

window.addEventListener("load", function () {
    _window.ynos.initFrame().then(() => {
        let activateButton = document.getElementById('activate');
        if (activateButton) {
            activateButton.addEventListener('click', function () {
                _window.ynos.initFrame().then(() => {
                    return _window.ynos.getAccount();
                }).then(address => {
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

