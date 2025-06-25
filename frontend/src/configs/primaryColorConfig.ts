export type PrimaryColorConfig = {
  name?: PrimaryColorNames
  light?: string
  main: string
  dark?: string
}

// PS: always manual add names
export enum PrimaryColorNames {
  green = 'green',
  blue = 'blue',
  orange = 'orange',
  red = 'red',
  test = 'test'
}

const primaryColorConfig: PrimaryColorConfig[] = [
  {
    name: PrimaryColorNames.green,
    light: '#06b999',
    main: '#06b999',
    dark: '#06b999'
  },
  {
    name: PrimaryColorNames.blue,
    light: '#3c82f5',
    main: '#3c82f5',
    dark: '#2c63c0'
  },
  {
    name: PrimaryColorNames.orange,
    light: '#FFA95A',
    main: '#FF891D',
    dark: '#BA6415'
  },
  {
    name: PrimaryColorNames.red,
    light: '#F07179',
    main: '#EB3D47',
    dark: '#AC2D34'
  },
  {
    name: PrimaryColorNames.test,
    light: '#49CCB5',
    main: '#06B999',
    dark: '#048770'
  }
]

export default primaryColorConfig
