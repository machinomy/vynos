declare module "material-ui" {

}

declare module "material-ui/RaisedButton" {
  export default class RaisedButton extends React.Component<any, any> {}
}

declare module "material-ui/IconButton" {
  export default class IconButton extends React.Component<any, any> {}
}

declare module "material-ui/FlatButton" {
  export default class FlatButton extends React.Component<any, any> {}
}

declare module "material-ui/List" {
  export class List extends React.Component<any, any> {}
  export class ListItem extends React.Component<any, any> {}
}

declare module "material-ui/TextField" {
  export default class TextField extends React.Component<any, any> {}
}

declare module "material-ui/styles/MuiThemeProvider" {
  export default class MuiThemeProvider extends React.Component<any, any>{}
}

declare module "material-ui/styles/getMuiTheme" {
  export default function getMuiTheme(theme: any): any
}

declare module 'material-ui-image';