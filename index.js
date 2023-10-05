const statics = {
    CHUNCK_SIZE: 300,
    PIXEL_SIZE: 10
}
const data = {
    possibleValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    chuncks: {
        lines: [
            []
        ]
    },
    width: 1,
    height: 1
}

const canevas = document.getElementById("canvas");
const ctx = canevas.getContext("2d");


initApp();

function initApp() {
    createFirstChunck()
}


function createFirstChunck() {
    const filledChunck = fillFirstChunck(createEmptyChunck())
    data.chuncks.lines[0].push(filledChunck)
    drawElement(data.chuncks.lines.length - 1, data.chuncks.lines.length - 1);
}

function createNewChuncks(options = {}) {
    let previousChunck = options.direction === "width" ? data.chuncks.lines[options.currentLine || 0][data.chuncks.lines[options.currentLine || 0].length - 1] : data.chuncks.lines[data.chuncks.lines.length - 1][0]
    let previousHorizontalChunck =  options.direction === "width" || options.columnIndex ? data.chuncks.lines[options.currentLine || 0][data.chuncks.lines[options.currentLine || 0].length - 1] : [];
    let previousVerticalChunck = options.direction === "height" || options.currentLine  ? data.chuncks.lines[options.currentLine ? options.currentLine - 1 : data.chuncks.lines.length - 1][options.columnIndex || 0] : [];
    // const preparedChunck = prepareChunck(createEmptyChunck(), previousChunck, options.direction)
    const preparedChunck = prepareChunck(createEmptyChunck(), previousHorizontalChunck, previousVerticalChunck, options.direction)
    const filledChunck = fillChunck(preparedChunck, {
        action: "add",
        direction: options.direction
    })
    if (options.direction === "width") {
        data.chuncks.lines[options.currentLine || 0].push(filledChunck)
        drawElement(data.chuncks.lines[options.currentLine || 0].length - 1, options.currentLine || 0)
    } else {
        data.chuncks.lines.push([filledChunck])
        drawElement(0, data.chuncks.lines.length - 1)
    }
    console.log(data)
}
function prepareChunck(emptyChunck, previousHorizontalChunck, previousVerticalChunck, direction) {
    if (previousHorizontalChunck.length && !previousVerticalChunck.length) {
        for (let i = 0; i < emptyChunck.length; i++) {
            emptyChunck[i][0] = previousHorizontalChunck[i][previousHorizontalChunck.length - 1]
        }
    } else if (previousVerticalChunck.length && !previousHorizontalChunck.length) {
        for (let i = 0; i < emptyChunck.length; i++) {
            emptyChunck[0][i] = previousVerticalChunck[previousVerticalChunck.length - 1][i]
        }
    } else {
        const previousLine = previousVerticalChunck[previousVerticalChunck.length - 1]
        const previousLineFirstValue = previousLine[0]
        const previousColumnLastValue = previousHorizontalChunck[0][previousHorizontalChunck[0].length -1]
        if (previousColumnLastValue !== previousLineFirstValue) {

        } else {
            for (let i = 0; i < emptyChunck.length; i++) {
                emptyChunck[i][0] = previousHorizontalChunck[i][previousHorizontalChunck.length - 1]
            }   
            for (let i = 0; i < emptyChunck.length; i++) {
                emptyChunck[0][i] = previousVerticalChunck[previousVerticalChunck.length - 1][i]
            }         
        }
    }
    return emptyChunck
}

// function prepareChunck(emptyChunck, previousChunck, direction) {
//     if (direction === "width") {
//         for (let i = 0; i < emptyChunck.length; i++) {
//             emptyChunck[i][0] = previousChunck[i][previousChunck.length - 1]
//         }
//     } else {
//         for (let i = 0; i < emptyChunck.length; i++) {
//             emptyChunck[0][i] = previousChunck[previousChunck.length - 1][i]
//         }
//     }
//     return emptyChunck
// }

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
    chunck = getChunckCorners(chunck);
    if (options.direction === "width") {
        chunck = interpolateColumn(chunck, chunck.length - 1);
        for (let i = 0; i < chunck.length; i++) {
            if (chunck[i][1] === "") {
                chunck = interpolateLine(chunck, i);
            }
        }
        return chunck;
    } else {
        console.log(chunck)
        chunck = interpolateColumn(chunck, 0);
        chunck = interpolateColumn(chunck, chunck.length - 1);
        for (let i = 0; i < chunck.length; i++) {
            if (chunck[i][1] === "") {
                chunck = interpolateLine(chunck, i);
            }
        }
        return chunck;
    }
}

function getChunckCorners(chunck) {
    if (chunck[0][0] === "") {
        chunck[0][0] = getRandomValue();
    }
    if (chunck[0][chunck.length - 1] === "") {
        chunck[0][chunck.length - 10] = getRandomValue();
    }
    if (chunck[chunck.length - 1][0] === "") {
        chunck[chunck.length - 1][0] = getRandomValue();
    }
    if (chunck[chunck.length - 1][chunck.length - 1] === "") {
        chunck[chunck.length - 1][chunck.length - 1] = getRandomValue();
    }
    return chunck;
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

function drawElement(chunckIndex, lineIndex) {
    const currentChunck = data.chuncks.lines[lineIndex][chunckIndex];
    return currentChunck.map((line, lineItemIndex) => {
        return line.map((pix, pixIndex) => {
            const color = "rgb" + getColor(pix)
            ctx.fillStyle = color;
            ctx.fillRect(getPixelXPosition(pixIndex, chunckIndex), getPixelYPosition(lineIndex, lineItemIndex), statics.PIXEL_SIZE, statics.PIXEL_SIZE);
        })
    })
}

function getPixelXPosition(pixelIndex, chunckIndex) {
    return pixelIndex * statics.PIXEL_SIZE + (chunckIndex * statics.CHUNCK_SIZE);
}

function getPixelYPosition(lineIndex, lineItemIndex) {
    return (lineItemIndex * statics.PIXEL_SIZE) + (lineIndex * statics.CHUNCK_SIZE)
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
        });
        for (let i = 0; i < data.chuncks.lines.length; i++) {
            if (data.chuncks.lines[i].length < data.width) {
                const diff = data.width - data.chuncks.lines[i].length;
                for (let j = 0; j < diff; j++) {
                    createNewChuncks({
                        direction: "width",
                        currentLine: i,
                        currentColumn: j
                    });
                }
            }
        }
    }
}

function updateHeight(newHeight) {
    if (newHeight > data.height) {
        data.height = newHeight;
        createNewChuncks({
            direction: "height"
        });
        for (let i = 0; i < data.chuncks.lines[0].length - 1; i++) {
            createNewChuncks({
                direction: "width",
                currentLine: data.chuncks.lines.length - 1,
                columnIndex: i + 1
            });
        }
    }
}