const fs = require('fs');

describe('Converter', () => {
  beforeAll(() => {
    const DATE_TO_USE = new Date('2525');
    const OriginalDate = Date;
    global.Date = jest.fn(() => DATE_TO_USE);
    global.Date.UTC = OriginalDate.UTC;
    global.Date.parse = OriginalDate.parse;
    global.Date.now = OriginalDate.now;
  });

  afterAll(() => {
    fs.unlinkSync(`${__dirname}/test-temp/StaticFiles.ino`);
    fs.rmdirSync(`${__dirname}/test-temp`);
  });


  test('Produces the expected output', async () => {
    await require('./converter')({ // eslint-disable-line global-require
      sources: './static',
      indexFile: 'converter.test.html',
      sketchDir: './static/test-temp',
      exclude: [
        'converter.js',
        'converter.test.js',
        'index.js',
      ],
    });

    const result = fs.readFileSync(`${__dirname}/test-temp/StaticFiles.ino`, 'utf8');

    expect(result).toEqual(
      `void static_index (Request &req, Response &res) {
  P(static_index_0) = {
    0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x13, 0xb3, 0xc9,
    0x28, 0xc9, 0xcd, 0xb1, 0xe3, 0xe2, 0xb2, 0xc9, 0x48, 0x4d, 0x4c, 0xb1,
    0xe3, 0x52, 0x50, 0xb0, 0x29, 0xc9, 0x2c, 0xc9, 0x49, 0xb5, 0xf3, 0x48,
    0xcd, 0xc9, 0xc9, 0x57, 0x08, 0xcf, 0x2f, 0xca, 0x49, 0x51, 0xb4, 0xd1,
    0x87, 0x88, 0x71, 0xd9, 0xe8, 0x43, 0x54, 0x71, 0xd9, 0x24, 0xe5, 0xa7,
    0x54, 0x82, 0x54, 0x23, 0x2b, 0x03, 0x4a, 0x43, 0x84, 0x41, 0xea, 0xc0,
    0xa6, 0x02, 0x00, 0xd1, 0xcd, 0xe5, 0xce, 0x5d, 0x00, 0x00, 0x00
  };

  res.set("Content-Type", "text/html; charset=utf-8");
  res.set("Content-Encoding", "gzip");
  res.set("Cache-Control", "no-cache");
  res.set("Content-Length", "83");
  res.set("Last-Modified", "Mon, 01 Jan 2525 00:00:00 GMT");
  res.set("Vary", "Accept-Encoding");

  res.writeP(static_index_0, 83);
}

Router staticFileRouter("/");

Router * staticFiles(){
  staticFileRouter.get("", &static_index);
  return &staticFileRouter;
}`,
    );
  });
});
