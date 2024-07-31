/*
    Class Name: RetroGameScene
    Class Description: TODO
*/
class RetroGameScene {
    /*
        Method Name: constructor
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    constructor(){
        this.objects = [];
        this.entities = new NotSamLinkedList();
        this.focusedEntity = null;
        this.chunks = new NotSamLinkedList();
        this.expiringVisuals = new NotSamLinkedList();
        this.displayingPhyiscalLayer = false;
    }
    /*
        Method Name: getEntities
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    getEntities(){
        return this.entities;
    }

    findInstantCollisionForProjectile(startX, startY, angleRAD, range=Number.MAX_SAFE_INTEGER, entityExceptionFunction=(entity) => { return false; }){
        let startingTileX = RetroGameScene.getTileXAt(startX);
        let startingTileY = RetroGameScene.getTileYAt(startY);

        let finalOffsetX = range * Math.cos(angleRAD);
        let finalOffsetY = range * Math.sin(angleRAD);

        let xDirection = finalOffsetX < 0 ? -1 : 1;
        let yDirection = finalOffsetY < 0 ? -1 : 1;

        let endX = startX + finalOffsetX;
        let endY = startY + finalOffsetY;

        // Find end x,y for physical tiles and the range
        // Note: This is useful so it doesn't go to check tile x=500 when no tiles exist after x=10
        let chunkXEnd = startX;
        let chunkYEnd = startY;
        for (let [chunk, chunkIndex] of this.chunks){
            if (finalOffsetX > 0){
                chunkXEnd = Math.max(chunkXEnd, chunk.getNaturalRightX() * RETRO_GAME_DATA["general"]["tile_size"]);
            }else{
                chunkXEnd = Math.min(chunkXEnd, chunk.getNaturalLeftX() * RETRO_GAME_DATA["general"]["tile_size"]);
            }

            if (finalOffsetY > 0){
                chunkYEnd = Math.max(chunkYEnd, chunk.getNaturalTopY() * RETRO_GAME_DATA["general"]["tile_size"]);
            }else{
                chunkYEnd = Math.min(chunkYEnd, chunk.getNaturalBottomY() * RETRO_GAME_DATA["general"]["tile_size"]);
            }
        }

        let endTileX = RetroGameScene.getTileXAt(endX);
        let endTileY = RetroGameScene.getTileYAt(endY);

        // Loop through each tile x, tile y
        let x = startX;
        let y = startY;

        let distanceToNextMultipleInDirection = (value, base, direction) => {
            let multiple = value / base;
            if (multiple > 0 && direction > 0){
                return (Math.ceil(multiple) - multiple) * base;
            }else if (multiple > 0 && direction < 0){
                return (multiple - Math.floor(multiple)) * base;
            }else if (multiple < 0 && direction > 0){
                return (multiple - Math.ceil(multiple)) * -1 * base;
            }else{ // (proportion <= 0 && direction <= 0) || direction == 0
                return (Math.floor(multiple) - multiple) * -1 * base;
            }
        }

        let physicalTileCollision = null;

        let tileX = RetroGameScene.getTileXAt(x);
        let tileY = RetroGameScene.getTileYAt(y);
        let tileEntrySide;

        // Come up with initial values (incase shooting from inside a physical tile)
        {
            let distanceToNextTileX = distanceToNextMultipleInDirection(x, RETRO_GAME_DATA["general"]["tile_size"], xDirection);
            let distanceToNextTileY = distanceToNextMultipleInDirection(y, RETRO_GAME_DATA["general"]["tile_size"], yDirection);
            let timeToNextTileX = safeDivide(distanceToNextTileX, Math.abs(Math.cos(angleRAD)), 1e-7, Number.MAX_SAFE_INTEGER); 
            let timeToNextTileY = safeDivide(distanceToNextTileY, Math.abs(Math.sin(angleRAD)), 1e-7, Number.MAX_SAFE_INTEGER);
            if (timeToNextTileX < timeToNextTileY){
                tileEntrySide = xDirection > 0 ? "right" : "left";
            }else{
                tileEntrySide = yDirection > 0 ? "top" : "bottom";
            }
        }

        // Loop from start to end but stop if you exceed where all existing chunk boundaries
        while (lessThanEQDir(tileX, endTileX, xDirection) && lessThanEQDir(tileY, endTileY, yDirection) && lessThanEQDir(x, chunkXEnd, xDirection) && lessThanEQDir(y, chunkYEnd, yDirection)){
            if (this.hasPhysicalTileCoveringLocation(tileX, tileY)){
                let tile = this.getPhysicalTileCoveringLocation(tileX, tileY);
                if (tile.hasAttribute("solid")){
                    let hitX;
                    let hitY;
                    if (tileEntrySide == "left"){
                        hitX = tileX * RETRO_GAME_DATA["general"]["tile_size"];
                        hitY = startY + Math.abs(safeDivide((hitX - startX), Math.cos(angleRAD), 1e-7, 0)) * Math.sin(angleRAD);
                    }else if (tileEntrySide == "right"){
                        hitX = (tileX+1) * RETRO_GAME_DATA["general"]["tile_size"];
                        hitY = startY + Math.abs(safeDivide((hitX - startX), Math.cos(angleRAD), 1e-7, 0)) * Math.sin(angleRAD);
                    }else if (tileEntrySide == "top"){
                        hitY = this.getYOfTile(tileY); // Note: This is because tile y is the bottom left, the display is weird, sorry
                        hitX = startX + Math.abs(safeDivide((hitY - startY), Math.sin(angleRAD), 1e-7, 0)) * Math.cos(angleRAD);
                    }else{ // tileEntrySide == "bottom"
                        hitY = this.getYOfTile(tileY) - RETRO_GAME_DATA["general"]["tile_size"];
                        hitX = startX + Math.abs(safeDivide((hitY - startY), Math.sin(angleRAD), 1e-7, 0)) * Math.cos(angleRAD);
                    }
                    let distance = Math.sqrt(Math.pow(hitX - startX, 2) + Math.pow(hitY - startY, 2));
                    physicalTileCollision = {
                        "tile": tile,
                        "distance": distance,
                        "x": hitX,
                        "y": hitY
                    }
                    break;
                }
            }
            let distanceToNextTileX = distanceToNextMultipleInDirection(x, RETRO_GAME_DATA["general"]["tile_size"], xDirection);
            let distanceToNextTileY = distanceToNextMultipleInDirection(y, RETRO_GAME_DATA["general"]["tile_size"], yDirection);
            if (distanceToNextTileX == 0){
                distanceToNextTileX = RETRO_GAME_DATA["general"]["tile_size"];
            }

            if (distanceToNextTileY == 0){
                distanceToNextTileY = RETRO_GAME_DATA["general"]["tile_size"];
            }

            let timeToNextTileX = safeDivide(distanceToNextTileX, Math.abs(Math.cos(angleRAD)), 1e-7, Number.MAX_SAFE_INTEGER); 
            let timeToNextTileY = safeDivide(distanceToNextTileY, Math.abs(Math.sin(angleRAD)), 1e-7, Number.MAX_SAFE_INTEGER);
            let additionalX = 0;
            let additionalY = 0;
            let time = Math.min(timeToNextTileX, timeToNextTileY);
            if (timeToNextTileX < timeToNextTileY){
                tileEntrySide = xDirection < 0 ? "right" : "left";
                additionalX = xDirection;
            }else{
                tileEntrySide = yDirection < 0 ? "top" : "bottom";
                additionalY = yDirection;
            }
            x += Math.cos(angleRAD) * time;
            y += Math.sin(angleRAD) * time;
            // Add an extra 1 in whatever direction to 
            tileX = RetroGameScene.getTileXAt(x + additionalX);
            tileY = RetroGameScene.getTileYAt(y + additionalY);
        }
        // Located a physical tile (if any) that collides with the projectile
        let collidesWithAPhysicalTile = physicalTileCollision != null;

        // Check all entities for collision
        let hitEntityDetails = null;
        for (let [entity, entityIndex] of this.entities){
            if (entityExceptionFunction(entity)){ continue; }
            let entityX = entity.getInterpolatedTickCenterX();
            let entityY = entity.getInterpolatedTickCenterY();
            let entityWidth = entity.getWidth();
            let entityHeight = entity.getHeight();
            let entityLeftX = entityX - entityWidth/2;
            let entityRightX = entityX + entityWidth/2;
            let entityBottomY = entityY - entityHeight/2;
            let entityTopY = entityY + entityHeight/2;
            // Simple checks
            if (startX < entityLeftX && endX < entityLeftX){ continue; }
            if (startX > entityRightX && endX > entityRightX){ continue; }
            if (startY < entityBottomY && endY < entityBottomY){ continue; }
            if (startY > entityTopY && endY > entityTopY){ continue; }

            // Check if starting inside
            if (startX >= entityLeftX && startX <= entityRightX && startY >= entityBottomY && startY <= entityTopY){
                hitEntityDetails = {
                    "entity": entity,
                    "distance": 0
                }
                break;
            }

            // Find if it hits at some point, we know it either hits left/right/top/bottom at some point
            let timeToLeftX = safeDivide(entityLeftX - startX, finalOffsetX, 1e-7, null);
            let timeToRightX = safeDivide(entityRightX - startX, finalOffsetX, 1e-7, null);
            
            if (timeToLeftX != null && timeToLeftX >= 0){
                let yAtLeftX = startY + finalOffsetY * timeToLeftX;
                if (yAtLeftX >= entityBottomY && yAtLeftX <= entityTopY){
                    if (hitEntityDetails == null || hitEntityDetails["time"] > timeToLeftX){
                        hitEntityDetails = {
                            "entity": entity,
                            "time": timeToLeftX,
                            "distance": Math.sqrt(Math.pow(entityLeftX - startX, 2) + Math.pow(yAtLeftX - startY, 2)),
                            "type": "left"
                        }
                    }
                }
            }
            if (timeToRightX != null && timeToRightX >= 0){
                let yAtRightX = startY + finalOffsetY * timeToRightX;
                if (yAtRightX >= entityBottomY && yAtRightX <= entityTopY){
                    if (hitEntityDetails == null || hitEntityDetails["time"] > timeToRightX){
                        hitEntityDetails = {
                            "entity": entity,
                            "time": timeToRightX,
                            "distance": Math.sqrt(Math.pow(entityRightX - startX, 2) + Math.pow(yAtRightX - startY, 2)),
                            "type": "right"
                        }
                    }
                }
            }

            let timeToTopY = safeDivide(entityTopY - startY, finalOffsetY, 1e-7, null);
            let timeToBottomY = safeDivide(entityBottomY - startY, finalOffsetY, 1e-7, null);
            
            if (timeToTopY != null && timeToTopY >= 0){
                let xAtTopY = startX + finalOffsetX * timeToTopY;
                if (xAtTopY >= entityLeftX && xAtTopY <= entityRightX){
                    if (hitEntityDetails == null || hitEntityDetails["time"] > timeToTopY){
                        hitEntityDetails = {
                            "entity": entity,
                            "time": timeToTopY,
                            "distance": Math.sqrt(Math.pow(xAtTopY - startX, 2) + Math.pow(entityTopY - startY, 2)),
                            "type": "top"
                        }
                    }
                }
            }

            if (timeToBottomY != null && timeToBottomY >= 0){
                let xAtBottomY = startX + finalOffsetX * timeToBottomY;
                if (xAtBottomY >= entityLeftX && xAtBottomY <= entityRightX){
                    if (hitEntityDetails == null || hitEntityDetails["time"] > timeToBottomY){
                        hitEntityDetails = {
                            "entity": entity,
                            "time": timeToBottomY,
                            "distance": Math.sqrt(Math.pow(xAtBottomY - startX, 2) + Math.pow(entityBottomY - startY, 2)),
                            "type": "bottom"
                        }
                    }
                }
            }
        }
        let hitsEntity = hitEntityDetails != null;
        let resultObject = {
            "collision_type": null,
            "x": startX + finalOffsetX,
            "y": startY + finalOffsetY,
        };
        if (collidesWithAPhysicalTile){
            resultObject = {
                "collision_type": "physical_tile",
                "x": physicalTileCollision["x"],
                "y": physicalTileCollision["y"],
            }
        }
        if (hitsEntity && collidesWithAPhysicalTile && hitEntityDetails["distance"] < physicalTileCollision["distance"]){
            resultObject = {
                "collision_type": "entity",
                "entity": hitEntityDetails["entity"]
            }
        }else if (hitsEntity && !collidesWithAPhysicalTile){
            resultObject = {
                "collision_type": "entity",
                "entity": hitEntityDetails["entity"]
            }
        }
        console.log("sample_code.js (L275)", "I'm here!!!");
        console.log("sample_code.js (L276) I'm here!!!");
        return resultObject;
    }

    /*
        Method Name: setDisplayPhysicalLayer
        Method Parameters: 
            value:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    setDisplayPhysicalLayer(value){
        this.displayingPhyiscalLayer = value;
    }

    /*
        Method Name: isDisplayingPhysicalLayer
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    isDisplayingPhysicalLayer(){
        return this.displayingPhyiscalLayer;
    }

    /*
        Method Name: isInSameMultiCover
        Method Parameters: 
            entity1:
                TODO
             entity2:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    isInSameMultiCover(entity1, entity2){
        let entity1TileX = entity1.getTileX();
        let entity2TileX = entity2.getTileX();

        let entity1TileY = entity1.getTileY();
        let entity2TileY = entity2.getTileY();

        // Note: Function assumes both are in multicover

        let tilesToCheck = [{"checked": false, "x": entity1TileX, "y": entity1TileY}];
        let tilesLeftToCheck = true;

        while (tilesLeftToCheck){
            tilesLeftToCheck = false;
            let currentTile = null;

            // Find a tile to start with
            for (let tile of tilesToCheck){
                if (!tile["checked"]){
                    currentTile = tile;
                    break;
                }
            }
            // If can't find a tile then
            if (currentTile == null){ break; }

            // If currently adjacent to other tile then count as in same multi cover
            if (Math.abs(entity2TileX - currentTile["x"]) + Math.abs(entity2TileY - currentTile["y"]) <= 1){
                return true;
            }

            // Explore tiles around current location
            let pairs = [[currentTile["x"], currentTile["y"]+1], [currentTile["x"], currentTile["y"]-1], [currentTile["x"]+1, currentTile["y"]], [currentTile["x"]-1, currentTile["y"]]];
            for (let pair of pairs){
                let tileX = pair[0];
                let tileY = pair[1];

                let isMultiCover = this.tileAtLocationHasAttribute(tileX, tileY, "multi_cover");
                // Disregard if not mutli cover
                if (!isMultiCover){ continue; }

                let alreadyExists = false;
                
                // Check if its already on the todo list
                for (let tile of tilesToCheck){
                    if (tile["x"] == tileX && tile["y"] == tileY){
                        alreadyExists = true;
                        break;
                    }
                }
                // Found a new tile
                if (!alreadyExists){
                    tilesLeftToCheck = true;
                    tilesToCheck.push({
                        "checked": false,
                        "x": tileX,
                        "y": tileY
                    });
                }
            }
            currentTile["checked"] = true;
            // Extra check to see if not done
            if (!tilesLeftToCheck){
                for (let tile of tilesToCheck){
                    if (!tile["checked"]){
                        tilesLeftToCheck = true;
                        break;
                    }
                }
            }
        }
        //stop()
        return false;
    }

    /*
        Method Name: tileAtLocationHasAttribute
        Method Parameters: 
            tileX:
                TODO
             tileY:
                TODO
             attribute:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    tileAtLocationHasAttribute(tileX, tileY, attribute){
        if (!this.hasPhysicalTileCoveringLocation(tileX, tileY)){ return false; }
        let tileAtLocation = this.getPhysicalTileCoveringLocation(tileX, tileY);
        return tileAtLocation.hasAttribute(attribute);
    }

    /*
        Method Name: loadMaterialList
        Method Parameters: 
            materialList:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    async loadMaterialList(materialList){
        // Load materials
        for (let materialObject of materialList){
            // Note: Assuming the user will NEVER use the same name for two different images
            if (objectHasKey(IMAGES, materialObject["name"])){ return; }
            IMAGES[materialObject["name"]] = await loadLocalImage(materialObject["file_link"]);
        }
    }

    /*
        Method Name: loadTilesFromString
        Method Parameters: 
            tileJSONStr:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    async loadTilesFromString(tileJSONStr){
        await this.loadTilesFromJSON(JSON.parse(tileJSONStr));
    }

    /*
        Method Name: loadTilesFromJSON
        Method Parameters: 
            tileJSON:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    async loadTilesFromJSON(tileJSON){
        // Clear current chunks
        this.chunks.clear();
        
        // Load Materials
        await this.loadMaterialList(tileJSON["materials"])

        // Load visual tiles
        for (let tile of tileJSON["visual_tiles"]){
            let material = null;
            // Note: Assuming material exists
            for (let materialObject of tileJSON["materials"]){
                if (materialObject["name"] == tile["material"]){
                    material = materialObject;
                    break;
                }
            }
            this.placeVisualTile(material, tile["tile_x"], tile["tile_y"]);
        }

        // Load Physical Tiles
        for (let tile of tileJSON["physical_tiles"]){
            let material = null;
            // Note: Assuming material exists
            for (let materialObject of tileJSON["materials"]){
                if (materialObject["name"] == tile["material"]){
                    material = materialObject;
                    break;
                }
            }
            this.placePhysicalTile(material, tile["tile_x"], tile["tile_y"]);
        }
    }

    /*
        Method Name: toTileJSON
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    toTileJSON(){
        let tileJSON = {};
        tileJSON["materials"] = [];
        tileJSON["visual_tiles"] = [];
        tileJSON["physical_tiles"] = [];
        // Save Visual Chunks to JSON
        for (let [chunk, cI] of this.chunks){
            for (let [tile, tI] of chunk.getVisualTiles()){
                let material = tile.getMaterial();
                let materialExists = false;
                for (let savedMaterial of tileJSON["materials"]){
                    if (savedMaterial["name"] == material["name"]){
                        materialExists = true;
                        break;
                    }
                }
                // Save material if applicable
                if (!materialExists){
                    tileJSON["materials"].push(material);
                }
                let individualTileJSON = {
                    "material": material["name"],
                    "tile_x": tile.getTileX(),
                    "tile_y": tile.getTileY()
                }
                tileJSON["visual_tiles"].push(individualTileJSON);
            }
        }

        // Save Physical Chunks to JSON
        for (let [chunk, cI] of this.chunks){
            for (let [tile, tI] of chunk.getPhysicalTiles()){
                let material = tile.getMaterial();
                let materialExists = false;
                for (let savedMaterial of tileJSON["materials"]){
                    if (savedMaterial["name"] == material["name"]){
                        materialExists = true;
                        break;
                    }
                }
                // Save material if applicable
                if (!materialExists){
                    tileJSON["materials"].push(material);
                }
                let individualTileJSON = {
                    "material": material["name"],
                    "tile_x": tile.getTileX(),
                    "tile_y": tile.getTileY()
                }
                tileJSON["physical_tiles"].push(individualTileJSON);
            }
        }
        return tileJSON;
    }

    /*
        Method Name: getMaterialImage
        Method Parameters: 
            materialName:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    getMaterialImage(materialName){
        return IMAGES[materialName];
    }

    /*
        Method Name: getMaterialXTileSize
        Method Parameters: 
            materialName:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    getMaterialXTileSize(materialName){
        return this.getMaterialImage(materialName).width / RETRO_GAME_DATA["general"]["tile_size"];
    }

    /*
        Method Name: getMaterialYTileSize
        Method Parameters: 
            materialName:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    getMaterialYTileSize(materialName){
        return this.getMaterialImage(materialName).height / RETRO_GAME_DATA["general"]["tile_size"];
    }

    /*
        Method Name: hasEntityFocused
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    hasEntityFocused(){
        return this.focusedEntity != null;
    }

    /*
        Method Name: getFocusedEntity
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    getFocusedEntity(){
        return this.focusedEntity;
    }

    /*
        Method Name: setFocusedEntity
        Method Parameters: 
            entity:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    setFocusedEntity(entity){
        this.focusedEntity = entity;
    }

    /*
        Method Name: getWidth
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    getWidth(){
        return getCanvasWidth();
    }

    /*
        Method Name: getHeight
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    getHeight(){
        return getCanvasHeight();
    }

    /*
        Method Name: tick
        Method Parameters: 
            timeMS:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    tick(timeMS){
        if (USER_INPUT_MANAGER.isActivated("p_ticked")){
           this.setDisplayPhysicalLayer(!this.isDisplayingPhysicalLayer());
        }
        // Tick the entities
        for (let [entity, itemIndex] of this.entities){
            entity.tick(timeMS);
        }
    }

    /*
        Method Name: placeVisualTile
        Method Parameters: 
            material:
                TODO
             tileX:
                TODO
             tileY:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    placeVisualTile(material, tileX, tileY){
        // Delete all other tiles that are covered by region
        let materialXTileSize = this.getMaterialXTileSize(material["name"]);
        let materialYTileSize = this.getMaterialYTileSize(material["name"]);
        // Only delete if placing an extra large tile
        if (materialXTileSize > 1 || materialYTileSize > 1){
            for (let dTileX = tileX; dTileX < tileX + materialXTileSize; dTileX++){
                for (let dTileY = tileY; dTileY > tileY - materialYTileSize; dTileY--){
                    this.deleteVisualTile(dTileX, dTileY);
                }
            }
        }

        // Place tile
        let chunk = this.getCreateChunkAtLocation(tileX, tileY);
        chunk.placeVisualTile(material, tileX, tileY);
    }

    /*
        Method Name: placePhysicalTile
        Method Parameters: 
            material:
                TODO
             tileX:
                TODO
             tileY:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    placePhysicalTile(material, tileX, tileY){
        // Place tile
        let chunk = this.getCreateChunkAtLocation(tileX, tileY);
        chunk.placePhysicalTile(material, tileX, tileY);
    }

    /*
        Method Name: deleteVisualTile
        Method Parameters: 
            tileX:
                TODO
             tileY:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    deleteVisualTile(tileX, tileY){
        if (this.hasVisualTileAtLocation(tileX, tileY)){
            this.getVisualTileAtLocation(tileX, tileY).delete();
        }
    }

    /*
        Method Name: deletePhysicalTile
        Method Parameters: 
            tileX:
                TODO
             tileY:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    deletePhysicalTile(tileX, tileY){
        if (this.hasPhysicalTileAtLocation(tileX, tileY)){
            this.getPhysicalTileAtLocation(tileX, tileY).delete();
        }
    }

    /*
        Method Name: hasVisualTileAtLocation
        Method Parameters: 
            tileX:
                TODO
             tileY:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    hasVisualTileAtLocation(tileX, tileY){
        return this.getVisualTileAtLocation(tileX, tileY) != null;
    }

    /*
        Method Name: hasVisualTileCoveringLocation
        Method Parameters: 
            tileX:
                TODO
             tileY:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    hasVisualTileCoveringLocation(tileX, tileY){
        return this.getVisualTileCoveringLocation(tileX, tileY) != null;
    }


    /*
        Method Name: hasPhysicalTileAtLocation
        Method Parameters: 
            tileX:
                TODO
             tileY:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    hasPhysicalTileAtLocation(tileX, tileY){
        return this.getPhysicalTileAtLocation(tileX, tileY) != null;
    }

    /*
        Method Name: hasPhysicalTileCoveringLocation
        Method Parameters: 
            tileX:
                TODO
             tileY:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    hasPhysicalTileCoveringLocation(tileX, tileY){
        return this.hasPhysicalTileAtLocation(tileX, tileY);
    }


    /*
        Method Name: getVisualTileCoveringLocation
        Method Parameters: 
            tileX:
                TODO
             tileY:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    getVisualTileCoveringLocation(tileX, tileY){
        for (let [chunk, cI] of this.chunks){
            if (chunk.covers(tileX, tileY)){
                return chunk.getVisualTileCoveringLocation(tileX, tileY);
            }
        }
        return null;
    }

    /*
        Method Name: getPhysicalTileCoveringLocation
        Method Parameters: 
            tileX:
                TODO
             tileY:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    getPhysicalTileCoveringLocation(tileX, tileY){
        return this.getPhysicalTileAtLocation(tileX, tileY);
    }

    /*
        Method Name: getCreateChunkAtLocation
        Method Parameters: 
            tileX:
                TODO
             tileY:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    getCreateChunkAtLocation(tileX, tileY){
        let existingChunk = this.getChunkAtLocation(tileX, tileY);
        // Create if not existing
        if (existingChunk == null){
            existingChunk = new Chunk(this, Chunk.tileToChunkCoordinate(tileX), Chunk.tileToChunkCoordinate(tileY));
            this.chunks.push(existingChunk);
        }
        return existingChunk;
    }

    /*
        Method Name: getChunkAtLocation
        Method Parameters: 
            tileX:
                TODO
             tileY:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    getChunkAtLocation(tileX, tileY){
        for (let [chunk, chunkIndex] of this.chunks){
            if (chunk.coversNaturally(tileX, tileY)){
                return chunk;
            }
        }
        return null;
    }

    // Note: This is only tiles naturally at location not just covering
    /*
        Method Name: getPhysicalTileAtLocation
        Method Parameters: 
            tileX:
                TODO
             tileY:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    getPhysicalTileAtLocation(tileX, tileY){
        for (let [chunk, chunkIndex] of this.chunks){
            if (chunk.coversNaturally(tileX, tileY)){
                return chunk.getPhysicalTileAtLocation(tileX, tileY);
            }
        }
        return null;
    }

    // Note: This is only tiles naturally at location not just covering
    /*
        Method Name: getVisualTileAtLocation
        Method Parameters: 
            tileX:
                TODO
             tileY:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    getVisualTileAtLocation(tileX, tileY){
        for (let [chunk, chunkIndex] of this.chunks){
            if (chunk.coversNaturally(tileX, tileY)){
                return chunk.getVisualTileAtLocation(tileX, tileY);
            }
        }
        return null;
    }

    /*
        Method Name: hasChunkAtLocation
        Method Parameters: 
            tileX:
                TODO
             tileY:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    hasChunkAtLocation(tileX, tileY){
        return this.getChunkAtLocation(tileX, tileY) != null;
    }

    /*
        Method Name: getTileXAt
        Method Parameters: 
            x:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    static getTileXAt(x){
        return Math.floor(x / RETRO_GAME_DATA["general"]["tile_size"]);
    }

    /*
        Method Name: getTileYAt
        Method Parameters: 
            y:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    static getTileYAt(y){
        return Math.floor(y / RETRO_GAME_DATA["general"]["tile_size"]);
    }

    /*
        Method Name: getDisplayXFromTileX
        Method Parameters: 
            lX:
                TODO
             tileX:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    getDisplayXFromTileX(lX, tileX){
        return (this.getXOfTile(tileX) - lX) * gameZoom;
    }

    /*
        Method Name: getXOfTile
        Method Parameters: 
            tileX:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    getXOfTile(tileX){
        return tileX * RETRO_GAME_DATA["general"]["tile_size"];
    }

    /*
        Method Name: getDisplayYFromTileY
        Method Parameters: 
            bY:
                TODO
             tileY:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    getDisplayYFromTileY(bY, tileY){
        return this.changeToScreenY((this.getYOfTile(tileY) - bY)*gameZoom);
    }

    /*
        Method Name: getYOfTile
        Method Parameters: 
            tileY:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    getYOfTile(tileY){
        return (tileY+1) * RETRO_GAME_DATA["general"]["tile_size"];
    }

    /*
        Method Name: getDisplayX
        Method Parameters:
            centerX:
                The x coordinate of the center of the entity
            width:
                The width of the entity
            lX:
                The bottom left x displayed on the canvas relative to the focused entity
            round:
                If rounded down to nearest pixel
        Method Description: Determines the top left corner where an image should be displayed
        Method Return: int
    */
    /*
        Method Name: getDisplayX
        Method Parameters: 
            centerX:
                TODO
             width:
                TODO
             lX:
                TODO
             round=false:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    getDisplayX(centerX, width, lX, round=false){
        // Find relative to bottom left corner
        let displayX = (centerX - lX) * gameZoom;

        // Change coordinate system
        displayX = this.changeToScreenX(displayX);

        // Find top left corner
        displayX = displayX - width / 2;

        // Round down to nearest pixel
        if (round){
            displayX = Math.floor(displayX);
        }
        return displayX;
    }

    /*
        Method Name: getDisplayY
        Method Parameters:
            centerY:
                The y coordinate of the center of the entity
            height:
                The height of the entity
            bY:
                The bottom left y displayed on the canvas relative to the focused entity
            round:
                If rounded down to nearest pixel
        Method Description: Determines the top left corner where an image should be displayed
        Method Return: int
    */
    /*
        Method Name: getDisplayY
        Method Parameters: 
            centerY:
                TODO
             height:
                TODO
             bY:
                TODO
             round=false:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    getDisplayY(centerY, height, bY, round=false){
        // Find relative to bottom left corner
        let displayY = (centerY - bY) * gameZoom;

        // Change coordinate system
        displayY = this.changeToScreenY(displayY);

        // Find top left corner
        displayY = displayY - height / 2;

        // Round down to nearest pixel
        if (round){
            displayY = Math.floor(displayY);
        }
        return displayY;
    }

    /*
        Method Name: getLX
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    getLX(){
        let lX = 0;
        if (!this.hasEntityFocused()){
            lX = -1 * this.getWidth() / 2 / gameZoom;
        }else{
            lX = this.getFocusedEntity().getInterpolatedCenterX() - (this.getWidth()) / 2 / gameZoom;
        }
        return lX;
    }

    /*
        Method Name: getBY
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    getBY(){
        let bY = 0;
        if (!this.hasEntityFocused()){
            bY = -1 * this.getWidth() / 2 / gameZoom;
        }else{
            bY = this.getFocusedEntity().getInterpolatedCenterY() - (this.getHeight()) / 2 / gameZoom;
        }
        return bY;
    }

    /*
        Method Name: display
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    display(){
        let lX = this.getLX(); // Bottom left x
        let bY = this.getBY(); // Bottom left y
        let rX = lX + this.getWidth() / gameZoom;
        let tY = bY + this.getHeight() / gameZoom;

        // Display Page Background
        this.displayPageBackground();

        // Display Tiles
        for (let [chunk, cI] of this.chunks){
            chunk.display(lX, rX, bY, tY, this.isDisplayingPhysicalLayer());
        }

        // Display Entities
        for (let [entity, eI] of this.entities){
            if (this.hasEntityFocused() && entity.getID() == this.focusedEntity.getID()){ continue; }
            if (!entity.isVisibleTo(this.focusedEntity)){ continue; }
            entity.display(lX, rX, bY, tY);
        }
        

        // Delete expired visuals
        this.expiringVisuals.deleteWithCondition((visual) => {
            return visual.isExpired();
        });
        // Display Expiring Visuals
        for (let [visual, vI] of this.expiringVisuals){
            visual.display(this, lX, rX, bY, tY);
        }

        // Display focused entity
        if (this.hasEntityFocused()){
            this.getFocusedEntity().display(lX, rX, bY, tY);
            this.getFocusedEntity().displayWhenFocused();
        }
    }

    /*
        Method Name: addExpiringVisual
        Method Parameters: 
            expiringVisual:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    addExpiringVisual(expiringVisual){
        this.expiringVisuals.push(expiringVisual);
    }


    /*
        Method Name: changeToScreenX
        Method Parameters: 
            x:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    changeToScreenX(x){
        return x; // Doesn't need to be changed ATM
    }

    /*
        Method Name: changeToScreenY
        Method Parameters: 
            y:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    changeToScreenY(y){
        return this.getHeight() - y;
    }

    /*
        Method Name: changeFromScreenY
        Method Parameters: 
            y:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    changeFromScreenY(y){
        return this.changeToScreenY(y);
    }

    /*
        Method Name: addEntity
        Method Parameters: 
            entity:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    addEntity(entity){
        entity.setID(this.entities.getLength());
        this.entities.push(entity);
    }

    /*
        Method Name: displayPageBackground
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    displayPageBackground(){
        drawingContext.drawImage(IMAGES["page_background"], 0, 0); // TODO: This should be variable in the future
    }
}

/*
    Class Name: Chunk
    Class Description: TODO
*/
class Chunk {
    /*
        Method Name: constructor
        Method Parameters: 
            scene:
                TODO
             chunkX:
                TODO
             chunkY:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    constructor(scene, chunkX, chunkY){
        this.scene = scene;
        this.chunkX = chunkX;
        this.chunkY = chunkY;
        this.visualTiles = new NotSamLinkedList();
        this.physicalTiles = new NotSamLinkedList();
        this.recalculateBoundaries();
    }

    /*
        Method Name: getVisualTiles
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    getVisualTiles(){
        return this.visualTiles;
    }

    /*
        Method Name: getPhysicalTiles
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    getPhysicalTiles(){
        return this.physicalTiles;
    }

    /*
        Method Name: hasPhysicalTileAtLocation
        Method Parameters: 
            tileX:
                TODO
             tileY:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    hasPhysicalTileAtLocation(tileX, tileY){
        return this.getPhysicalTileAtLocation(tileX, tileY) != null;
    }

    /*
        Method Name: hasVisualTileAtLocation
        Method Parameters: 
            tileX:
                TODO
             tileY:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    hasVisualTileAtLocation(tileX, tileY){
        return this.getVisualTileAtLocation(tileX, tileY) != null;
    }

    /*
        Method Name: getVisualTileAtLocation
        Method Parameters: 
            tileX:
                TODO
             tileY:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    getVisualTileAtLocation(tileX, tileY){
        for (let [tile, tileI] of this.visualTiles){
            if (tile.getTileX() == tileX && tile.getTileY() == tileY){
                return tile;
            }
        }
        return null;
    }

    /*
        Method Name: getPhysicalTileAtLocation
        Method Parameters: 
            tileX:
                TODO
             tileY:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    getPhysicalTileAtLocation(tileX, tileY){
        for (let [tile, tileI] of this.physicalTiles){
            if (tile.getTileX() == tileX && tile.getTileY() == tileY){
                return tile;
            }
        }
        return null;
    }

    /*
        Method Name: getVisualTileCoveringLocation
        Method Parameters: 
            tileX:
                TODO
             tileY:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    getVisualTileCoveringLocation(tileX, tileY){
        for (let [tile, tileI] of this.visualTiles){
            if (tile.covers(tileX, tileY)){
                return tile;
            }
        }
        return null;
    }

    /*
        Method Name: getPhysicalTileCoveringLocation
        Method Parameters: 
            tileX:
                TODO
             tileY:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    getPhysicalTileCoveringLocation(tileX, tileY){
        return this.getPhysicalTileAtLocation(tileX, tileY);
    }

    /*
        Method Name: display
        Method Parameters: 
            lX:
                TODO
             rX:
                TODO
             bY:
                TODO
             tY:
                TODO
             displayPhysicalTiles:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    display(lX, rX, bY, tY, displayPhysicalTiles){
        if (!this.touchesRegion(lX, rX, bY, tY)){ return; }
        // Display all tiles
        for (let [tile, tileI] of this.visualTiles){
            tile.display(lX, rX, bY, tY);
        }
        if (displayPhysicalTiles){
            // Display all tiles
            for (let [tile, tileI] of this.physicalTiles){
                tile.display(lX, rX, bY, tY);
            }
        }
    }

    /*
        Method Name: touchesRegion
        Method Parameters: 
            lX:
                TODO
             rX:
                TODO
             bY:
                TODO
             tY:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    touchesRegion(lX, rX, bY, tY){
        let lChunkX = Chunk.tileToChunkCoordinate(RetroGameScene.getTileXAt(lX));
        let rChunkX = Chunk.tileToChunkCoordinate(RetroGameScene.getTileXAt(rX));
        let myRightChunkX = Chunk.tileToChunkCoordinate(this.getRightX());
        let myLeftChunkX = Chunk.tileToChunkCoordinate(this.getLeftX());
        if (myRightChunkX < lChunkX || myLeftChunkX > rChunkX){ return false; }
        let bChunkY = Chunk.tileToChunkCoordinate(RetroGameScene.getTileYAt(bY));
        let tChunkY = Chunk.tileToChunkCoordinate(RetroGameScene.getTileYAt(tY));
        let myTopChunkY = Chunk.tileToChunkCoordinate(this.getTopY());
        let myBottomChunkY = Chunk.tileToChunkCoordinate(this.getBottomY());
        if (myTopChunkY < bChunkY || myBottomChunkY > tChunkY){ return false; }
        return true;
    }

    /*
        Method Name: getLeftX
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    getLeftX(){
        return this.leftX;
    }

    // Note: Be careful if you have a 5000 long tile in bottom right it will extend this right
    /*
        Method Name: getRightX
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    getRightX(){
        return this.rightX;
    }

    /*
        Method Name: getTopY
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    getTopY(){
        return this.topY;
    }

    // Note: Be careful if you have a 5000 long tile in bottom right it will extend this right
    /*
        Method Name: getBottomY
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    getBottomY(){
        return this.bottomY;
    }

    /*
        Method Name: recalculateBoundaries
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    recalculateBoundaries(){
        let bottomY = this.chunkY * RETRO_GAME_DATA["general"]["chunk_size"];
        for (let [tile, tI] of this.visualTiles){
            let tileBottomY = tile.getBottomY();
            if (tileBottomY < bottomY){
                bottomY = tileBottomY;
            }
        }
        this.bottomY = bottomY;

        let rightX = (this.chunkX + 1) * RETRO_GAME_DATA["general"]["chunk_size"] - 1;
        for (let [tile, tI] of this.visualTiles){
            let tileRightX = tile.getRightX();
            if (tileRightX > rightX){
                rightX = tileRightX;
            }
        }
        this.rightX = rightX;
        this.leftX = this.chunkX * RETRO_GAME_DATA["general"]["chunk_size"];
        this.topY = (this.chunkY + 1) * RETRO_GAME_DATA["general"]["chunk_size"] - 1;
    }

    /*
        Method Name: getNaturalLeftX
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    getNaturalLeftX(){
        return this.getLeftX();
    }

    /*
        Method Name: getNaturalRightX
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    getNaturalRightX(){
        return (this.chunkX + 1) * RETRO_GAME_DATA["general"]["chunk_size"] - 1;
    }

    /*
        Method Name: getNaturalTopY
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    getNaturalTopY(){
        return this.getTopY();
    }

    /*
        Method Name: getNaturalBottomY
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    getNaturalBottomY(){
        return this.chunkY * RETRO_GAME_DATA["general"]["chunk_size"];
    }

    /*
        Method Name: covers
        Method Parameters: 
            tileX:
                TODO
             tileY:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    covers(tileX, tileY){
        let chunkLeftX = this.getNaturalLeftX();
        let chunkRightX = this.getNaturalRightX();
        let chunkTopY = this.getNaturalTopY();
        let chunkBottomY = this.getNaturalBottomY();
        // If within natural boundries
        if (tileX >= chunkLeftX && tileX <= chunkRightX && tileY >= chunkBottomY && tileY <= chunkTopY){ return true; }
        // If to the left then no
        if (tileX < chunkLeftX){ return false; }
        // If above it then no
        if (tileY > chunkTopY){ return false; }
        // Check all tiles
        for (let [tile, tileI] of this.visualTiles){
            if (tile.covers(tileX, tileY)){ return true; }
        }
        return false;
    }

    /*
        Method Name: coversNaturally
        Method Parameters: 
            tileX:
                TODO
             tileY:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    coversNaturally(tileX, tileY){
        return Chunk.tileToChunkCoordinate(tileX) == this.chunkX && Chunk.tileToChunkCoordinate(tileY) == this.chunkY;
    }

    /*
        Method Name: placeVisualTile
        Method Parameters: 
            material:
                TODO
             tileX:
                TODO
             tileY:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    placeVisualTile(material, tileX, tileY){
        let tile = this.getVisualTileCoveringLocation(tileX, tileY);
        // If tile doesn't exist, add it
        if (!tile){
            tile = new VisualTile(this.scene, this, material, tileX, tileY);
            this.visualTiles.push(tile);
        }
        // If same tile do nothing
        else if (tile.getMaterialName() == material["name"]){
            return;
        }
        // Else if the tile exists but has a different material then change
        else if (tile.getTileX() == tileX && tile.getTileY() == tileY && tile.getMaterialName() != material["name"]){
            tile.changeMaterial(material);
        }else{
            tile.delete();
            tile = new VisualTile(this.scene, this, material, tileX, tileY);
            this.visualTiles.push(tile);
        }
        this.recalculateBoundaries();
    }

    /*
        Method Name: placePhysicalTile
        Method Parameters: 
            material:
                TODO
             tileX:
                TODO
             tileY:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    placePhysicalTile(material, tileX, tileY){
        let tile = this.getPhysicalTileCoveringLocation(tileX, tileY);
        // If tile doesn't exist, add it
        if (!tile){
            tile = new PhysicalTile(this.scene, this, material, tileX, tileY);
            this.physicalTiles.push(tile);
        }
        // Else if the tile exists but has a different material then change
        else if (tile.getTileX() == tileX && tile.getTileY() == tileY && tile.getMaterialName() != material["name"]){
            tile.changeMaterial(material);
        }else{
            tile.delete();
            tile = new PhysicalTile(this.scene, this, material, tileX, tileY);
            this.physicalTiles.push(tile);
        }
    }

    /*
        Method Name: deleteVisualTile
        Method Parameters: 
            tile:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    deleteVisualTile(tile){
        let tX = tile.getTileX();
        let tY = tile.getTileY();
        // Find and delete the specified tile
        this.visualTiles.deleteWithCondition((tileToDelete) => {
            return tileToDelete.getTileX() == tX && tileToDelete.getTileY() == tY;
        });
        this.recalculateBoundaries();
    }

    /*
        Method Name: deletePhysicalTile
        Method Parameters: 
            tile:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    deletePhysicalTile(tile){
        let tX = tile.getTileX();
        let tY = tile.getTileY();
        // Find and delete the specified tile
        this.physicalTiles.deleteWithCondition((tileToDelete) => {
            return tileToDelete.getTileX() == tX && tileToDelete.getTileY() == tY;
        });
        this.recalculateBoundaries();
    }

    /*
        Method Name: hasNativeVisualTiles
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    hasNativeVisualTiles(){
        return this.visualTiles.isEmpty();
    }

    /*
        Method Name: tileToChunkCoordinate
        Method Parameters: 
            coordinate:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    static tileToChunkCoordinate(coordinate){
        return Math.floor(coordinate / RETRO_GAME_DATA["general"]["chunk_size"]);
    }
}