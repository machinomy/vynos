declare module "material-ui" {

}

declare module "material-ui/styles/MuiThemeProvider" {
  export default class MuiThemeProvider extends React.Component<any, any>{}
}

declare module "material-ui/styles/getMuiTheme" {
  export default function getMuiTheme(theme: any): any
}
