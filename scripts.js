$(document).ready(function () {
  $('.popup').hide();
  $('.overlayBg').hide();
  searchLastFM();
  $('.close').on('click', function(){
    $('.popup').hide();
    $('.overlayBg').hide();
  })
  $('#videos').on('click', '.thumbnail', function(){
    $('.popup').show();
    $('.overlayBg').show();
    $('.popup iframe').attr('src', 'https://www.youtube.com/embed/'+$(this).attr('videoId'));
  })
});
function searchLastFM() {
  $.when(
    $.ajax({
      url: "http://ws.audioscrobbler.com/2.0/",
      type: "GET",
      data: {
        method: "artist.getInfo",
        artist: "Jay-Z",
        api_key: "71499159fe5e641e3445d4cb412a7d5a",
        format: "json",
      },
    }).done(function (artist) {
      let header = "";
      let tags = artist.artist.tags.tag;
      let tagOutPut = "";
      if (tags.length > 1) {
        tags.splice(-1);
        for (i = 0; i < tags.length; i++) {
          tagOutPut += `
        <span class="tag">${tags[i].name}</span>
        `;
        }
      } //get tags from bio to show genres for searching and filtering
      header += `
        <h1>${artist.artist.name}</h1>
        `;
      //header section with artist brand info
      $("header").html(`${header} ${tagOutPut}`);
    })
  )
    .then(function () {
      $.ajax({
        url: "http://ws.audioscrobbler.com/2.0/",
        type: "GET",
        data: {
          method: "artist.getTopTracks",
          artist: "Jay-Z",
          api_key: "71499159fe5e641e3445d4cb412a7d5a",
          format: "json",
          limit: 25,
          autocorrect: 1,
        },
      }).done(function (music) {
        let items = music.toptracks;
        let featuredMusic = "";
        let featuredMerchandise = "";
        let hero = `
        <div class="banner-info">
          <h3>
              New single available on streaming platforms </h3>
              <p><a class="large-text" href="#" target="blank" title="${items.track[1].name}">${items.track[1].name}</a></p></div>
              <div class="stats">
                  <p><span> ${items.track[1].playcount}</span> streams since release</p>
                  <p><span> ${items.track[1].listeners}</span> listeners</p>
              </div>

        `;
        $.each(items["track"], function (index, value) {
          featuredMusic += `
              <li>
                  <a href="${value.url}" data-song="song1" target="blank">
                  <img src="${value.image[0]["#text"]}" alt="${value.name}">
                  ${value.name}
                  </a>

                  <span>${value.playcount}</span>
              </li>
        `;
        });
        //Banner section for new release
        $("#hero").html(hero);
        //music section html
        $("#music").html(
          `<h3 class="heading">More music by ${items.track[0].artist.name}</h3> 
          <div class="player">
          <audio controls>
              <source src="" type="audio/ogg" />
              <source src="" type="audio/mpeg" /> 
              Your browser does not support the audio element.
          </audio>
          <span>Now playing: </span>
          </div>
          <ul class="featured-music">
           ${featuredMusic}
           </ul>
           `
        );
        console.log(items); //tracks for infinite scroll or pagination
        //$("#shop").html(featuredMerchandise);
      });
    })
    .then(function () {
      $.ajax({
        url: "https://www.googleapis.com/youtube/v3/search?",
        dataType: "json",
        type: "GET",
        data: {
          key: "AIzaSyCfQlRjUUcb1ApGpa5KJFGOj_YvIB0qalc",
          q: "Jay-Z",
          part: "snippet",
          maxResults: 15,
        },
      }).done(function (data) {
        console.log(data);
        // let nextPage = data.nextPageToken;
        // let prevPage = data.prevPageToken;

        let featuredVideos = "";
        $.each(data["items"], function (index, value) {
          featuredVideos += `
          <div class="video">
            <a href="https://www.youtube.com/watch?v=${value.id.videoId}" target="_blank">
              <img class="thumbnail" src="${value.snippet.thumbnails.medium.url}" videoId="${value.id.videoId}"/>
              <div>${value.snippet.title} </div>
              </a>
          </div> `;
        }); //videos from Jay-Z

        $("#videos").html(
          `<h3>Popular videos</h3><div class="videos">${featuredVideos}</div>`
        );
      });
    });
}


