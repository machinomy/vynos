import {YnosWindow} from "../ynos/YnosWindow";

let _window = (<YnosWindow>window);

window.addEventListener("load", function () {
    _window.ynos.initFrame().then(() => {
        document.getElementById('activate').addEventListener('click', function () {
            _window.ynos.initFrame().then(() => {
                return _window.ynos.initAccount();
            }).then(() => {
               alert('OK')
            });
        });
    });
});

