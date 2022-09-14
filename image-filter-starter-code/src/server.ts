import bodyParser from 'body-parser';
import express, { Router, Request, Response } from 'express';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try search this url/filteredimage?image_url={{}}")
  } );
  
  // endpoint to filter an image from a public url.
  // REQUEST
  //   GET /filteredimage?image_url={{URL}}
  // RESPONSE
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]
  app.get("/filteredimage/", 
    async (req: Request, res: Response) => {
      let { image_url } = req.query;

      // validate the image_url query
      if ( !image_url ) {
        return res.status(400)
          .send(`image_url is required`);
      }

      try {
        let filteredpath = await filterImageFromURL(image_url);
        return res.status(200).sendFile(filteredpath, () => {
          deleteLocalFiles([filteredpath])
        });
      } catch (error) {
        console.log(error)
        return res.status(400).send('unable to filter content at image_url')
      }
  });

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();