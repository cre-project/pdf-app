var doc = new jsPDF('l', 'in', [17, 22]);
var sections = document.getElementsByTagName("SECTION");
var tempPage = 0;
var imgButtons = document.getElementsByClassName("image-upload");
var imgInputs = document.getElementsByTagName("input");
var needSpacing = document.getElementsByClassName('letter-spacer');

function changeCSS(cssFile, cssLinkIndex) {

    var oldlink = document.getElementsByTagName("link").item(cssLinkIndex);
    var newlink = document.createElement("link");

    newlink.setAttribute("rel", "stylesheet");
    newlink.setAttribute("type", "text/css");
    newlink.setAttribute("href", `./stylesheets/${cssFile}`);

    document.getElementsByTagName("head").item(0).replaceChild(newlink, oldlink);
}

function selectElementImage(button) {
    var input = document.getElementsByName(button.getAttribute("data-target"))[0];
    input.click();
}

//We need this as jsPDF doesn't render CSS3 Letter spacing. So we have to fake it.
function addSpacing(elements) {
    for (var i = 0; i < elements.length; i++) {
        elements[i].classList.add("no-letter-spacing");
        elements[i].originalText = elements[i].innerHTML;
        var renderedText = elements[i].innerHTML.trim();
        elements[i].spacedText = renderedText.split('').join('&nbsp;');
        elements[i].innerHTML = elements[i].spacedText;
    }
}

function removeSpacing(elements) {
    for (var i = 0; i < elements.length; i++) {
        elements[i].classList.remove("no-letter-spacing");
        elements[i].innerHTML = elements[i].originalText;
    }
}

function setImgUrl(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {

            var targetEl = document.getElementById(input.getAttribute("name"));

            if (targetEl.tagName == "DIV") {
                targetEl.style.backgroundImage = "url(" + e.target.result + ")";
            } else if (targetEl.tagName == "IMG") {
                targetEl.src = e.target.result;
            } else {
                console.log('Element does not support image visualisations')
            }
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function toggle(className, displayState) {
    var elements = document.getElementsByClassName(className)

    for (var i = 0; i < elements.length; i++) {
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
            doc.save('valuation.pdf');
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
    doc.save('sample-file1.pdf');
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
for (var i = 0; i < imgButtons.length; ++i) {
    imgButtons[i].addEventListener("click", function (button) {
        selectElementImage(this)
    });
}

for (var i = 0; i < imgInputs.length; ++i) {
    if (imgInputs[i].getAttribute("type") == "file") {
        imgInputs[i].addEventListener("change", function (input) {
            setImgUrl(this);
        });
    }
}