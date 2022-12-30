const esbuild = require('esbuild')
const fs = require('fs')
const http = require('http')

const PUBLIC_DIR = './public'
const DIST_DIR = './dist'
const PORT = 3000
const ESBUILD_CONFIG = {
  entryPoints: ['./src/index.tsx'],
  bundle: true,
  outdir: `${PUBLIC_DIR}/assets`,
  publicPath: '/assets',
  loader: {
    '.png': 'file',
    '.jpg': 'file',
    '.gif': 'file',
    '.svg': 'file'
  }
}
let CLIENTS = []

const serve = () => {
  esbuild
    .build({
      ...ESBUILD_CONFIG,
      write: false,
      watch: {
        onRebuild(error, result) {
          console.clear()
          if (error) {
            console.log({ error })
          }
          if (CLIENTS.length > 0) {
            CLIENTS
              .forEach((res) => res.write('data: Rebuild event!\n\n'))
          }
          console.log('[Rebuild]')
        },
      },
    })
    .catch(() => process.exit(1))

  esbuild
    .serve(
      { servedir: PUBLIC_DIR },
      {
        ...ESBUILD_CONFIG,
        banner: {
          js: '// Self executing function\n (() => { console.log("Event Source Starting..."); \nconst es = new EventSource("/esbuild"); es.addEventListener("message", () => window.location.reload()) })();',
        },
      }
    )
    .then((result) => {
      const { host, port } = result

      http
        .createServer((req, res) => {
          const { url, method, headers } = req

          if (url.startsWith('/esbuild')) {
            return CLIENTS.push(res.writeHead(200, {
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              'Connection': 'keep-alive'
            }))
          }

          const isFile = url.split('/').pop().indexOf('.') !== -1

          const path = isFile ? url : '/index.html'

          req.pipe(
            http.request(
              { hostname: host, port, path, method, headers },
              (proxyRes) => {
                res.writeHead(
                  proxyRes.statusCode,
                  proxyRes.headers
                )
                proxyRes.pipe(res, { end: true })
              },
            ),
            { end: true },
          )
        })
        .listen(PORT)
    })
    .then(() => console.log(`Listening on port: http://localhost:${PORT}`))
}


const build = () => {
  if (!fs.existsSync(DIST_DIR)) {
    fs.mkdir(DIST_DIR, (err) => {
      if (err) throw err
      console.log(`${DIST_DIR} created.`)
    })
  } else {
    console.log(`${DIST_DIR} already exists.`)
  }

  // Build our files
  esbuild
    .build({
      ...ESBUILD_CONFIG,
      outdir: `${DIST_DIR}/assets`,
      minify: true,
      write: true,
    })
    .then(() => {
      // Copy over index.html
      fs.copyFile(
        `${PUBLIC_DIR}/index.html`,
        `${DIST_DIR}/index.html`,
        (err) => {
          if (err) throw err
          console.log(`${DIST_DIR}/index.html: copied.`)
        },
      )
    })
}

const init = () => {
  if (process.argv.includes('--serve')) {
    serve()
  } else {
    build()
  }
}

init()
