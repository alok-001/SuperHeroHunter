(function () {

   
    // get url from window location href
    // and use url params to get superhero id

    const url = new URL(window.location.href);
    var heroId = url.searchParams.get("hero_id");

    // get all the  elements. 
    const heroImg = document.getElementById("mainHeroImg");
    const heroName = document.getElementById("heroName");
    const favBtnIcon = document.getElementById("favBtn");


    // notification function for showing notification when favourite button click.
    const notificationDiv = document.getElementById("notification-div");

    let notification = function (msg, state) {
        notificationDiv.innerHTML = msg;
        if (state == true) {
            notificationDiv.style.backgroundColor = "green";
            notificationDiv.style.opacity = 1;
            setTimeout(() => {
                notificationDiv.style.opacity = 0
            }, 800)
        }
        else {
            notificationDiv.style.backgroundColor = "red";
            notificationDiv.style.opacity = 1;
            setTimeout(() => {
                notificationDiv.style.opacity = 0
            }, 800)
        }
    }


    // get array of favourite superhero from localStorage and create empty array when there is 0 favourite superhero.

    let stringOfSuperHeroId = localStorage.getItem("listFavSuperHero");
    if (stringOfSuperHeroId !== null || stringOfSuperHeroId != undefined) {
        superHeroIdsList = JSON.parse(stringOfSuperHeroId);
    }

    console.log(superHeroIdsList);

    // function to show bio of superhero
    const showHeroBio = function (bio) {
        for (const it in bio) {
            document.getElementById(it).innerHTML = bio[it];
        }
    }

    // function to show appearance of superhero
    const showHeroAppearence = function (appearance) {
        for (const it in appearance) {
            document.getElementById(it).innerHTML = appearance[it];
        }
    }

    // function to show powerstats of superhero
    const showPowerStats = function (powerstats) {
        for (const it in powerstats) {
            let skill = document.getElementById(it);
            skill.style.width = `${powerstats[it]}%`;
        }
    }

    // function to show work of superhero
    const showHeroWork = function (work) {
        for (const it in work) {
            document.getElementById(it).innerHTML = work[it];
        }
    }

    // function to show connections of superhero
    const showHeroConnections = function (connections) {
        for (const it in connections) {
            document.getElementById(it).innerHTML = connections[it];
        }
    }

    // function which show superhero data by calling other functions
    const showHero = function (data) {
        heroImg.setAttribute("src", data.image.url);
        heroName.innerHTML = data.name;
        showHeroBio(data.biography);
        showPowerStats(data.powerstats);
        showHeroAppearence(data.appearance);
        showHeroWork(data.work);
        showHeroConnections(data.connections);

         // if the superhero is in the list color its  favourite Button
        // or else don't color the favourite button button 

        if (superHeroIdsList.indexOf(heroId) !== -1) {
            favBtnIcon.innerHTML = '<i id="fav-click" class="fas fa-heart"></i>';
        }
        else {
            favBtnIcon.innerHTML = '<i id="fav-click" class="far fa-heart"></i>';
        }

         // function for adding and removig superhero in the favourite list
        favBtnIcon.onclick = function () {
            var index = superHeroIdsList.indexOf(heroId);
            if (index !== -1) {
                console.log(heroId);
                superHeroIdsList.splice(index, 1);
                favBtnIcon.innerHTML = '<i id="fav-click" class="far fa-heart"></i>';
                console.log(superHeroIdsList);
                localStorage.setItem("listFavSuperHero", JSON.stringify(superHeroIdsList));
                notification(heroName.innerHTML + " Removed from Favourites", 0);
            }
            else {
                superHeroIdsList.push(heroId);
                favBtnIcon.innerHTML = '<i id="fav-click" class="fas fa-heart"></i>';
                console.log(superHeroIdsList);
                localStorage.setItem("listFavSuperHero", JSON.stringify(superHeroIdsList));
                notification(heroName.innerHTML + " Added to Favourites", 1);
            }
        }

    }

    // function to get superhero by id fetched from urlParams.
    const getHeroById = async function (heroId) {
        let response = await fetch(`https://www.superheroapi.com/api.php/1617383501804493/${heroId}`).catch(e => {
            console.log("error");
        });
        let data = await response.json();
        showHero(data);
    }

    getHeroById(heroId);




})();