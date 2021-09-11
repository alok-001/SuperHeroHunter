(function () {

    // get all the  elements.
    const searchBtn = document.getElementById("searchBtn");
    const inputbar = document.getElementById("nameInput");
    const superHeroBox = document.getElementById("superHeroBox");
    const hamBtn = document.getElementById("hamBtn");
    const hamBar = document.getElementById("ham-bar");
    const mainHeading = document.getElementById("mainHeading");
    const notificationDiv = document.getElementById("notification-div");
  
  
    // notification function for showing notification when favourite button click.
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
    let superHeroIdsList = [];
    // listFavSuperHero

    let stringOfSuperHeroId = localStorage.getItem("listFavSuperHero");
    if (stringOfSuperHeroId !== null || stringOfSuperHeroId != undefined) {
        superHeroIdsList = JSON.parse(stringOfSuperHeroId);
    }
  
    console.log(superHeroIdsList);
  
  
    // hamburger menu for smaller screen.
  
    hamBtn.onclick = function () {
        if (hamBar.style.maxHeight == "0px" || hamBar.style.maxHeight == "") {
            hamBar.style.maxHeight = "40vh";
        }
        else {
            hamBar.style.maxHeight = "0px";
        }
    }
  
  
    // Create card for hero when rendering complete
    
    var getSuperHerocardLayout = function (id, name, sourceImg) {
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
        img.setAttribute("onerror", "this.onerror= null; this.src='assets/imgErr.jpg';");
  
        var cardBody = document.createElement("div");
        cardBody.setAttribute("class", "card-body");
  
        var heroName = document.createElement("div");
        heroName.setAttribute("class", "heroName");
        heroName.innerHTML = name;
  
        var favBtnIcon = document.createElement("div");
        favBtnIcon.setAttribute("class", "favBtn");
  
  
        // if the superhero is in the list color its  favourite Button
        // or else don't color the favourite button button 
        
        if (superHeroIdsList.indexOf(id) !== -1) {
            favBtnIcon.innerHTML = '<i id="fav-click" class="fas fa-heart"></i>';
            localStorage.setItem("listFavSuperHero", JSON.stringify(superHeroIdsList));
        }
        else {
            favBtnIcon.innerHTML = '<i id="fav-click" class="far fa-heart"></i>';
            localStorage.setItem("listFavSuperHero", JSON.stringify(superHeroIdsList));
        }
  
        // function for adding and removig superhero in the favourite list
        
        favBtnIcon.onclick = function () {
            var index = superHeroIdsList.indexOf(id);
            if (index !== -1) {
                console.log(id);
                superHeroIdsList.splice(index, 1);
                favBtnIcon.innerHTML = '<i id="fav-click" class="far fa-heart"></i>';
                console.log(superHeroIdsList);
                localStorage.setItem("listFavSuperHero", JSON.stringify(superHeroIdsList));
                notification(heroName.innerHTML + " Removed from Favourites", 0);
            }
            else {
                superHeroIdsList.push(id);
                favBtnIcon.innerHTML = '<i id="fav-click" class="fas fa-heart"></i>';
                console.log(superHeroIdsList);
                localStorage.setItem("listFavSuperHero", JSON.stringify(superHeroIdsList));
                notification(heroName.innerHTML + " Added to Favourites", 1);
            }
        }
  
        cardBody.appendChild(heroName);
        cardBody.appendChild(favBtnIcon);
  
        heroImageContainer.appendChild(img);
        cardLayout.appendChild(heroId);
        cardLayout.appendChild(heroImageContainer);
        cardLayout.appendChild(cardBody);
  
        // make sure the favourite button work when click else open that superhero page.
  
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
  
  
  
    // render superheroes and if not show empty error.
    let showHeroes = async function (data, name) {
        if (data.results == null) {
            superHeroBox.innerHTML = "";
            return;
        }
        if (inputbar.value !== name) {
            return;
        }
        superHeroBox.innerHTML = "";
        for (const i of data.results) {
            superHeroBox.appendChild(getSuperHerocardLayout(i.id, i.name, i.image.url));
        }
    }
  
  
    // implementing auto guessing feature
    // upon key press, a GET api call is made to the server.
    // the api response containing the superhero details is rendered, and if there is any error it is logged
    // making sure that only those entities are 
    // rendered which contains the characters entered in the input bar.
  
    inputbar.onkeyup = async function () {
        mainHeading.style.display = "none";
        let name = inputbar.value;
        if (name.length == 0) {
            superHeroBox.innerHTML = "";
            mainHeading.style.display = "block";
            return;
        }
        let response = await fetch(`https://www.superheroapi.com/api.php/1617383501804493/search/${name}`).catch(e => {
            console.log("error");
        });
        let data = await response.json();
        showHeroes(data, name);

    }
  
    // Checking Search button work properly
    searchBtn.onclick = () => { inputbar.onkeyup() };
  
  
  
  })();
  
  