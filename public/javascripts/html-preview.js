const IMAGE_ENDPOINT = 'https://cre-backend-testing.herokuapp.com/api/saveImage'
const CLOUDINARY_PRESET = ''
const CLOUDINARY_UPLOAD_URL=''

let doc = new jsPDF('l', 'in', [17, 22]);
let sections = document.getElementsByTagName("SECTION");
let tempPage = 0;
let imgButtons = document.getElementsByClassName("image-upload");
let imgInputs = document.getElementsByTagName("input");
let needSpacing = document.getElementsByClassName('letter-spacer');

function changeCSS(cssFile, cssLinkIndex) {

    let oldlink = document.getElementsByTagName("link").item(cssLinkIndex);
    let newlink = document.createElement("link");

    newlink.setAttribute("rel", "stylesheet");
    newlink.setAttribute("type", "text/css");
    newlink.setAttribute("href", `./stylesheets/${cssFile}`);

    document.getElementsByTagName("head").item(0).replaceChild(newlink, oldlink);
}

function selectElementImage(button) {
    let input = document.getElementsByName(button.getAttribute("data-target"))[0];
    input.click();
}

//We need this as jsPDF doesn't render CSS3 Letter spacing. So we have to fake it.
function addSpacing(elements) {
    for (let i = 0; i < elements.length; i++) {
        elements[i].classList.add("no-letter-spacing");
        elements[i].originalText = elements[i].innerHTML;
        let renderedText = elements[i].innerHTML.trim();
        elements[i].spacedText = renderedText.split('').join('&nbsp;');
        elements[i].innerHTML = elements[i].spacedText;
    }
}

function removeSpacing(elements) {
    for (let i = 0; i < elements.length; i++) {
        elements[i].classList.remove("no-letter-spacing");
        elements[i].innerHTML = elements[i].originalText;
    }
}

function setImgUrl(input) {
    if (input.files && input.files[0]) {
        let file = input.files[0]
        let reader = new FileReader();

        reader.onload = function (e) {

            let targetEl = document.getElementById(input.getAttribute("name"));

            if (targetEl.tagName == "DIV") {
                targetEl.style.backgroundImage = "url(" + e.target.result + ")";
            } else if (targetEl.tagName == "IMG") {
                targetEl.src = e.target.result;
            } else {
                console.log('Element does not support image visualisations')
            }
        }

        // upload image to cloudinary & save to DB
        upload(file, input.getAttribute('name'))
        reader.readAsDataURL(file);
    }
}


// *********** Upload file to Cloudinary && save in DB ******************** //
function upload(file, imageID) {
    let xhr = new XMLHttpRequest()
    let fd = new FormData()
    xhr.open('POST', CLOUDINARY_UPLOAD_URL, true)
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    xhr.onreadystatechange = function (e) {
        if (xhr.readyState === 4 && xhr.status === 200) {
            try {
                // file uploaded successfully
                let response = JSON.parse(xhr.responseText)
                let url = response.secure_url

                // store image URL in the database
                saveImage(url, imageID)
            } catch (e) {
                console.log(`Cloudinary response could not be handled: ${e}`)
            }
        } else if (xhr.readyState === 4 && xhr.status !== 200) {
            console.log(`Non-200 status from Cloudinary: ${xhr.statusText}`)
        }
    }

    // preset is needed for unsigned uploads
    fd.append('upload_preset', CLOUDINARY_PRESET)
    fd.append('file', file)
    xhr.send(fd)
}

// send request to the backend to save the image
function saveImage(url, imageID) {
    const pathParts = window.location.href.split('/')
    const packageID = pathParts[pathParts.length - 1]
    let body = { imageID: imageID, packageID: packageID, url: url } 

    let req = new XMLHttpRequest()
    req.open('POST', IMAGE_ENDPOINT, true)
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    req.onreadystatechange = function (e) {
        if (req.readyState === 4 && req.status === 200) {
            console.log(`Image ${imageID} was saved`)
        } else if (req.readyState === 4 && req.status !== 200) {
            console.log(`Image ${imageID} could not be saved`, req.statusText)
        }
    }
    req.send(JSON.stringify(body))
}

function toggle(className, displayState) {
    let elements = document.getElementsByClassName(className)

    for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = displayState;
    }
}

async function addPageAndCanvas() {
    doc.addHTML(sections[tempPage], async function () {
        if (tempPage < sections.length - 1) {
            doc.addPage();
            tempPage++;
            addPageAndCanvas();
        } else {
            await sleep(2000);
            doc.save('package.pdf');
            changeCSS('html-preview.css', 0);
            removeSpacing(needSpacing);
            toggle('hide-on-save', 'block');
            toggle('loader', 'none');
        }
    });
}

function savePDF() {
    toggle('loader', 'block');
    tempPage = 0;
    toggle('hide-on-save', 'none');
    doc = new jsPDF('l', 'in', [17, 22]);
    changeCSS('pdf-render.css', 0);
    addSpacing(needSpacing);
    addPageAndCanvas();
}

function downloadPDF() {
    doc.save('package.pdf');
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
for (let i = 0; i < imgButtons.length; ++i) {
    imgButtons[i].addEventListener("click", function (button) {
        selectElementImage(this)
    });
}

for (let i = 0; i < imgInputs.length; ++i) {
    if (imgInputs[i].getAttribute("type") == "file") {
        imgInputs[i].addEventListener("change", function (input) {
            setImgUrl(this);
        });
    }
}