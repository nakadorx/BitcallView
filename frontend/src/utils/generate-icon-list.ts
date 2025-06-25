const fs = require('fs')
const rimIcons = require('@iconify/json/json/ri.json')

const iconNames = Object.keys(rimIcons.icons).map(name => `ri:${name}`)

fs.writeFileSync('./src/assets/iconify-icons/bundled-icons.json', JSON.stringify(iconNames, null, 2))

console.log(`✅ Generated ${iconNames.length} Remix icon names.`)
