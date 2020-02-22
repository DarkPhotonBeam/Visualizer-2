$(document).ready(function () {

    const URL_HOME = "https://dev.darkphotonbeam.com";
    const URL_METADATA = URL_HOME+"/audio/metadata.json";


    // GET METADATA
    let metadata = $.getJSON(URL_METADATA, handleData);

    // METADATA HANDLE - CREATE DOM ELEMENTS
    function handleData(data) {

        console.log(data);

        // Create list for each album
        for (let a = 0; a < data.length; a++) {
            let album = data[a];

            // define anchor element
            let anchor = $("#songBrowser");

            // create parent div
            let albumDiv = $(document.createElement("div"));
            albumDiv.addClass("album");

            // album cover
            let coverDiv = $(document.createElement("div"));
            coverDiv.addClass("albumCover");
            let coverSrc = URL_HOME + "/audio/" + album.folderSrc + "/" + album.coverSrc;
            coverDiv.append("<img src='" + coverSrc + "' />");
            albumDiv.append(coverDiv);

            // album title
            let titleDiv = $(document.createElement("div"));
            titleDiv.addClass("albumTitle");
            let pubYear = new Date(album.pubDate).getFullYear();
            titleDiv.html(album.title + "<span class='pubYear'>" + pubYear + "</span>");
            albumDiv.append(titleDiv);

            // songs
            for (let s = 0; s < album.songs.length; s++) {
                let song = album.songs[s];
                let songDiv = $(document.createElement("div"));
                songDiv.addClass("song");
                let songLocation = {
                    "album": a,
                    "song": s
                };
                let songData = JSON.stringify(songLocation);
                //songDiv.attr("data-song", songData);
                songDiv.click(function() {
                    //alert(songData);
                    //console.log(songLocation);
                    $.redirect("https://dev.darkphotonbeam.com/projects/visualizer2/visualizer.php", songLocation, "POST", "_blank");
                });


                let trackNum = s + 1;

                // features
                let featureSpan = $(document.createElement("span"));
                for (let f = 0; f < song.features.length; f++) {
                    featureSpan.append("<span class='feature'>" + song.features[f] + "</span>");
                }

                //let duration = "<span class='duration'>" + secondsToString(song.duration) + "</span>";
                let duration = "<span class='duration'>" + song.duration + "</span>";

                songDiv.append("<div><span class='trackNum'>" + trackNum + "</span>" + song.title + featureSpan.html() + duration + "</div>");
                albumDiv.append(songDiv);
            }



            // stitch everything together
            anchor.append(albumDiv);

        }

    }

});


function secondsToString(sec) {
    let minutes = Math.floor(sec / 60);
    let seconds = sec % 60;
    return (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}