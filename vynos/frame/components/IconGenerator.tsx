import * as React from 'react'
import * as jdenticon from 'jdenticon'

export interface IconGeneratorProps {
  id: string
  size: number
  classDiv?: string
  classCanvas?: string
  data: string
}

export class IconGenerator extends React.Component<IconGeneratorProps, {}> {
  constructor (props: IconGeneratorProps) {
    super(props)
  }

  render () {
    jdenticon.update(`#${this.props.id}`, this.props.data)
    return (
      <div className={this.props.classDiv || 'ui mini'}>
        <canvas className={this.props.classCanvas || 'ui mini'} id={this.props.id} width={this.props.size} height={this.props.size} data-jdenticon-value={this.props.data} />
      </div>
    )
  }
}