// let chart = {};
//       const output = "";
//       chart.listeners = [];
//       chart.playcount = [];
//       $(document).ready(function () {
//         searchLastFM();
//       });
//       function searchLastFM() {
//         $.ajax({
//           url: "http://ws.audioscrobbler.com/2.0/",
//           type: "GET",
//           cache: false,
//           context: chart,
//           data: {
//             method: "artist.getTopTracks",
//             artist: "Jay-Z",
//             api_key: "71499159fe5e641e3445d4cb412a7d5a",
//             format: "json",
//             limit: 25,
//             autocorrect: 1,
//           },
//         }).done(function (music) {
//           let items = music.toptracks;
//           let featuredMusic = "";
//           let featuredVideos = "";
//           let featuredMerchandise = "";
//           console.log(items.track.listeners);
//           $.each(items["track"], function (index, track) {
//             featuredMusic += `
              
//             <ul class="featured-music">
//             <li><a href="${track.url}" data-song="song1" target="blank">${track.name}</a>
//             <audio controls>
//             <!-- <source src="" type="audio/ogg" />
//             <source src="" type="audio/mpeg" /> -->
//             Your browser does not support the audio element.
//             </audio>
//             <span>${track.playcount}</span></li>
//             </ul>
//               `;
//           });

//           $(".featured-music").html(featuredMusic);
//           //$(".featured-merchandise").html(featuredMerchandise);
//           //$(".featured-videos").html(featuredVideos);
//         });
//       }


//       <!DOCTYPE html>
// <html lang="en">
//   <head>
//     <meta charset="UTF-8" />
//     <meta http-equiv="X-UA-Compatible" content="IE=edge" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//     <title>Document</title>
//   </head>
//   <body>
//     <header></header>
//     <!--A promotional banner advertising a new single -->
//     <div class="searchWrapper">
//       <input type="text" name="search" id="search" />
//       <input type="button" value="search" id="searchBtn" />
//     </div>
//     <section class="container banner-promo" id="hero"></section>
//     <section class="container">
//       <!-- A “Music” section (not required to have working audio playback). Can display anything music-related using either of the following APIs (feel free to query any UMG artist) -->
//       <!-- Include pagination or infinite scroll in one of the sections. -->
//       <!-- Please include one visualization/graph using any of the API’s previously mentioned -->
//       <div class="container featured-music" id="music"></div>
//       <div class="container featured-merchandise" id="shop">
//         <!-- A “Merch” section showcasing 1-4 products (can use dummy/static data) -->
//         <!-- Include an option to filter the product for one of the sections (this option should use a React hook to conditionally call one of the suggested API endpoints). -->
//         <h2>Buy Jay-Z offical merchandise!</h2>
//         <ul class="merchandise">
//           <li>
//             <a href="#" data-shop-item="shop-item1">
//               <img src="/img/white-t.jpeg" alt="" />
//               Jay-Z classic white t-shirt</a
//             >
//             <p>£89.00</p>
//             <button type="button" class="btn">Add to basket</button>
//           </li>
//           <li>
//             <a href="#" data-shop-item="shop-item2">
//               <img src="/img/black-t.jpeg" alt="" />
//               Jay-Z retro black t-shirt</a
//             >
//             <p><span class="" reduced>£125</span>£64.00</p>

//             <button type="button" class="btn">Add to basket</button>
//           </li>
//         </ul>
//         {{pagination here}}
//       </div>

