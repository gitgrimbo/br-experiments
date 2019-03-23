/*

Call from the command line with one or more glob patterns, and one or more sizes.

E.g.

node experiments/cli/resize-images.js 'experiments/img/logos/logo.*.+(png|jpg)' size=128,128 size=64,64

*/

const path = require("path");
const sharp = require("sharp");
const { promisify } = require("util");
const glob = promisify(require("glob"));

async function resizeSingle({
  srcPath,
  nameSupplier,
  sizes,
  fit = "cover",
}) {
  for (const size of sizes) {
    const sh = sharp(srcPath);
    const destPath = nameSupplier(srcPath, size);
    const { width, height } = size;
    console.log(srcPath, destPath, width, height, fit);
    await sh.resize(width, height, {
      fit,
    });
    await sh.toFile(destPath);
  }
}

async function resize({
  globPatterns,
  nameSupplier,
  resizePredicate,
  sizes,
}) {
  sharp.cache(false);

  for (const globPattern of globPatterns) {
    console.log(globPattern);
    const files = await glob(globPattern, {
      absolute: true,
    });

    for (const file of files) {
      const shouldResize = resizePredicate && resizePredicate(file);
      console.log(shouldResize, file);
      if (shouldResize) {
        await resizeSingle({
          srcPath: file,
          nameSupplier,
          sizes,
        });
      }
    }
  }
}

function error(msg) {
  throw new Error(`${msg}

args can contain multiple 'glob patterns' or size options.
A size option is of the form "size=w,h" where w=width and h=height.

E.g.

/path/to/file1.jpg /path/to/*.png size=100,100 size=50,50
`);
}

function parseArgs(args) {
  if (!args || args.length < 1) {
    error("Expected at least one arg");
  }
  const initial = {
    globPatterns: [],
    sizes: [],
  };
  return args.reduce((ctx, arg) => {
    const { globPatterns, sizes } = ctx;
    if (arg.startsWith("size=")) {
      const [_, sizeStr] = arg.split("size=");
      const [width, height] = sizeStr.split(",");
      sizes.push({
        width: Number(width.trim()),
        height: Number(height.trim()),
      });
    } else {
      globPatterns.push(path.resolve(arg));
    }
    return { globPatterns, sizes };
  }, initial);
}

async function main(globPatterns, sizes) {
  if (globPatterns.length < 1) {
    error("No glob patterns provided. Nothing to do!");
  }
  if (sizes.length < 1) {
    error("No sizes provided. Nothing to do!");
  }

  const resizePredicate = (originalPath) => originalPath.indexOf(".resized") < 0;

  const nameSupplier = (originalPath, { width, height }) => {
    const parsed = path.parse(originalPath);
    // add "resized" to the name so we can identify a resized image.
    return path.resolve(parsed.dir, parsed.name + `.${width}x${height}` + ".resized" + parsed.ext);
  };

  await resize({
    globPatterns,
    resizePredicate,
    nameSupplier,
    sizes,
  });
}

const { globPatterns, sizes } = parseArgs(process.argv.slice(2));
main(globPatterns, sizes)
  .catch((err) => console.error(err));
