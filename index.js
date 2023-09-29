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
    const filledChunck = fillFirstChunck(createEmptyChunck())
    data.chuncks.push(filledChunck)
    drawElement(data.chuncks.length - 1);
}

function createNewChuncks(options = {}) {
    const expectedLength = data.width * data.height;
    for (let i = 0; i < expectedLength - data.chuncks.length; i++) {
        let previousChunck = options.direction === "width" ? data.chuncks[data.chuncks.length - 1] : data.chuncks[data.chuncks.length - 1]
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

function interpolateLine(chunck, lineIndex) {
    const delta = 1 / chunck.length;
    let line = chunck[lineIndex];
    const minValue = line[0];
    const maxValue = line[line.length - 1];
    const diff = maxValue - minValue;
    let interpolationValue;
    for (let i = 0; i < line.length; i++) {
        if (line[i] === "") {
            interpolationValue = (delta * i) * diff;
            line[i] = Math.round(minValue + interpolationValue);
        }
    }
    return chunck;
}

function interpolateColumn(chunck, columnIndex) {
    const delta = 1 / chunck.length;
    const minValue = chunck[0][columnIndex];
    const maxValue = chunck[chunck.length - 1][columnIndex];
    const diff = maxValue - minValue;
    for (let i = 0; i < chunck.length; i++) {
        if (chunck[i][columnIndex] === "") {
            interpolationValue = (delta * i) * diff;
            chunck[i][columnIndex] = Math.round(minValue + interpolationValue);
        }
    }
    return chunck;
}

function fillFirstChunck(chunck) {
    chunck[0][0] = getRandomValue();
    chunck[0][chunck.length - 1] = getRandomValue();
    chunck[chunck.length - 1][0] = getRandomValue();
    chunck[chunck.length - 1][chunck.length - 1] = getRandomValue();
    chunck = interpolateLine(chunck, 0)
    chunck = interpolateLine(chunck, chunck.length - 1)
    chunck = interpolateColumn(chunck, 0)
    chunck = interpolateColumn(chunck, chunck.length - 1)
    console.log(chunck)
    for (let i = 0; i < chunck.length; i++) {
        if (chunck[i][1] === "") {
            chunck = interpolateLine(chunck, i);
        }
    }
    return chunck;
}



function getRandomValue() {
    return Math.floor(Math.random() * 10);
}

function fillChunck(chunck, options = {}) {
    if (options.action === "add") {
        chunck[0][chunck.length - 1] = getRandomValue();
        chunck[chunck.length - 1][chunck.length - 1] = getRandomValue();
        chunck = interpolateColumn(chunck, chunck.length - 1);
        for (let i = 0; i < chunck.length; i++) {
            if (chunck[i][1] === "") {
                chunck = interpolateLine(chunck, i);
            }
        }
        return chunck;
    }
}

// function fillChunck(chunck, options = {}) {
//     let r = Math.round(Math.random() * 10);

//     if (!options.action) {
//         if (r <= 7) {
//             r = statics.DOMINANT_TEXTURE
//         }
//         chunck[0][0] = r;
//         for (let i = 0; i < chunck.length; i++) {
//             let line = chunck[i];
//             for (let j = 0; j < line.length; j++) {
//                 if (i === 0) {
//                     let previousValue = line[j - 1]
//                     if (!line[j] && previousValue) {
//                         line[j] = getValue(previousValue)
//                     }
//                 } else {
//                     let previousLinePixelValue = chunck[i - 1][j] || null
//                     let previousValue = chunck[i][j - 1]
//                     if (!line[j]) {
//                         line[j] = getValue(previousValue, previousLinePixelValue)
//                     }
//                 }
//             }
//         }
//     } else {
//         for (let i = 0; i < chunck.length; i++) {
//             let line = chunck[i];
//             for (let j = 0; j < line.length; j++) {
//                 if (!line[j]) {
//                     let previousLinePixelValue = i === 0 ? null : chunck[i - 1][j]
//                     let previousValue = chunck[i][j - 1]
//                     line[j] = getValue(previousValue, previousLinePixelValue)
//                 }
//             }
//         }

//     }

//     return chunck;
// }

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
            return "(4, 51, 89)";
        case 1:
            return "(15, 87, 145)";
        case 2:
            return "(43, 126, 194)";
        case 3:
            return "(71, 162, 237)";
        case 4:
            return "(189, 138, 0)";
        case 5:
            return "(85, 181, 103)";
        case 6:
            return "(57, 145, 73)";
        case 7:
            return "(37, 115, 51)";
        case 8:
            return "(21, 99, 35)"
        case 9:
            return "(0, 0, 0)";
        default:
            return "(4, 51, 89)";
    }
}

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
    if (newHeight > data.height) {
        data.height = newHeight;
        createNewChuncks({
            direction: "height"
        })
    }
}