//       <div class="container featured-videos" id="videos">
//         <div class="container featured">
//           <div class="most-popular"></div>
//         </div>
//         <!-- A “Video” section that displays the Top 3 Youtube videos by views -->
//         <video width="320" height="240" controls>
//           <!-- <source src="" type="video/mp4" />
//             <source src="" type="video/ogg" /> -->
//           Your browser does not support the video tag.
//         </video>
//         <ul class="videos">
//           <li>
//             <a href="#" data-video="video1"><img src="#" alt="" />video1</a>
//           </li>
//           <li>
//             <a href="#" data-video="video2"><img src="#" alt="" />video2</a>
//           </li>
//           <li>
//             <a href="#" data-video="video3"><img src="#" alt="" />video3</a>
//           </li>
//         </ul>
//       </div>
//     </section>
//     <script src="//ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
//     <script>
//       let pageToken = {};
//       $(document).ready(function () {
//         searchLastFM();
//       });
//       $(".token").click(function () {
//         pageToken.current =
//           $(this).val() == "Next" ? pageToken.nextPage : pageToken.prevPage;
//         searchLastFM();
//       });
//       function searchLastFM() {
//         $.when(
//           $.ajax({
//             url: "http://ws.audioscrobbler.com/2.0/",
//             type: "GET",
//             data: {
//               method: "artist.getInfo",
//               artist: "Jay-Z",
//               api_key: "71499159fe5e641e3445d4cb412a7d5a",
//               format: "json",
//             },
//           }).done(function (artist) {
//             let header = "";
//             let tags = artist.artist.tags.tag;
//             let tagOutPut = "";
//             if (tags.length > 1) {
//               tags.splice(-1);
//               for (i = 0; i < tags.length; i++) {
//                 tagOutPut += `
//               <span class="tag">${tags[i].name}</span>
//               `;
//               }
//             } //get tags from bio to show genres for searching and filtering
//             header += `
//               <h1>${artist.artist.name}</h1>
//               `;
//             //header section with artist brand info
//             $("header").html(`${header} ${tagOutPut}`);
//           })
//         )
//           .then(function () {
//             $.ajax({
//               url: "http://ws.audioscrobbler.com/2.0/",
//               type: "GET",
//               data: {
//                 method: "artist.getTopTracks",
//                 artist: "Jay-Z",
//                 api_key: "71499159fe5e641e3445d4cb412a7d5a",
//                 format: "json",
//                 limit: 25,
//                 autocorrect: 1,
//               },
//             }).done(function (music) {
//               let items = music.toptracks;
//               let featuredMusic = "";
//               let featuredMerchandise = "";
//               let hero = `
//                 <p>
//                     New single available on streaming platforms </p>
//                     <h3><a href="#" target="blank">${items.track[1].name}</a></h3>
//                     <div class="stats">
//                         <span> ${items.track[1].playcount} streams since release</span>
//                         <span> ${items.track[1].listeners} listeners</span>
//                     </div>

//               `;
//               $.each(items["track"], function (index, value) {
//                 featuredMusic += `
//                 <ul class="featured-music">
//                     <li>
//                         <a href="${value.url}" data-song="song1" target="blank">
//                         <img src="${value.image[0]["#text"]}" alt="${value.name}">
//                         ${value.name}
//                         </a>

//                         <span>${value.playcount}</span>
//                     </li>
//                 </ul>
//               `;
//               });
//               //Banner section for new release
//               $("#hero").html(hero);
//               //music section html
//               $("#music").html(
//                 `<h3 class="heading">More music by ${items.track[0].artist.name}</h3> 
//                 <audio controls>
//                     <source src="" type="audio/ogg" />
//                     <source src="" type="audio/mpeg" /> 
//                     Your browser does not support the audio element.
//                 </audio>
//                  ${featuredMusic}`
//               );
//               console.log(items); //tracks for infinite scroll or pagination
//               //$("#shop").html(featuredMerchandise);
//             });
//           })
//           .then(function () {
//             $.ajax({
//               url: "https://www.googleapis.com/youtube/v3/search?",
//               dataType: "json",
//               type: "GET",
//               data: {
//                 key: "AIzaSyCSpcBdTY7inkvTWLXJeAnP_7PM4-OPNYM",
//                 q: "Jay-Z",
//                 part: "snippet",
//                 maxResults: 15,
//                 pageToken: pageToken.current,
//               },
//             }).done(function (data) {
//               pageToken.nextPage = data.nextPageToken;
//               pageToken.prevPage = data.prevPageToken;
//               console.log(pageToken);

//               let featuredVideos = "";
//               $.each(data["items"], function (index, value) {
//                 featuredVideos += `
//                 <div class="video">
//                     <h3>${value.snippet.title} </h3>
//                     <div class="url">${value.id.videoId}</div>
//                     <div>
//                     <a href="https://www.youtube.com/watch?v=${value.id.videoId}" target="_blank">
//                     <img class="thumbnail" src="${value.snippet.thumbnails.medium.url}"/></a></div> 
//                 </div> `;
//               }); //videos from Jay-Z
//               $("#videos").html(
//                 `
//                 div class="vdo-wrapper">${featuredVideos}</div>
//                 <div class="navBtns">
//                     <input type="button" value="previous" id="prevBtn" class="token" />
//                     <input type="button" value="next" id="nextBtn" class="token" />
//                 </div>
//               `
//               );
//             });
//           });
//       }
//     </script>
//   </body>
// </html>
