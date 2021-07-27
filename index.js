//refs
const refs = {
    btn: document.querySelector('.js-btn'),
    btnLoad:document.querySelector('.btn'),
    list: document.querySelector('.js-list'),
    input: document.querySelector('.input'),
    backDrop: document.querySelector('.lightbox'),
    backDropImg: document.querySelector('.lightbox__image'),
    backDropOverLay :document.querySelector('.lightbox__overlay'),
    page: 1,
    query: '',
    imgs: [],
}
//lisners
refs.input.addEventListener('input', e => {
    refs.query = e.currentTarget.value;
})
refs.btnLoad.addEventListener('click', e => {
    e.preventDefault()
    refs.page += 1
    refs.list.innerHTML = ''
    apiGallery(e)
})
refs.btn.addEventListener('click', e => {
    e.preventDefault()
    if (refs.query.trim() === '') {
        refs.input.value = ''
        return alert('Вы ввили пустую строку')
    }
    refs.list.innerHTML = ''
    refs.imgs = []
    apiGallery(e)
    refs.input.value = ''
})

refs.backDropOverLay.addEventListener('click', onBackDropClick)

refs.list.addEventListener('click', e => {
    if (e.target.nodeName !== "IMG") {
        return
    }
    e.preventDefault()
    refs.backDrop.classList.add('is-open')
    const largeImg = refs.imgs.find(img => img.webformatURL === e.target.src);
    refs.backDropImg.src = largeImg.largeImageURL
    window.addEventListener('keydown', onEscPress   )

})

//function
const imgGalleryMarkup = (imgs) => {
    return imgs.map(({ id, webformatURL, tags }) => {
        return `<li id=${id}><img width="200px" src=${webformatURL} alt=${tags}></li>`
    }).join('');
}
const apiGallery = (e) => {
    fetch(`https://pixabay.com/api/?q=${refs.query}&page=${refs.page}&key=21255854-31bcf5c415a33cbe729d04b4b&image_type=photo&orientation=horizontal&per_page=12`)
        .then(r => r.json())
        .then(({ hits }) => {
            refs.imgs = [...refs.imgs, ...hits]
            const imgList = imgGalleryMarkup(refs.imgs)
            refs.list.insertAdjacentHTML('beforeend', imgList)
            if (hits.length === 0) {
                if (refs.btnLoad.classList.contains('is-open')) {
                    refs.btnLoad.classList.remove('is-open')
                }
                return hits
            }
            refs.btnLoad.classList.add('is-open')
            return hits
        })
}
function onBtnClose(){
    refs.backDrop.classList.remove('is-open')
    refs.backDropImg.src='';
}
function onBackDropClick(e){
    if(e.currentTarget === e.target){
      onBtnClose();
    }
}
function onEscPress(e){
    if(e.code === 'Escape'){
      onBtnClose();
    }
}
