'use strict'

const Path = require('path');
const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
var Tesseract = require('tesseract.js');
const fs = require('fs');

const server = new Hapi.Server({
  port: 3333,
  routes: {
    files: {
      relativeTo: Path.join(__dirname, 'public')
    },
    cors: true
  }
});

const doSomeOCR = function doSomeOCRFn(file) {
  if (!file) {
    // file = __dirname + '/public/images/mmur/m7.png';
console.log('put error here, NO FILE');
  }

  return new Promise((res, rej) => {
    Tesseract.recognize(file)
      .progress(function (p) {
console.log('progress', p)
      })
      .catch(err => rej(err))
      .then(resp => res(resp));
  });
};

const provision = async () => {

  await server.register(Inert);

  server.route(
    {
      path: '/upload',
      method: 'POST',
      options: {
        payload: {
          output: 'stream',
          parse: true
        },
        handler: async (req, h) => {
          const file = req.payload.file;
          const chunks = [];

          return new Promise((res, rej) => {
            file.on('data', function (chunk) {
              chunks.push(chunk);
            });

            file.on('end', function () {
              const fileBuffer = Buffer.concat(chunks);

              doSomeOCR(fileBuffer).then(data => {
console.log('DATA IS ', data.text);
                res(data.text);
              });
            });
          });
        }
      }     
    }
  );

  await server.start();

  console.log('Server running at:', server.info.uri);
};

provision();