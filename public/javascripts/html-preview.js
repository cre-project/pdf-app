const IMAGE_ENDPOINT = 'https://cre-pdf-app.herokuapp.com/api/saveImage'
// const PDF_ENDPOINT = 'http://localhost:4000/export/pdf'
const PDF_ENDPOINT = 'https://cre-pdf-app.herokuapp.com/export/pdf'
const CLOUDINARY_PRESET = ''
const CLOUDINARY_UPLOAD_URL=''

let imgButtons = document.getElementsByClassName("image-upload");
let imgInputs = document.getElementsByTagName("input");

function selectElementImage(button) {
    let input = document.getElementsByName(button.getAttribute("data-target"))[0];
    input.click();
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

function savePDF() {
    const pathParts = window.location.href.split('/')
    const packageID = pathParts[pathParts.length - 1]

    let req = new XMLHttpRequest()
    req.open('GET', `${PDF_ENDPOINT}/${packageID}`, true)
    req.responseType= 'arraybuffer'

    req.onreadystatechange = function (e) {
        if (req.readyState === 4 && req.status === 200) {
            // open file save dialog
            var url = URL.createObjectURL(new Blob([req.response]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', 'package.pdf')
            document.body.appendChild(link)
            link.click()
        } else if (req.readyState === 4 && req.status !== 200) {
            console.log(req)
            console.log(`Failure`, req.statusText)
        }
    }
    req.send()
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