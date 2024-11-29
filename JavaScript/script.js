let currentSong = new Audio();
let songs;
let currFolder;

function formatSeconds(seconds) {
    // Calculate full minutes
    const minutes = Math.floor(seconds / 60);
    
    // Calculate remaining seconds, ensuring no decimals
    const remainingSeconds = Math.floor(seconds % 60);

    // Format remaining seconds to always have two digits
    const formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

    // Return the formatted string as "minutes:seconds"
    return minutes + ':' + formattedSeconds;
}

async function getSongs(folder)
{
    currFolder = folder;
    let a = await fetch(`/songs/${folder}/`);
    let response  = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            // console.log(element.href.split(`/${folder}/`)[1])
            songs.push(element.href.split(`/${folder}/`)[1]);

        }
    }
    

      // show all the songs in the playlist
    
      let songUL = document.querySelector(".tContainer").getElementsByTagName("ul")[0];
      songUL.innerHTML = "";
      for(const song of songs)
      {
        
          songUL.innerHTML = songUL.innerHTML+ `<li><img src="svg/music.svg" alt="">
                      <div class="info">
                        <div>${song}</div>
                        <div>Harry</div>
                      </div>
                      <div class="playnow">
                        <span>Play now</span>
                        <img src="svg/pauseAndPlay.svg" class="invert" alt="">
                      </div></li>`;
      }
  
      // attach an eventlistner to each songs
      Array.from(document.querySelector(".tContainer").getElementsByTagName("li")).forEach(e=>{
          e.addEventListener("click" , element=>{
              // console.log(e.querySelector(".info").firstElementChild.innerHTML);
              playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
              
          })
      })
      return songs;

}
const playMusic = function(track , pause = false) {
    currentSong.src = `/songs/${currFolder}/` + track;

    if(!pause)
    {
        currentSong.play();
        play.src = "/svg/pause.svg"
    }

    document.querySelector(".songInfo").innerHTML = track;
    document.querySelector(".songTime").innerHTML = "00:00/00:00";
}


async function displayAlbums()
{
    let a = await fetch(`/songs/`);
    let response  = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer");
    let array = Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            if(e.href.includes("/songs/") && !e.href.includes(".htaccess")){
                // console.log(e);
                console.log(e.href.split("/"));
                let folder = (e.href.split("/").slice(-1)[0]);
                let a = await fetch(`/songs/${folder}/info.json`);
                let response  = await a.json();
                cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder = "${folder}" class="card">
                        <div class="play">
                            <img src="svg/playbuttonfree.svg" alt="">
                        </div>
                        <img src="/songs/${folder}/cover.jpeg" alt="">
                         <h2>${response.title}</h2>
                         <p>${response.description}</p>
                    </div>`
            }
            
        }

    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click" , async item=>{
            
            songs = await getSongs(`${item.currentTarget.dataset.folder}`)
            playMusic(songs[0]);
        })
    })
}
async function main()
{
    // Get the list of all songsa
    await getSongs("cs");
    playMusic(songs[0] , true);
    
    // display all the albums on the page
    displayAlbums();

    // Attach an event listner to play pause and next
    play.addEventListener("click" , ()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src = "/svg/pause.svg"

        }
        else{
            currentSong.pause();
            play.src = "/svg/pauseAndPlay.svg";
        }
    })
    // listen for time update
    currentSong.addEventListener("timeupdate" , ()=>{
        // console.log(currentSong.currentTime , currentSong.duration);

        document.querySelector(".songTime").innerHTML = `${formatSeconds(currentSong.currentTime)}/${formatSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 

    })

    // Add an event listner to seekbar
    document.querySelector(".seekbar").addEventListener("click" , e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width *100)
        document.querySelector(".circle").style.left = percent + "%";

        currentSong.currentTime  = percent/100 * currentSong.duration;


    })

    // Add an eventListner for hamburger
    document.querySelector(".hamburger").addEventListener("click" , ()=>{
        document.querySelector(".left").style.left = "0";
    })

    // Add an eventListner for close button
    document.querySelector(".cross").addEventListener("click" , ()=>{
        document.querySelector(".left").style.left = "-200%";
    })
    
    // Add an event listner to  previous button
    previous.addEventListener("click" , ()=>{
        // console.log("previous clicked");
        // console.log(currentSong.src.split("/songs/")[1]);
        let index = songs.indexOf(currentSong.src.split(`/songs/${currFolder}/`)[1]);
        if(index - 1 >= 0)
        {
            playMusic(songs[index - 1]);

        }
    })
    // Add an event listner to next 
    next.addEventListener("click" , ()=>{
        // console.log("next clicked");
        let index = songs.indexOf(currentSong.src.split(`/songs/${currFolder}/`)[1]);
        if(index +1 < songs.length)
        {
            playMusic(songs[index + 1]);
        }
    })

    // Add an event listner to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change" , (e)=>{
        
        currentSong.volume = parseInt(e.target.value)/100;
    })

    // Add an event listner to add volume track

    document.querySelector(".volume > img").addEventListener("click" , e=>{
        // console.log(e.target);

        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg","mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value =  0;

        }
        else{
            e.target.src = e.target.src.replace("mute.svg","volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    })
    
    
}

main();

