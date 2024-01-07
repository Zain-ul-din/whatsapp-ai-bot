import { extendTheme } from '@chakra-ui/react'

// colors ref
// https://github.com/sdras/night-owl-vscode-theme/issues/70
// #011627 Background
// #d6deeb Foreground
// #01111d Current Line
// #1d3b53 Selection
// #80a4c2 Cursor
// #4b6479 Line Number
// #c5e4fd Current Line Number
// #7fdbca Tags/Keywords
// #637777 Comment
// #ef5350 Red
// #22da6e Green
// #addb67 Yellow
// #82aaff Blue
// #f78c6c Orange
// #c792ea Magenta
// #21c7a8 Cyan
// #ffffff White
// #575656 Bright Black

const colors = {
  gray: {
    '200': '#122d42',
    '300': '#575656',
    '700': '#011627',
    '800': '#011627',
  }
}

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const theme = extendTheme({ config, colors })
export default theme
