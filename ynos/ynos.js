"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FrameStream_1 = require("./lib/FrameStream");
var StreamProvider_1 = require("./lib/StreamProvider");
var eth_1 = require("./lib/rpc/eth");
var yns_1 = require("./lib/rpc/yns");
var web3_1 = require("web3");
var _window = window;
function buildFrame() {
    var frame = document.createElement('iframe');
    frame.id = 'ynos_frame';
    frame.src = _window.FRAME_URL;
    frame.style.borderWidth = '0px';
    frame.style.position = 'fixed';
    frame.style.top = '0px';
    frame.style.right = '0px';
    frame.style.bottom = '0px';
    frame.height = '100%';
    frame.width = '320px';
    //frame.style.marginRight = '-320px';
    frame.setAttribute("sandbox", "allow-scripts allow-modals allow-same-origin allow-popups allow-forms");
    return frame;
}
var YnosClient = (function () {
    function YnosClient(stream) {
        this.streamProvider = new StreamProvider_1.default("YnosClient");
        this.streamProvider.pipe(stream).pipe(this.streamProvider);
    }
    YnosClient.prototype.getAccount = function () {
        var request = new eth_1.AccountsRequest();
        return this.streamProvider.ask(request).then(function (response) {
            return response.result[0];
        });
    };
    YnosClient.prototype.initAccount = function () {
        var request = new yns_1.InitAccountRequest();
        return this.streamProvider.ask(request).then(function (response) {
            return response.result[0];
        });
    };
    YnosClient.prototype.getWeb3 = function () {
        var web3 = new web3_1.default();
        web3.setProvider(this.streamProvider);
        return web3;
    };
    return YnosClient;
}());
var YnosImpl = (function () {
    function YnosImpl() {
    }
    YnosImpl.prototype.getAccount = function () {
        return this.client.getAccount();
    };
    YnosImpl.prototype.openChannel = function () {
    };
    YnosImpl.prototype.closeChannel = function () {
    };
    YnosImpl.prototype.listChannels = function () {
    };
    YnosImpl.prototype.makePayment = function () {
    };
    YnosImpl.prototype.payInChannel = function () {
    };
    YnosImpl.prototype.depositToChannel = function () {
    };
    YnosImpl.prototype.initAccount = function () {
        if (!this.client)
            return Promise.reject(new Error("Do initFrame first"));
        return this.client.initAccount();
    };
    YnosImpl.prototype.initFrame = function () {
        var _this = this;
        if (this.frame)
            return Promise.resolve();
        return new Promise(function (resolve, reject) {
            try {
                _this.frame = buildFrame();
                _this.stream = new FrameStream_1.default("ynos").toFrame(_this.frame);
                _this.client = new YnosClient(_this.stream);
                document.body.appendChild(_this.frame);
                resolve();
            }
            catch (e) {
                reject(e);
            }
        });
    };
    YnosImpl.prototype.getWeb3 = function () {
        if (!this.client)
            return Promise.reject(new Error("Do initFrame first"));
        return Promise.resolve(this.client.getWeb3());
    };
    return YnosImpl;
}());
var ynosPresent = _window.ynos && _window.ynos instanceof YnosImpl;
if (!ynosPresent) {
    _window.ynos = new YnosImpl();
}
