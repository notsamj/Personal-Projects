class WaterGlassComponent extends Component {
    constructor(centerX, centerY, width, height){
        super();
        this.centerX = centerX;
        this.centerY = centerY;
        this.width = width;
        this.height = height;
        this.fill = 0.4; // placeholder (1 = max)
        this.angleRAD = 0;
        this.waterRectangles = [];
        this.updateWaterRectangles();
    }

    updateFillAndAngle(fillAmount, angleRAD){
        this.fill = fillAmount;
        this.angleRAD = angleRAD;
        this.updateWaterRectangles();
    }

    updateWaterRectangles(){
        let sideWidth = PROGRAM_DATA["menu"]["quiz"]["component_details"]["water_glass_component"]["side_width"];
        let waterWidth = this.width - sideWidth * 2;
        let maxWaterHeight = this.height - sideWidth;
        let numUnits = Math.ceil(this.fill * waterWidth * maxWaterHeight);

        let rectangleXDir = (Math.cos(this.angleRAD) >= 0) ? 1 : -1;
        let rectangleYDir = (Math.sin(this.angleRAD) >= 0) ? 1 : -1;
        let searchStartX;
        let searchStartY;

        // If angle is in [0,90] then the bottom right corner is is expected to contain water
        if (angleBetweenCCWRAD(this.angleRAD, toRadians(0), toRadians(90))){
            searchStartX = waterWidth-1;
            searchStartY = 0;
        }
        // If angle is in (90,180] then the top right corner is is expected to contain water
        else if (angleBetweenCCWRAD(this.angleRAD, toRadians(90), toRadians(180))){
            searchStartX = waterWidth-1;
            searchStartY = maxWaterHeight-1;
        }
        // If angle is in (180,270] then the top left corner is is expected to contain water
        else if (angleBetweenCCWRAD(this.angleRAD, toRadians(180), toRadians(270))){
            searchStartX = 0;
            searchStartY = maxWaterHeight-1;
        }
        // If angle is in (270,360) then the bottom left corner is is expected to contain water
        else{
            searchStartX = 0;
            searchStartY = 0;
        }

        let determineY = (tileX, tileY) => {
            // This should be fine as an approximation?
            let xOffsetFromMiddle = tileX - (waterWidth-1)/2;
            let yOffsetFromMiddle = (tileY + sideWidth) - (this.height)/2;
            return Math.sin(this.angleRAD) * xOffsetFromMiddle + Math.cos(this.angleRAD) * yOffsetFromMiddle;
        }

        let knownTiles = [{"tile_x": searchStartX, "tile_y": searchStartY, "checked": false, "y": determineY(searchStartX, searchStartY)}];
        let unitsToFill = numUnits;

        let selectTile = () => {
            let bestY = Number.MAX_SAFE_INTEGER;
            for (let tile of knownTiles){
                if (!tile["checked"] && tile["y"] < bestY){
                    return tile;
                }
            }
            throw new Error("Asked for a tile when none are available");
        }

        let tryToAddTile = (tileX, tileY) => {
            if (tileX < 0 || tileX >= waterWidth){ return; }
            if (tileY < 0 || tileY >= maxWaterHeight){ return; }
            // Check if present
            for (let tile of knownTiles){
                if (tile["tile_x"] === tileX && tile["tile_y"] === tileY){
                    return;
                }   
            }
            knownTiles.push({"tile_x": tileX, "tile_y": tileY, "checked": false, "y": determineY(tileX, tileY)});
        }

        let tryToAddAdjacentTiles = (tileX, tileY) => {
            tryToAddTile(tileX+1, tileY);
            tryToAddTile(tileX-1, tileY);
            tryToAddTile(tileX, tileY-1);
            tryToAddTile(tileX, tileY+1);
        }

        // Search through tiles until none left
        let fillTiles = [];
        while (unitsToFill > 0){
            let tile = selectTile();
            tile["checked"] = true;
            fillTiles.push(tile);
            unitsToFill--;
            tryToAddAdjacentTiles(tile["tile_x"], tile["tile_y"]);
        }

        let rectangles = [];
        // Mark as not added to rectangle
        for (let tile of fillTiles){
            tile["added_to_rectangle"] = false;
        }

        let hasTilesWithNoRectangles = () => {
            for (let tile of fillTiles){
                if (!tile["added_to_rectangle"]){
                    return true;
                }
            }
            return false;
        }

        let selectRTile = () => {
            for (let tile of fillTiles){
                if (!tile["added_to_rectangle"]){
                    return tile;
                }
            }
            throw new Error("Asked for a tile when none are available");
        }

        let hasTileAvailableForRectangleAt = (tileX, tileY) => {
            //let index = 0;
            for (let tile of fillTiles){
                if (!tile["added_to_rectangle"] && tile["tile_x"] === tileX && tile["tile_y"] === tileY){
                    //console.log(!tile["added_to_rectangle"], tile["tile_x"], tile["tile_y"])
                    //debugger;
                    return true;
                }
                //index++;
            }
            return false;
        }

        let getFillTileAt = (tileX, tileY) => {
            for (let tile of fillTiles){
                if (tile["tile_x"] === tileX && tile["tile_y"] === tileY){
                    return tile;
                }
            }
            debugger;
            throw new Error("Asked for a tile that doesn't exist");
        }


        let createRectangleXFirst = (rectangleStartTile) => {
            let xSize = 1;
            while (hasTileAvailableForRectangleAt(rectangleStartTile["tile_x"] + xSize * rectangleXDir, rectangleStartTile["tile_y"])){
                xSize++;
            }

            let ySize = 1;
            let currentX;
            let increasingYSize = true;
            while (increasingYSize){
                // Loop through all the x's
                currentX = rectangleStartTile["tile_x"];
                while (currentX != rectangleStartTile["tile_x"] + xSize * rectangleXDir){
                    // If you can't expand y because of this tile not fitting then don't
                    if (!hasTileAvailableForRectangleAt(currentX, rectangleStartTile["tile_y"] + ySize * rectangleYDir)){
                        increasingYSize = false;
                        break;
                    }
                    currentX += rectangleXDir;
                }
                if (increasingYSize){
                    ySize++;
                }
            }

            // Create rectangle
            let tileXForDisplay;
            if (rectangleXDir >= 0){
                tileXForDisplay = rectangleStartTile["tile_x"];
            }else{
                tileXForDisplay = rectangleStartTile["tile_x"] - xSize + 1;
            }
            let tileYForDisplay;
            if (rectangleYDir >= 0){
                tileYForDisplay = rectangleStartTile["tile_y"];
            }else{
                tileYForDisplay = rectangleStartTile["tile_y"] - ySize + 1;
            }

            // Mark all as added to a rectangle
            currentX = tileXForDisplay;
            while (currentX < tileXForDisplay + xSize){
                let currentY = tileYForDisplay;
                while (currentY < tileYForDisplay + ySize){
                    let tile = getFillTileAt(currentX, currentY);
                    tile["added_to_rectangle"] = true;
                    currentY += 1;
                }
                currentX += 1;
            }

            rectangles.push({"tile_x": tileXForDisplay, "tile_y": tileYForDisplay, "width": xSize, "height": ySize});
        }

        let createRectangleYFirst = (rectangleStartTile) => {
            let ySize = 1;
            while (hasTileAvailableForRectangleAt(rectangleStartTile["tile_x"], rectangleStartTile["tile_y"] + ySize * rectangleYDir)){
                ySize++;
            }

            let xSize = 1;
            let currentY;
            let increasingXSize = true;
            while (increasingXSize){
                // Loop through all the y's
                currentY = rectangleStartTile["tile_y"];
                while (currentY != rectangleStartTile["tile_y"] + ySize * rectangleYDir){
                    // If you can't expand x because of this tile not fitting then don't
                    if (!hasTileAvailableForRectangleAt(rectangleStartTile["tile_x"] + xSize * rectangleXDir, currentY)){
                        increasingXSize = false;
                        break;
                    }
                    currentY += rectangleYDir;
                }
                if (increasingXSize){
                    xSize++;
                }
            }

            // Create rectangle
            let tileXForDisplay;
            if (rectangleXDir >= 0){
                tileXForDisplay = rectangleStartTile["tile_x"];
            }else{
                tileXForDisplay = rectangleStartTile["tile_x"] - xSize + 1;
            }
            let tileYForDisplay;
            if (rectangleYDir >= 0){
                tileYForDisplay = rectangleStartTile["tile_y"];
            }else{
                tileYForDisplay = rectangleStartTile["tile_y"] - ySize + 1;
            }

            // Mark all as added to a rectangle
            let currentX;
            currentX = tileXForDisplay;
            while (currentX < tileXForDisplay + xSize){
                let currentY = tileYForDisplay;
                while (currentY < tileYForDisplay + ySize){
                    let tile = getFillTileAt(currentX, currentY);
                    tile["added_to_rectangle"] = true;
                    currentY += 1;
                }
                currentX += 1;
            }

            rectangles.push({"tile_x": tileXForDisplay, "tile_y": tileYForDisplay, "width": xSize, "height": ySize});
        }

        let createRectangle = (rectangleStartTile) => {
            let xIsBigger = Math.abs(Math.cos(this.angleRAD)) > Math.abs(Math.sin(this.angleRAD));
            // Seems like the ! is needed
            if (!xIsBigger){
                createRectangleXFirst(rectangleStartTile);
            }else{
                createRectangleYFirst(rectangleStartTile);
            }
        }
        // Create rectangles
        while (hasTilesWithNoRectangles()){
            let rectangleStartTile = selectRTile();
            createRectangle(rectangleStartTile);
        }
        this.waterRectangles = rectangles;
        //console.log(this.waterRectangles)
        //debugger;
    }

    display(){
        let leftHalfWidth = Math.floor(this.width / 2);
        //let rightHalfWidth = Math.ceil(this.width / 2);

        //let bottomHalfHeight = Math.floor(this.height / 2);
        let topHalfHeight = Math.ceil(this.height / 2);

        let x = this.centerX - leftHalfWidth;
        let y = this.centerY - topHalfHeight;
        let width = this.width;
        let height = this.height;

        let sideWidth = PROGRAM_DATA["menu"]["quiz"]["component_details"]["water_glass_component"]["side_width"];

        let rotationAmountRAD = this.angle;

        let waterWidth = this.width - sideWidth * 2;
        let maxWaterHeight = height - sideWidth;
        let waterHeight = Math.ceil(this.fill * maxWaterHeight);

        let waterXOffset = sideWidth + -1 * width / 2;
        let waterYOffset = -1 * height / 2 + (maxWaterHeight - waterHeight);

        translate(x, y);
        rotate(rotationAmountRAD);

        // Glass side
        let glassSideColourCode = PROGRAM_DATA["menu"]["quiz"]["component_details"]["water_glass_component"]["glass_colour"];
        noStrokeRectangle(Colour.fromCode(glassSideColourCode), -1 * width/2, -1 * height/2, width, height);

        // Empty area
        let emptyColourCode = PROGRAM_DATA["menu"]["quiz"]["component_details"]["water_glass_component"]["empty_colour"];
        noStrokeRectangle(Colour.fromCode(emptyColourCode), waterXOffset, -1 * height / 2 + sideWidth, waterWidth, height - sideWidth * 2);

        // Water
        let waterColourCode = PROGRAM_DATA["menu"]["quiz"]["component_details"]["water_glass_component"]["water_colour"];
        //noStrokeRectangle(Colour.fromCode(waterColourCode), waterXOffset, waterYOffset, waterWidth, waterHeight);
        let waterColour = Colour.fromCode(waterColourCode);
        for (let rectangleObj of this.waterRectangles){
            let rectangleXOffset = waterXOffset + rectangleObj["tile_x"];
            //let rectangleYOffset = maxWaterHeight - rectangleObj["tile_y"] - rectangleObj["height"];
            let rectangleYOffset = maxWaterHeight - rectangleObj["tile_y"] - rectangleObj["height"];
            rectangleYOffset *= -1;
            noStrokeRectangle(waterColour, rectangleXOffset, rectangleYOffset, rectangleObj["width"], rectangleObj["height"]);
        }

        rotate(-1 * rotationAmountRAD);
        translate(-1 * x, -1 * y);
    }
}