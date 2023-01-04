// https://kingsleague.pro//wp-json/wp/v2/presidents
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const STATIC_PATH = path.join(process.cwd(), './assets/static/presidents')
const API_URL = 'https://scrapper-js.fmia.workers.dev/static/presidents'
const RAW_PRESIDENTS = await readFile('./db/rawPresindents.json', 'utf8').then(JSON.parse)

const presidents = await Promise.all(RAW_PRESIDENTS.map(async presidentInfo => {
  const { slug: id, title, _links } = presidentInfo
  const { rendered: name } = title
  const { 'wp:attachment': attachment } = _links
  const { href: imageURL } = attachment[0]

  console.log(`Fetching attachment for president ${name}`)

  const responseImageEndpoint = await fetch(imageURL)
  const data = await responseImageEndpoint.json()
  const [imageInfo] = data
  const { guid: { rendered: image } } = imageInfo
  const filename = image.split('/').at(-1)
  const fn = filename.split('.').at(0)
  const fileExtension = filename.split('.').at(-1)

  console.log(`Fetching image for president ${name}`)

  // fect image and save it in the fyle system

  const responseImage = await fetch(image)
  const arrayBuffer = await responseImage.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  console.log(`Saving image for president ${name}`)

  const imageFileName = `${fn}.${fileExtension}`
  await writeFile(`${STATIC_PATH}/${imageFileName}`, buffer)

  console.log(`Image saved for president ${name}`)
  return { id, name, image: `${API_URL}/${filename}`, teamId: 0 }
})
)

await writeFile('./db/presidents.json', JSON.stringify(presidents, null, 2))
