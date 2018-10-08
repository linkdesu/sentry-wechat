const request = require('request-promise-native');

class Wechat {

  constructor (corpId, corpSecret, agentId) {
    this.corpId = corpId
    this.corpSecret = corpSecret
    this.agentId = agentId
    this.accessToken = ''
    this.expireAt = new Date()

    this._getAccessToken()
  }

  sendMsg (title, description, options) {
    const { toUser, toParty, toTag, msgUrl, btnText } = options

    return this._shouldRefreshAccessToken().then(() => {
      request({
        method: 'POST',
        url: 'https://qyapi.weixin.qq.com/cgi-bin/message/send',
        qs: {
          access_token: this.accessToken
        },
        body: {
          touser: toUser,
          toparty: toParty,
          tag: toTag,
          msgtype: 'textcard',
          agentid: this.agentId,
          safe: 1,
          textcard: {
            title: title,
            description: description,
            url: msgUrl,
            btntext: btnText
          }
        },
        json: true
      }).then(res => {
        if (res.errcode !== 0) {
          throw new Error(`Wechat API error: ${res.errmsg}`);
        }
      }).catch(err => {
        console.error(err)
      })
    })
  }

  _getAccessToken () {
    return request({
      url: 'https://qyapi.weixin.qq.com/cgi-bin/gettoken',
      qs: {
        corpid: this.corpId,
        corpsecret: this.corpSecret
      },
      json: true
    }).then(res => {
      if (res.errcode !== 0) {
        throw new Error(`Wechat API error: ${res.errmsg}`);
      }
      // console.debug('Get access token:', resp)

      let now = new Date()
      this.accessToken = res.access_token
      this.expireAt = now.setSeconds(now.getSeconds() + res.expires_in)

      return res.access_token;
    }).catch(err => {
      console.error(err)
    })
  }

  _shouldRefreshAccessToken () {
    if (this.expireAt > new Date()) {
      return Promise.resolve(this.accessToken)
    } else {
      return this._getAccessToken()
    }
  }
}

module.exports = Wechat
