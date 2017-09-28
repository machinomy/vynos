import {VynosWindow} from "../vynos/window";
import {PaymentChannel} from "machinomy/lib/channel";
import {inspect} from "util";

let _window = (window as VynosWindow);

/*
let recentPaymentChannel: PaymentChannel|null = null

function updateRecentPaymentChannel(channel: PaymentChannel) {
  recentPaymentChannel = channel
  let code = document.getElementById("payment-channel-code")
  if (code) {
    code.textContent = JSON.stringify(channel.toJSON())
  }
}
*/

window.addEventListener("load", function () {
  let vynos = _window.vynos

  let customFrame = document.getElementById('custom_frame')
  if (customFrame) {
    vynos.init(customFrame as HTMLIFrameElement)
  }

  vynos.ready().then(wallet => {
    console.log('ffffffffffffffffffffffffffffffff')
    console.log(wallet)
  })

  /*
  ynos.initFrame().then(() => {
    return ynos.initAccount()
  }).then(() => {
    return ynos.getAccount()
  }).then(address => {
    let span = document.getElementById("account_address")
    if (span) {
      let p = span
      let a = document.createElement("a")
      a.href = "https://ropsten.etherscan.io/address/" + address.replace(/0x/, '')
      a.text = address
      let arr: Array<HTMLElement> = [].slice.call(p.childNodes);
      arr.forEach(element => {
        p.removeChild(element)
      })
      p.appendChild(a)
    }
  }).catch(error => {
    console.log(error)
  })

  let openChannelForm = document.getElementById("open_channel")
  if (openChannelForm) {
    openChannelForm.onsubmit = function (ev: Event) {
      ev.preventDefault()
      ynos.initFrame().then(() => {
        return ynos.initAccount()
      }).then(() => {
        ynos.getWeb3().then(web3 => {
          let receiverAccount = "0xD5173D09C0567bad2B747cABB54E6BB013077d02"
          let receiverInput = document.getElementById("receiver_address")
          if (receiverInput) {
            receiverAccount = (receiverInput as HTMLInputElement).value || receiverAccount
          }
          console.log(receiverAccount)
          let amount = web3.toWei(0.01, "ether")
          let resultSpan = document.getElementById("open_channel_id")
          if (resultSpan) {
            resultSpan.textContent = "Loading..."
          }
          ynos.openChannel(receiverAccount, amount).then((paymentChannel: PaymentChannel) => {
            console.log(paymentChannel)
            updateRecentPaymentChannel(paymentChannel)
            let resultSpan = document.getElementById("open_channel_id")
            if (resultSpan) {
              resultSpan.textContent = paymentChannel.channelId + ", state: " + paymentChannel.state
            }
          })
        })
      })
    }
  }

  let closeChannelForm = document.getElementById("close_channel")
  if (closeChannelForm) {
    closeChannelForm.onsubmit = function (ev: Event) {
      ev.preventDefault()
      ynos.initFrame().then(() => {
        return ynos.initAccount()
      }).then(() => {
        if (recentPaymentChannel) {
          ynos.closeChannel(recentPaymentChannel).then((paymentChannel: PaymentChannel) => {
            console.log(paymentChannel)
            updateRecentPaymentChannel(paymentChannel)
            let resultSpan = document.getElementById("open_channel_id")
            if (resultSpan) {
              resultSpan.textContent = paymentChannel.channelId + ", state: " + paymentChannel.state
            }
          })
        }
      })
    }
  }

  let finishSettleForm = document.getElementById("finish_settle")
  if (finishSettleForm) {
    finishSettleForm.onsubmit = function (ev: Event) {
      ev.preventDefault()
      ynos.initFrame().then(() => {
        return ynos.initAccount()
      }).then(() => {
        if (recentPaymentChannel) {
          ynos.closeChannel(recentPaymentChannel).then((paymentChannel: PaymentChannel) => {
            console.log(paymentChannel)
            updateRecentPaymentChannel(paymentChannel)
            let resultSpan = document.getElementById("open_channel_id")
            if (resultSpan) {
              resultSpan.textContent = paymentChannel.channelId + ", state: " + paymentChannel.state
            }
          })
        }
      })
    }
  }

  let paymentForm = document.getElementById("pay_in_channel")
  if (paymentForm) {
    paymentForm.onsubmit = function (ev: Event) {
      ev.preventDefault()
      ynos.initFrame().then(() => {
        return ynos.initAccount()
      }).then(() => {
        return ynos.getWeb3()
      }).then(web3 => {
        if (recentPaymentChannel) {
          let amountElement = document.getElementById("payment-amount") as HTMLInputElement
          if (amountElement) {
            let amountEth = parseFloat(amountElement.value)
            let amount = parseInt(web3.toWei(amountEth, "ether").toString())
            ynos.payInChannel(recentPaymentChannel, amount).then(({channel, payment}) => {
              updateRecentPaymentChannel(channel)
              let paymentCode = document.getElementById("payment-code")
              if (paymentCode) {
                paymentCode.textContent = JSON.stringify(payment)
              }
            })
          }
        }
      })
    }
  }
  */
})

