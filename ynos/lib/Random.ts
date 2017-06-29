export default class Random {
  randseed: Array<number>

  constructor (seed?: string) {
    if (!seed) {
      seed = Math.floor((Math.random()*Math.pow(10,16))).toString(16)
    }
    let randseed = [0, 0, 0, 0]
    for (let i = 0; i < seed.length; i++) {
      randseed[i%4] = ((randseed[i%4] << 5) - randseed[i%4]) + seed.charCodeAt(i)
    }
    this.randseed = randseed
  }

  // based on Java's String.hashCode(), expanded to 4 32bit values
  nextNumber (): number {
    let t = this.randseed[0] ^ (this.randseed[0] << 11)

    this.randseed[0] = this.randseed[1]
    this.randseed[1] = this.randseed[2]
    this.randseed[2] = this.randseed[3]
    this.randseed[3] = (this.randseed[3] ^ (this.randseed[3] >> 19) ^ t ^ (t >> 8))

    return (this.randseed[3]>>>0) / ((1 << 31)>>>0)
  }
}
