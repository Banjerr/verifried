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
      file = __dirname + '/public/images/mmur/m7.png';
  }

  Tesseract.recognize(file)
    .progress(function (p) { 
console.log('progress', p) 
    })
    .catch(err => console.error(err))
    .then(function (result) {
console.log(result.text)
      process.exit(0)
    });
};

const provision = async () => {

  await server.register(Inert);

  server.route(
    // {
    //   method: 'GET',
    //   path: '/home/{param*}',
    //   handler: {
    //     directory: {
    //       path: '.',
    //       redirectToSlash: true,
    //       index: true,
    //     }
    //   }
    // },
    // {
    //   method: 'GET',
    //   path: '/view/{file*}',
    //   handler: {
    //     directory: {
    //       path: 'upload'
    //     }
    //   }
    // },
    {
      path: '/upload',
      method: 'POST',
      options: {
        payload: {
          output: 'stream',
          parse: true
        },
        handler: async (req, h) => {
console.log(req.payload);

          doSomeOCR();

          return h.response('req.payload');
        }
      }     
    }
  );

  await server.start();

  console.log('Server running at:', server.info.uri);
};

provision();