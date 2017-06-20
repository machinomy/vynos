import {YnosWindow} from "../ynos/YnosWindow";

let _window = (<YnosWindow>window);

window.addEventListener("load", function () {
    _window.ynos.initFrame().then(() => {
        let activateButton = document.getElementById('activate');
        if (activateButton) {
            activateButton.addEventListener('click', function () {
                _window.ynos.initFrame().then(() => {
                    return _window.ynos.initAccount();
                }).then(() => {
                    alert('OK')
                });
            });
        } else {
            console.log("ERROR FIXME Pls");
        }
    });
});

