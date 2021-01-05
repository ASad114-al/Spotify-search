const express = require('express');
const app =express()
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.static('public'))
const PORT = process.env.PORT ||5003

const SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').config()


const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET

    // Client ID 83acc30a06604ac9aca7db9bbca20b1e
    //Client Secret d6c161081e6140949afe70939e5ba888
 
});
console.log(process.env.CLIENT_ID)


spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


app.get("/", (req, res) => {
    res.render("index")
})

app.get('/artist-search', (req, res) => {
    spotifyApi
        .searchArtists(req.query.artistName)
        .then((data) => {
            //  console.log( data.body.items);
            
             console.log(data.body.artists.items);
            res.render('artist-search-results', { artistData: data.body.artists.items })
        })
        .catch((err) =>
            console.log('The error while searching artists occurred: ', err)
        );
});

app.get('/albums/:id', (req, res) => {
    spotifyApi.getArtistAlbums(req.params.id).then(
        (data) => {
            console.log('Artist albums', data.body);
            res.render("albums", { albumsData: data.body.items })
        },
        (err) => {
            console.error(err);
        }
    );
})
app.get('/tracks/:id', (req, res) => {
    spotifyApi.getAlbumTracks(req.params.id).then(
         (data) =>{
            console.log('tracks', data.body);
            res.render('tracks', { tracksData: data.body.items})
        }, 
         (err) =>{
            console.log('Something went wrong!', err);
        });
})











app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));