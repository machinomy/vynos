import {YnosWindow} from "../ynos/YnosWindow";
import PaymentChannel from "../ynos/lib/PaymentChannel";

let _window = (<YnosWindow>window);

window.addEventListener("load", function () {
    let ynos = _window.ynos
    ynos.initFrame().then(() => {
        let activateButton = document.getElementById('activate');
        if (activateButton) {
            let button: HTMLElement = activateButton
            button.setAttribute("disabled", "disabled")
            ynos.initAccount().then(() => {
                button.removeAttribute("disabled")
                button.addEventListener('click', function () {
                    ynos.getAccount().then((address: string)=> {
                        console.log(address)
                        ynos.getWeb3().then(web3 => {
                            let receiverAccount = "0xD5173D09C0567bad2B747cABB54E6BB013077d02"
                            let amount = web3.toWei(0.01, "ether")
                            ynos.openChannel(receiverAccount, amount).then((paymentChannel: PaymentChannel) => {
                                console.log(paymentChannel)
                            })
                        })
                    }).catch(error => {
                        alert(error)
                    });
                });
            })
        }
    });
});

