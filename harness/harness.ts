import * as Web3 from 'web3'
import VynosBuyResponse from '../vynos/lib/VynosBuyResponse'
import { WalletBuyArguments } from '../vynos/lib/Vynos'
import { BuyProcessEvent } from '../vynos/lib/rpc/buyProcessEventBroadcast'
import { ChannelMeta } from '../vynos/lib/storage/ChannelMetaStorage'
import IWalletWindow from '../vynos/lib/IWalletWindow'

let _window = window as IWalletWindow

let recentBuyResponse: VynosBuyResponse | null = null
let gateway = 'http://127.0.0.1:3001/v1/accept'

function updateRecentVynosBuyResponse (buyResponse: VynosBuyResponse) {
  recentBuyResponse = buyResponse
  let channelCode = document.getElementById('payment-channel-code')
  let tokenCode = document.getElementById('payment-token-code')
  if (channelCode) {
    channelCode.textContent = 'channelId: ' + JSON.stringify(buyResponse.channelId)
  }
  if (tokenCode) {
    tokenCode.textContent = 'token: ' + JSON.stringify(buyResponse.token)
  }
}

// _window.send = async (value) => {
//   let eth = 0.01
//   if (value) {
//     eth = value
//   }
//   let vynos = _window.vynos
//   let wallet = await vynos.ready()
//   let web3 = new Web3(wallet.provider)
//   let account = await wallet.getAccount()
//   console.log(account)
//   web3.eth.sendTransaction({ from: account, to: '0x5bf66080c92b81173f470e25f9a12fc146278429', value: web3.toWei(eth, 'ether') }, (err, txid) => {
//     console.log(err)
//     console.log(txid)
//   })
// }

let signMessage = function (message: string) {
  if (message === undefined || message === null) {
    message = ''
  }
  let vynos = _window.vynos
  vynos.ready().then((wallet) => {
    let web3 = new Web3(wallet.provider)
    web3.eth.getAccounts((err, accounts) => {
      if (err) {
        if (err.message === 'invalid address') {
          console.error('Please, login into Vynos.')
        }
        console.error(err)
      } else {
        web3.eth.sign(accounts[0], web3.sha3(message), (err, res) => {
          if (err) {
            console.error(err)
          }
          if (res) {
            console.log(res)
          }
        })
      }
    })
  })
}

window.addEventListener('load', function () {
  let vynos = _window.vynos

  vynos.ready().then(instance => {
    let provider = instance.provider
    let web3 = new Web3(provider)
    web3.eth.getAccounts((err, accounts) => {
      console.log(accounts)
    })
  })

  let displayButton = document.getElementById('display')
  if (displayButton) {
    displayButton.onclick = () => {
      vynos.display()
    }
  }

  /*
  ynos.initFrame().then(() => {
    return ynos.initAccount()
  }).then(() => {
    return ynos.getAccount()
  }).then(address => {
    let span = document.getElementById('account_address')
    if (span) {
      let p = span
      let a = document.createElement('a')
      a.href = 'https://ropsten.etherscan.io/address/' + address.replace(/0x/, '')
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
  */

  let openChannelForm = document.getElementById('open_channel')
  if (openChannelForm) {
    openChannelForm.onsubmit = function (ev: Event) {
      ev.preventDefault()
      vynos.ready().then((wallet) => {
        let web3 = new Web3(wallet.provider)

        let receiverAccount = ''
        let receiverInput = document.getElementById('receiver_address')
        if (receiverInput) {
          receiverAccount = (receiverInput as HTMLInputElement).value
        }
        console.log(receiverAccount)
        let amount = web3.toWei(0.0001, 'ether')
        let resultSpan = document.getElementById('open_channel_id')
        if (resultSpan) {
          resultSpan.textContent = 'Loading...'
        }
        wallet.buyPromised(receiverAccount!, parseInt(amount, 10), gateway, Date.now().toString())
        .on(BuyProcessEvent.SENT_PAYMENT, (args: WalletBuyArguments) => {
          console.log('PAYMENT WAS SENT!')
        }).on(BuyProcessEvent.RECEIVED_TOKEN, (args: WalletBuyArguments, token: string) => {
          console.log('Token is ' + token)
        }).on(BuyProcessEvent.OPENING_CHANNEL_FINISHED, (args: WalletBuyArguments, channel: ChannelMeta) => {
          console.log('Channel meta: ')
          console.log(channel)
        }).result.then((buyResponse: VynosBuyResponse) => {
          console.log(buyResponse)
          updateRecentVynosBuyResponse(buyResponse)
          let resultSpan = document.getElementById('open_channel_id')
          if (resultSpan) {
            resultSpan.textContent = recentBuyResponse!.channelId
          }
        })
      })
    }
  }

  let closeChannelForm = document.getElementById('close_channel')
  if (closeChannelForm) {
    closeChannelForm.onsubmit = function (ev: Event) {
      ev.preventDefault()
      vynos.ready().then((wallet) => {
        if (recentBuyResponse) {
          wallet.closeChannel(recentBuyResponse!.channelId).then(() => {
            console.log('Closing channel:')
            console.log(recentBuyResponse!.channelId)
            let resultSpan = document.getElementById('open_channel_id')
            if (resultSpan) {
              resultSpan.textContent = 'n/a'
            }
          })
        }
      })
    }
  }
/*
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
  let signMessageForm = document.getElementById('sign_message_form')
  if (signMessageForm) {
    signMessageForm.onsubmit = function (ev: Event) {
      ev.preventDefault()
      let messageElement = document.getElementById('sign_message_input') as HTMLInputElement
      if (messageElement) {
        signMessage(messageElement.value)
      }
    }
  }
})
