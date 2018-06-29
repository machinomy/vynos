// tslint:disable-next-line:no-unused-variable
import * as React from 'react'
import { List, Image } from 'semantic-ui-react'
import Web3 = require('web3')
import ChannelMetaStorage from '../../../../lib/storage/ChannelMetaStorage'
import { connect } from 'react-redux'
import { FrameState } from '../../../redux/FrameState'
import { isUndefined } from 'util'
import WorkerProxy from '../../../WorkerProxy'

const style = require('../../../styles/ynos.css')

export interface ChannelsSubpageProps {
  lastUpdateDb?: number,
  web3?: Web3
  workerProxy?: WorkerProxy
}

export interface ChannelsSubpageState {
  channels: any,
  activeChannel: string
}

export class ChannelsSubpage extends React.Component<ChannelsSubpageProps, ChannelsSubpageState> {
  channelMetaStorage: ChannelMetaStorage
  localLastUpdateDb: number

  constructor (props?: ChannelsSubpageProps | undefined, context?: any) {
    super(props!, context)
    this.state = {
      channels: [],
      activeChannel: ''
    }
    this.channelMetaStorage = new ChannelMetaStorage()
    this.localLastUpdateDb = props!.lastUpdateDb!
  }

  componentDidMount () {
    this.updateListChannels({})
  }

  shouldComponentUpdate (nextProps: ChannelsSubpageProps) {
    if (this.localLastUpdateDb < nextProps.lastUpdateDb!) {
      this.localLastUpdateDb = nextProps.lastUpdateDb!
      this.updateListChannels({})
      return false
    }
    return true
  }

  closeChannelId (channel: any) {
    this.props.workerProxy!.closeChannel(channel.channelId).then(() => {
      this.channelMetaStorage.setClosingTime(channel.channelId, Date.now()).then(() => {
        let change: any = {}
        change[channel.channelId] = {
          state: channel.state === 0 ? 1 : 2
        }
        this.setActiveChannel(channel.channelId)
        this.updateListChannels(change)
      })
    })
  }

  updateListChannels (change: any) {
    this.props.workerProxy!.listChannels().then(channels => {
      let balanceByChannelId: any = {}
      let stateByChannelId: any = {}
      let channelIds = channels.map((channel: any) => {
        balanceByChannelId[channel.channelId.toString()] = channel.value - channel.spent
        stateByChannelId[channel.channelId.toString()] = channel.state
        return channel.channelId.toString()
      })
      this.channelMetaStorage.findByIds(channelIds).then((metaChannels: any) => {
        metaChannels.map((channel: any) => {
          if (!isUndefined(balanceByChannelId[channel.channelId])) {
            channel.balance = balanceByChannelId[channel.channelId]
          }
          if (!isUndefined(stateByChannelId[channel.channelId])) {
            channel.state = stateByChannelId[channel.channelId]
          }
          if (change[channel.channelId]) {
            for (let key in change[channel.channelId]) {
              channel[key] = change[channel.channelId][key]
            }
          }
          channel.canClose = true // FIXME
          return channel
        })
        this.setState({
          channels: metaChannels
        })
      })
    })
  }

  getIcon (channel: any) {
    return <Image avatar={true} src={channel.icon} size="mini"/>
  }

  setActiveChannel (channelId: string) {
    let activeChannel = channelId === this.state.activeChannel ? '' : channelId
    this.setState({ activeChannel: activeChannel })
  }

  render () {
    let className = style.listWrap + ' ' + style.scrollbarContainer
    return (
      <List
        className={className}
        divided={true}
        verticalAlign="middle"
        style={{ margin: 0 }}
      >
      {this.state.channels.map((channel: any) => {
        let isActiveChannel = (channel.channelId === this.state.activeChannel && channel.state === 0)
        let itemId = isActiveChannel ? style.activeChannel : (channel.state === 1 ? style.closedChannel : '')
        let styleItem = (channel.state === 1 || isActiveChannel) ? {} : { cursor: 'pointer' }
        let clickItem = !isActiveChannel ? this.setActiveChannel.bind(this, channel.channelId) : null
        let styleHeader = channel.state === 0 ? { cursor: 'pointer' } : {}
        let clickHeader = isActiveChannel ? this.setActiveChannel.bind(this, channel.channelId) : null

        return (channel.state <= 1) &&
          <List.Item
            style={styleItem}
            className={style.listItem}
            id={itemId}
            key={channel.channelId}
            onClick={clickItem}
          >
              <List.Content floated="right">
                <span className={style.channelBalance}>{channel.balance}</span>
              </List.Content>
              {this.getIcon(channel)}
              <List.Content className={style.listContent}>
                <List.Header
                  className={style.listHeader}
                  style={styleHeader}
                  onClick={clickHeader}
                >
                  {channel.title}
                </List.Header>
                <List.Description className={style.listDesc}>{channel.desc}</List.Description>
                <List.Description
                  id={((isActiveChannel || (channel.state === 1 && channel.canClose)) ? style.buttonsActiveChannel : '')}
                  style={{ display: 'none' }}
                >
                  <a onClick={this.closeChannelId.bind(this, channel)}>CLOSE</a>
                </List.Description>
              </List.Content>
          </List.Item>
      })}
      </List>
    )
  }
}

function mapStateToProps (state: FrameState, ownProps: ChannelsSubpageProps): ChannelsSubpageProps {
  return {
    lastUpdateDb: state.shared.lastUpdateDb,
    web3: state.temp.workerProxy.web3,
    workerProxy: state.temp.workerProxy
  }
}

export default connect(mapStateToProps)(ChannelsSubpage)
