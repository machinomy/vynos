import * as React from "react";
import Random from "../../lib/Random";
import _ = require("lodash")

export function stringToColor(string: string): null|string {
  if (_.isEmpty(string)) {
    return null
  } else {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let colour = '#';
    for (let i = 0; i < 3; i++) {
      let value = (hash >> (i * 8)) & 0xFF;
      colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
  }
}

export function randomColor (random: Random): string {
  let rand = random.nextNumber
  //saturation is the whole color spectrum
  let h = Math.floor(rand() * 360)
  //saturation goes from 40 to 100, it avoids greyish colors
  let s = ((rand() * 60) + 40) + '%'
  //lightness can be anything from 0 to 100, but probabilities are a bell curve around 50%
  let l = ((rand()+rand()+rand()+rand()) * 25) + '%'

  return 'hsl(' + h + ',' + s + ',' + l + ')'
}

export interface BlockieComponentProps {
  size?: number
  scale?: number
  seed?: string
  color?: string
  backgroundColor?: string
  spotColor?: string
  style?: any
  classDiv?: any
  classCanvas?: any
}

export default class BlockieComponent extends React.Component<BlockieComponentProps, {}> {
  size: number
  scale: number
  random: Random
  seed: string
  canvasSize: number

  constructor (props: BlockieComponentProps) {
    super(props)
    this.size = this.props.size || 8
    this.scale = this.props.scale || 4

    this.seed = this.props.seed || Math.floor((Math.random()*Math.pow(10,16))).toString(16)
    this.random = new Random(this.seed)

    this.canvasSize = this.size * this.scale
  }

  createImageData (): Array<number> {
    let width = this.size // Only support square icons for now
    let height = this.size

    let dataWidth = Math.ceil(width / 2)
    let mirrorWidth = width - dataWidth

    let data = []
    for(let y = 0; y < height; y++) {
      let row = []
      for(let x = 0; x < dataWidth; x++) {
        // this makes foreground and background color to have a 43% (1/2.3) probability
        // spot color has 13% chance
        row[x] = Math.floor(this.random.nextNumber()*2.3)
      }
      let r = row.slice(0, mirrorWidth)
      r.reverse()
      row = row.concat(r)

      for(let i = 0; i < row.length; i++) {
        data.push(row[i])
      }
    }

    return data
  }

  draw () {
    let color = this.props.color || stringToColor(this.seed) || randomColor(this.random)
    let backgroundColor = this.props.backgroundColor || stringToColor(this.seed + 'backgroundColor') || randomColor(this.random)
    let spotColor = this.props.spotColor || stringToColor(this.seed + 'spotColor') || randomColor(this.random)
    let imageData = this.createImageData()

    let canvasElement = this.refs.canvas as HTMLCanvasElement;
    let canvasContext = canvasElement.getContext('2d');
    if (canvasContext) {
      canvasContext.fillStyle = backgroundColor
      canvasContext.fillRect(0, 0, this.canvasSize, this.canvasSize)
      canvasContext.fillStyle = color

      for(let i = 0; i < imageData.length; i++) {
        let row = Math.floor(i / this.size)
        let col = i % this.size
        // if data is 2, choose spot color, if 1 choose foreground
        canvasContext.fillStyle = (imageData[i] === 1) ? color : spotColor

        // if data is 0, leave the background
        if(imageData[i]) {
          canvasContext.fillRect(col * this.scale, row * this.scale, this.scale, this.scale)
        }
      }
    }
  }

  componentDidMount () {
    this.draw()
  }

  render () {
    return <div style={this.props.style} className={this.props.classDiv}>
      <canvas ref="canvas" width={this.canvasSize} height={this.canvasSize} className={this.props.classCanvas} />
    </div>
  }
}
