const statics = {
    CHUNCK_SIZE: 300,
    PIXEL_SIZE: 10,
    DOMINANT_TEXTURE: 1
}
const data = {
    possibleValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    chuncks: [],
    width: 1,
    height: 1
}

const canevas = document.getElementById("canvas"); // dans votre HTML, cet élément apparaît comme <canvas id="monCanevas"></canvas>
const ctx = canevas.getContext("2d");


initApp();

function initApp() {
    createFirstChunck()
}


function createFirstChunck() {
    const filledChunck = fillChunck(createEmptyChunck())
    data.chuncks.push(filledChunck)
    drawElement(data.chuncks.length - 1);
}

function createNewChuncks(options = {}) {
    const expectedLength = data.width * data.height;
    for (let i = 0; i < expectedLength - data.chuncks.length; i++) {
        let previousChunck = options.direction === "width" ? data.chuncks[i] : data.chuncks[i]
        const preparedChunck = prepareChunck(createEmptyChunck(), previousChunck, options.direction)
        const filledChunck = fillChunck(preparedChunck, {
            action: "add"
        })
        data.chuncks.push(filledChunck)
        drawElement(data.chuncks.length - 1)
    }
    console.log(data)
}

function prepareChunck(emptyChunck, previousChunck, direction) {
    if (direction === "width") {
        for (let i = 0; i < emptyChunck.length; i++) {
            emptyChunck[i][0] = previousChunck[i][previousChunck.length - 1]
        }
    }
    return emptyChunck
}

function fillChunck(chunck, options = {}) {
    let r = Math.round(Math.random() * 10);

    if (!options.action) {
        if (r <= 7) {
            r = statics.DOMINANT_TEXTURE
        }
        chunck[0][0] = r;
        for (let i = 0; i < chunck.length; i++) {
            let line = chunck[i];
            for (let j = 0; j < line.length; j++) {
                if (i === 0) {
                    let previousValue = line[j - 1]
                    if (!line[j] && previousValue) {
                        line[j] = getValue(previousValue)
                    }
                } else {
                    let previousLinePixelValue = chunck[i - 1][j] || null
                    let previousValue = chunck[i][j - 1]
                    if (!line[j]) {
                        line[j] = getValue(previousValue, previousLinePixelValue)
                    }
                }
            }
        }
    } else {
        for (let i = 0; i < chunck.length; i++) {
            let line = chunck[i];
            for (let j = 0; j < line.length; j++) {
                if (!line[j]) {
                    let previousLinePixelValue = i === 0 ? null : chunck[i - 1][j]
                    let previousValue = chunck[i][j - 1]
                    line[j] = getValue(previousValue, previousLinePixelValue)
                }
            }
        }

    }

    return chunck;
}

function isFound(value) {
    return data.possibleValues.find(i => i === value)
}

function getValue(previousValue, previousLinePixelValue) {
    let r = Math.round(Math.random() * 100);
    let ref;
    // if (previousValue !== '' && previousLinePixelValue !== '') {
        if (isFound(previousValue) && isFound(previousLinePixelValue)) {
        ref = r >= 50 ? previousValue : previousLinePixelValue;
    } else if (!isFound(previousValue)) {
        ref = previousLinePixelValue
    } else {
        ref = previousValue;
    }
    if (r <= 90) {
        return ref;
    } else if (r <= 95) {
        return ref >= 9 ? ref : ref + 1;
    } else {
        return ref <= 0 ? ref : ref - 1;
    }
}

function createEmptyChunck() {
    let chunck = []
    for (let i = 0; i < statics.CHUNCK_SIZE / statics.PIXEL_SIZE; i++) {
        let arr = []
        for (let j = 0; j < statics.CHUNCK_SIZE / statics.PIXEL_SIZE; j++) {
            arr.push("")
        }
        chunck.push(arr)
    }
    return chunck;
}

function drawElement(index) {
    const currentChunck = data.chuncks[index];
    return currentChunck.map((line, lineIndex) => {
        return line.map((pix, pixIndex) => {
            const color = "rgb" + getColor(pix)
            ctx.fillStyle = color; // définit la couleur de remplissage du rectangle
            ctx.fillRect(getPixelXPosition(pixIndex, index), lineIndex * statics.PIXEL_SIZE, statics.PIXEL_SIZE, statics.PIXEL_SIZE); // dessine le rectangle à la position 10, 10 d'une largeur de 55 et d'une hauteur de 50
        })
    })
}

function getPixelXPosition(pixelIndex, chunckIndex) {
    return pixelIndex * statics.PIXEL_SIZE + (chunckIndex * statics.CHUNCK_SIZE);
}

function getColor(value) {
    switch (value) {
        case 0:
            return "(70, 190, 246)";
        case 1:
            return "(91, 178, 100)";
        case 2:
            return "(93, 175, 28)";
        case 3:
            return "(239, 230, 29)";
        case 4:
            return "(243, 174, 19)";
        case 5:
            return "(228, 101, 8)";
        case 6:
            return "(204, 45, 24)";
        case 7:
            return "(176, 13, 45)";
        case 8:
            return "(122, 125, 130)"
        case 9:
            return "(0, 0, 0)";
        default:
            return "(70, 190, 246)";
    }
}
// let div = document.createElement('div')
// div.classList.add('pixel')
// div.style.width = statics.PIXEL_SIZE + "px"
// div.style.height = statics.PIXEL_SIZE + "px"
// canevas.appendChild(div)

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////   WIDTH AND HEIGHT MANAGEMENT   //////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const width = document.getElementById("width");
const height = document.getElementById("height");

width.addEventListener("input", updateValue);
height.addEventListener("input", updateValue);

function updateValue(e) {
    switch (e.target.name) {
        case "width":
            return updateWidth(Number(e.target.value));
        case "height":
            return updateHeight(Number(e.target.value))
    }
}

function updateWidth(newWidth) {
    if (newWidth > data.width) {
        data.width = newWidth;
        createNewChuncks({
            direction: "width"
        })
    }
}

function updateHeight(newHeight) {
    data.height = newHeight;
    createNewChuncks({
        direction: "height"
    })
}