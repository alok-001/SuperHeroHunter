(function () {

    // fetch all the required dom elements.
    const superHeroBox = document.getElementById("superHeroBox");
    const containerEmptyDiv = document.getElementById("nothing-here");
    let superHeroIdsList = []; //array used for localStorage
    // listFavSuperHero is the local storage key
    // localStorage.setItem("listFavSuperHero", JSON.stringify(superHeroIdsList));

    //try to getch from local storage
    let stringOfSuperHeroId = localStorage.getItem("listFavSuperHero");
    if (stringOfSuperHeroId !== null || stringOfSuperHeroId != undefined) {
        superHeroIdsList = JSON.parse(stringOfSuperHeroId);
    }

    // if localStorage does not have any value then return and show msg.

    if (superHeroIdsList.length == 0) {
        containerEmptyDiv.style.display = "block";
        return;
    }

    let showError = function () {
        if (superHeroIdsList.length == 0) {
            containerEmptyDiv.style.display = "block";
            return;
        }
    }



    // create a function for notificationing/notification by fetching notification div

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

    console.log(superHeroIdsList);



    // Create card for hero when rendering complete
    var getSuperHerocardLayout = function (sourceImg, name, id) {
        var cardLayout = document.createElement("div");
        cardLayout.setAttribute("class", "card-layout");

        var heroId = document.createElement("div");
        heroId.setAttribute("class", "hero-id");
        heroId.innerHTML = id;

        var heroImageContainer = document.createElement("div");
        heroImageContainer.setAttribute("class", "heroImgContainer");

        var img = document.createElement("img");
        img.setAttribute("class", "hero-img");
        img.setAttribute("src", sourceImg);
        img.setAttribute("onerror", "this.src='/assets/imgErr.jpg';");

        var cardBody = document.createElement("div");
        cardBody.setAttribute("class", "card-body");

        var heroName = document.createElement("div");
        heroName.setAttribute("class", "heroName");
        heroName.innerHTML = name;

        var favBtnIcon = document.createElement("div");
        favBtnIcon.setAttribute("class", "favBtn");


        // if local starage have the id then color red the favourite icon.
        if (superHeroIdsList.indexOf(id) !== -1) {
            favBtnIcon.innerHTML = '<i id="fav-click" class="fas fa-heart"></i>';
            localStorage.setItem("listFavSuperHero", JSON.stringify(superHeroIdsList));
        }

        // function when click the superhero will remove from 
        // the local Storage(favourite list).
        
        favBtnIcon.onclick = function () {
            var index = superHeroIdsList.indexOf(id);
            if (index !== -1) {
                console.log(id);
                superHeroIdsList.splice(index, 1);
                favBtnIcon.innerHTML = '<i id="fav-click" class="far fa-heart"></i>';
                console.log(superHeroIdsList);
                superHeroBox.removeChild(cardLayout);
                localStorage.setItem("listFavSuperHero", JSON.stringify(superHeroIdsList));
                notification(heroName.innerHTML + " Removed from Favourites", 0);
                showError();
            }
        }

        cardBody.appendChild(heroName);
        cardBody.appendChild(favBtnIcon);



        heroImageContainer.appendChild(img);
        cardLayout.appendChild(heroId);
        cardLayout.appendChild(heroImageContainer);
        cardLayout.appendChild(cardBody);

        // make sure the favourite button work when click  and remove it from local storage else open that superhero page.

        cardLayout.onclick = function (event) {
            if (event.target.id === favBtnIcon.firstChild.id) {
                return;
            }
            else {
                window.open("superhero.html?hero_id=" + id, "_self");
            }
        }
        return cardLayout;
    }



    //  function for rendering superhero

    let showHeroes = async function (data) {
        let it = data
        superHeroBox.appendChild(getSuperHerocardLayout(it.image.url, it.name, it.id));
    }

    //  Load favourite by id function
    let loadFavourites = async function (id) {

        let response = await fetch(`https://www.superheroapi.com/api.php/1617383501804493/${id}`).catch(e => {
            console.log("error");
        });
        let data = await response.json();
        showHeroes(data);
    }

    // looping over superhero list and passing one by one to load favourites method.
    for (const iterator of superHeroIdsList) {
        loadFavourites(iterator);
    }

})();