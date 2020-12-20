const auth = '563492ad6f917000010000018adfb0b7a3124d98996a1405f156e8f2';
const gallery = document.querySelector('.gallery');
const searchInput = document.querySelector('.search-input')
const form = document.querySelector('.search-form')
const more = document.querySelector('.more-btn')
let page = 1;
let searchValue = '';
let fetchlink;
let query = '';

//eventlisteners
searchInput.addEventListener('input', updateInput)
form.addEventListener('submit', (e)=>{
    e.preventDefault()
    console.log(`search value - ${searchValue}`)
    if (searchValue == '') {
        page = 1;
        query = '';
        gallery.innerHTML = '';
        curatedPhotos()
    } else {
        searchPhotos(searchValue)
    }
})

more.addEventListener('click', loadMore)

function clearGallery() {
    query = searchValue;
    gallery.innerHTML = '';
    searchInput.value = '';
    updateInput() 
    page = 1;
}

function updateInput() {
    searchValue = searchInput.value;
}

async function fetchAPI(url) {
    const dataFetch = await fetch(url, {
        method: "GET", 
        headers: {
            Accept: 'application/json',
            Authorization: auth
        }
    })
    const data = dataFetch.json();
    return data;
}

function generatePictures(data) {
    data.photos.forEach((photo)=>{
        const galleryImg = document.createElement('div')
        galleryImg.classList.add('gallery-img')
        galleryImg.innerHTML = `
        <div class='photo-div'>
            <div class='gallery-info'>
                <p><a href='${photo.photographer_url}' target="_blank">${photo.photographer}</a></p>
                <a href="${photo.src.original}" target="_blank">Download</a>
            </div>
            <img class='photo-img' src='${photo.src.large}'></img>
        </div>
        `
        gallery.append(galleryImg)
    })
}

async function curatedPhotos() {
    fetchLink = `https://api.pexels.com/v1/curated?per_page=20`
    const data = await fetchAPI(fetchLink)
    generatePictures(data);
}

async function searchPhotos(searchValue) {
    clearGallery();
    console.log(`query - ${query}, ${searchValue}`)
    fetchLink = `https://api.pexels.com/v1/search?query=${query}&per_page=20`;
    const data = await fetchAPI(fetchLink)
    generatePictures(data);
}

async function loadMore() {
    page++; 
    if (query == '') {
        fetchLink = `https://api.pexels.com/v1/curated?per_page=20&page=${page}`
    } else {
        fetchLink = `https://api.pexels.com/v1/search?query=${query}&per_page=20&page=${page}`
    }
    const data = await fetchAPI(fetchLink)
    generatePictures(data);
}

curatedPhotos()



