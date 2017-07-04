import {YnosWindow} from "../ynos/YnosWindow";

let _window = (<YnosWindow>window);

window.addEventListener("load", function () {
    _window.ynos.initFrame().then(() => {
        let activateButton = document.getElementById('activate');
        if (activateButton) {
            let button: HTMLElement = activateButton
            button.setAttribute("disabled", "disabled")
            _window.ynos.initAccount().then(() => {
                button.removeAttribute("disabled")
                button.addEventListener('click', function () {
                    _window.ynos.getAccount().then((address: string)=> {
                        console.log(address)
                        alert(address)
                    }).catch(error => {
                        alert(error)
                    });
                });
            })
        }
    });
});

