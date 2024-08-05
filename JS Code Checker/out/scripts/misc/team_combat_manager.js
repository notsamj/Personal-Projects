// When this is opened in NodeJS, import the required files
if (typeof window === "undefined"){
    NotSamLinkedList = require("../general/notsam_linked_list.js");
    NotSamArrayList = require("../general/notsam_array_list.js");
    planeModelToAlliance = require("../general/helper_functions.js").planeModelToAlliance;
    AfterMatchStats = require("./after_match_stats.js");
    Plane = require("../plane/plane.js");
    Bomb = require("../other_entities/simple_projectiles/bomb.js");
    Bullet = require("../other_entities/simple_projectiles/bullet.js");
    Building = require("../other_entities/building.js");
}
/*
    Class Name: TeamCombatManager
    Description: A class that manage planes and bullets in a dogfight.
*/
class TeamCombatManager {
    /*
        Method Name: constructor
        Method Parameters:
            teams:
                The names of the alliances
            game:
                A plane game game
        Method Description: Constructor
        Method Return: Constructor
    */
    /*
        Method Name: constructor
        Method Parameters: 
            teams:
                TODO
             game:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    constructor(teams, game){
        this.planes = {};
        this.bullets = {};
        this.buildings = new NotSamLinkedList();
        this.bombs = new NotSamArrayList(null, PROGRAM_DATA["settings"]["max_bombs"]);
        this.teams = teams;
        this.gamemode = game;
        for (let team of teams){
            this.planes[team] = new NotSamLinkedList();
            this.bullets[team] = new NotSamArrayList(null, PROGRAM_DATA["settings"]["max_bullets_per_team"]);
        }
        this.collisionsDisabled = false;
    }

    /*
        Method Name: setEntities
        Method Parameters:
            entities:
                A list of entities
        Method Description: Removes all planes and adds a bunch of entities
        Method Return: void
    */
    /*
        Method Name: setEntities
        Method Parameters: 
            entities:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    setEntities(entities){
        this.clear();
        for (let entity of entities){
            // Add only appropriate entities
            if (entity instanceof Plane || entity instanceof Bullet || entity instanceof Bomb || entity instanceof Building){
                this.addEntity(entity);
            }
        }
    }

    /*
        Method Name: hasCollisionsDisabled
        Method Parameters: None
        Method Description: Checks if collisions are disabled
        Method Return: Boolean
    */
    /*
        Method Name: hasCollisionsDisabled
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    hasCollisionsDisabled(){
        return this.collisionsDisabled;
    }

    /*
        Method Name: disableCollisions
        Method Parameters: None
        Method Description: Disables collisions
        Method Return: void
    */
    /*
        Method Name: disableCollisions
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    disableCollisions(){
        this.collisionsDisabled = true;
    }

    /*
        Method Name: getAllPlanesFromAlliance
        Method Parameters: 
            allianceName:
                The name of the alliance that the planes belong to
        Method Description: Finds all planes from an alliance
        Method Return: NotSamLinkedList of planes
    */
    /*
        Method Name: getAllPlanesFromAlliance
        Method Parameters: 
            allianceName:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    getAllPlanesFromAlliance(allianceName){
        return this.planes[allianceName];
    }

    /*
        Method Name: clear
        Method Parameters: None
        Method Description: Removes all planes and all bullets
        Method Return: void
    */
    /*
        Method Name: clear
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    clear(){
        this.clearPlanes();
        this.clearBullets();
        this.buildings.clear();
        this.bombs.clear();
    }

    /*
        Method Name: clearPlanes
        Method Parameters: None
        Method Description: Removes all planes
        Method Return: void
    */
    /*
        Method Name: clearPlanes
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    clearPlanes(){
        for (let team of this.teams){
            this.planes[team].clear();
        }
    }

    /*
        Method Name: clearBullets
        Method Parameters: None
        Method Description: Removes all bullets
        Method Return: void
    */
    /*
        Method Name: clearBullets
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    clearBullets(){
        for (let team of this.teams){
            this.bullets[team].clear();
        }
    }

    /*
        Method Name: addEntity
        Method Parameters:
            entity:
                Plane or bullet or bomb or a building
        Method Description: Adds either a plane or a bullet or a bomb or a building
        Method Return: void
    */
    /*
        Method Name: addEntity
        Method Parameters: 
            entity:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    addEntity(entity){
        if (entity instanceof Plane){
            this.addPlane(entity);
        }else if (entity instanceof Bullet){
            this.addBullet(entity);
        }else if (entity instanceof Bomb){
            this.addBomb(entity);
        }else if (entity instanceof Building){
            this.addBuilding(entity);
        }
    }

    /*
        Method Name: hasEntity
        Method Parameters:
            entityID:
                ID of an entity
        Method Description: Determines if it contains an entity with the provided ID
        Method Return: boolean, true -> has entity, false -> does not have entity
    */
    /*
        Method Name: hasEntity
        Method Parameters: 
            entityID:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    hasEntity(entityID){
        return this.getEntity(entityID) != null;
    }

    /*
        Method Name: getEntity
        Method Parameters:
            entityID:
                The id of an entity
        Method Description: Finds an entity if it exists
        Method Return: Entity
    */
    /*
        Method Name: getEntity
        Method Parameters: 
            entityID:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    getEntity(entityID){
        for (let team of this.teams){
            for (let [plane, pIndex] of this.planes[team]){
                if (plane.getID() == entityID){
                    return plane;
                }
            }
            for (let [bullet, bIndex] of this.bullets[team]){
                if (bullet.getID() == entityID){
                    return bullet;
                }
            }
        }
        return null;
    }

    /*
        Method Name: addPlane
        Method Parameters:
            plane:
                A plane to add
        Method Description: Adds a plane to the list of planes, also sets the ID
        Method Return: void
    */
    /*
        Method Name: addPlane
        Method Parameters: 
            plane:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    addPlane(plane){
        let team = planeModelToAlliance(plane.getPlaneClass());
        let planeLL = this.planes[team];
        let newID = planeLL.getLength();
        if (plane.getID() == null){
            plane.setID("p" + "_" + team + "_" + newID);
        }
        planeLL.push(plane);
    }

    /*
        Method Name: addBuilding
        Method Parameters:
            building:
                A building object
        Method Description: Adds a building to the game
        Method Return: void
    */
    /*
        Method Name: addBuilding
        Method Parameters: 
            building:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    addBuilding(building){
        building.setID("building_" + this.buildings.getLength());
        this.buildings.push(building);
    }

    /*
        Method Name: getBuildings
        Method Parameters: None
        Method Description: Getter
        Method Return: A linked list of buildings
    */
    /*
        Method Name: getBuildings
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    getBuildings(){
        return this.buildings;
    }

    /*
        Method Name: addBomb
        Method Parameters:
            bomb:
                A bomb to add
        Method Description: Adds a bomb to the list of bombs, also sets the ID
        Method Return: void
    */
    /*
        Method Name: addBomb
        Method Parameters: 
            bomb:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    addBomb(bomb){
        let bombArray = this.bombs;
        // Replace a dead bomb
        for (let [exisitingBomb, index] of bombArray){
            if (exisitingBomb.isDead()){
                bomb.setID("b" + "_" + index);
                bomb.setIndex(index);
                bombArray.put(index, bomb);
                return true;
            }
        }
        // No empty spaces found...
        if (bombArray.getLength() < bombArray.getSize()){
            let bombIndex = bombArray.getLength();
            bomb.setID("bomb"+ "_" + bombIndex);
            bomb.setIndex(bombIndex);
            bombArray.append(bomb);
            return true;
        }
        return false;
    }

    /*
        Method Name: addBullet
        Method Parameters:
            bullet:
                A bullet to add
        Method Description: Adds a bullet to the list of bullets, also sets the ID
        Method Return: void
    */
    /*
        Method Name: addBullet
        Method Parameters: 
            bullet:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    addBullet(bullet){
        let team = bullet.getAlliance();
        let bulletArray = this.bullets[team];
        for (let [existingBullet, index] of bulletArray){
            if (existingBullet.isDead()){
                bullet.setID("b" + "_" + bullet.getAlliance() + "_" + index);
                bullet.setIndex(index);
                bulletArray.put(index, bullet);
                return true;
            }
        }
        // No empty spaces found...
        if (bulletArray.getLength() < bulletArray.getSize()){
            let bulletIndex = bulletArray.getLength();
            bullet.setID("b"+ "_" + bullet.getAlliance() + "_" + bulletIndex);
            bullet.setIndex(bulletIndex);
            bulletArray.append(bullet);
            return true;
        }
        return false;
    }

    /*
        Method Name: tick
        Method Parameters: None
        Method Description: Makes things happen within a tick
        Method Return: void
    */
    /*
        Method Name: tick
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    tick(){
        for (let team of this.teams){
            for (let [plane, pIndex] of this.planes[team]){
                if (plane.isDead()){ continue; }
                plane.tick();
            }

            for (let [bullet, bIndex] of this.bullets[team]){
                if (bullet.isDead()){ continue; }
                bullet.tick();
            }
        }
        for (let [bomb, bombIndex] of this.bombs){
            if (bomb.isDead()){ continue; }
            bomb.tick();
        }
        this.checkCollisions();
    }

    /*
        Method Name: checkCollisions
        Method Parameters: None
        Method Description: Checks for collisions between planes and bullets
        Method Return: void
    */
    /*
        Method Name: checkCollisions
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    checkCollisions(){
        if (this.hasCollisionsDisabled()){ return; }
        let previousTick = this.gamemode.getNumTicks()-1;
        // No collisions on tick 0
        if (previousTick < 0){ return; }
        // No collisions in testing
        this.checkBulletCollisionsWithWorldBorder();
        // Check ally and axis bullet hits
        for (let team of this.teams){
            for (let otherTeam of this.teams){
                if (team == otherTeam){ continue; }
                this.checkBulletCollisionsFromTeamToTeam(team, otherTeam);
            }
        }

        // For each bomb check each building for collisions
        for (let [bomb, bombIndex] of this.bombs){
            if (bomb.isDead()){ continue; }
            for (let [building, buildingIndex] of this.buildings){
                if (building.isDead()){ continue; }
                if (SimpleProjectile.checkForProjectileLinearCollision(bomb, building, previousTick)){
                    building.damage(bomb.getDamage());
                    bomb.die();
                    break;
                }
            }
        }
    }

    /*
        Method Name: addBuilding
        Method Parameters: None
        Method Description: Checks each bullet to see if it collides with the world border
        Method Return: void
    */
    /*
        Method Name: checkBulletCollisionsWithWorldBorder
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    checkBulletCollisionsWithWorldBorder(){
        let planesLeftX = Number.MAX_SAFE_INTEGER;
        let planesRightX = Number.MIN_SAFE_INTEGER;
        let planesTopY = Number.MIN_SAFE_INTEGER;
        let planesBottomY = Number.MAX_SAFE_INTEGER;

        // Check all planes
        for (let team of this.teams){
            for (let [plane, pIndex] of this.planes[team]){
                if (plane.isDead()){ continue; }
                planesLeftX = Math.min(plane.getX(), planesLeftX);
                planesRightX = Math.max(plane.getX(), planesRightX);
                planesTopY = Math.max(plane.getY(), planesTopY);
                planesBottomY = Math.min(plane.getY(), planesBottomY);
            }
        }

        // Check all bullets
        for (let team of this.teams){
            for (let [bullet, bIndex] of this.bullets[team]){
                if (bullet.isDead()){ continue; }
                let bX = bullet.getX();
                let bY = bullet.getY();
                let tooFarToTheLeftOrRight = bX + PROGRAM_DATA["settings"]["expected_canvas_width"] < planesLeftX || bX - PROGRAM_DATA["settings"]["expected_canvas_width"] > planesRightX;
                let tooFarToUpOrDown = bY + PROGRAM_DATA["settings"]["expected_canvas_height"] < planesBottomY || bY - PROGRAM_DATA["settings"]["expected_canvas_height"] > planesTopY;
                if (tooFarToUpOrDown || tooFarToTheLeftOrRight){
                    bullet.die();
                }
            }
        }

    }

    /*
        Method Name: checkBulletCollisionsFromTeamToTeam
        Method Parameters:
            team:
                An alliance
            otherTeam:
                Another alliance
        Method Description: Checks for collisions between planes of 'team' and bullets of 'otherTeam' and other things to determine if bullet is worth keeping aroun
        Method Return: void
    */
    /*
        Method Name: checkBulletCollisionsFromTeamToTeam
        Method Parameters: 
            team:
                TODO
             otherTeam:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    checkBulletCollisionsFromTeamToTeam(team, otherTeam){
        // Check for bullet too far from planes
        let planesLeftX = Number.MAX_SAFE_INTEGER;
        let planesRightX = Number.MIN_SAFE_INTEGER;
        let planesTopY = Number.MIN_SAFE_INTEGER;
        let planesBottomY = Number.MAX_SAFE_INTEGER;

        // Determine border of all planes of team A
        for (let [plane, pIndex] of this.planes[otherTeam]){
            if (plane.isDead()){ continue; }
            planesLeftX = Math.min(plane.getX(), planesLeftX);
            planesRightX = Math.max(plane.getX(), planesRightX);
            planesTopY = Math.max(plane.getY(), planesTopY);
            planesBottomY = Math.min(plane.getY(), planesBottomY);
        }

        // For each team B bullet if far from the border of team A plane then ignore
        let ignoreBulletsCheck1 = [];
        for (let [bullet, bIndex] of this.bullets[team]){
            ignoreBulletsCheck1.push(false);
            let bX = bullet.getX();
            let bY = bullet.getY();
            // If too far left
            if (bX < planesLeftX - PROGRAM_DATA["settings"]["expected_canvas_width"]){
                ignoreBulletsCheck1[bIndex] = true;
                continue;
            }
            // If too far right
            if (bX > planesRightX + PROGRAM_DATA["settings"]["expected_canvas_width"]){
                ignoreBulletsCheck1[bIndex] = true;
                continue;
            }
            // If too low
            if (bY < planesBottomY - PROGRAM_DATA["settings"]["expected_canvas_height"]){
                ignoreBulletsCheck1[bIndex] = true;
                continue;
            }
            // If too high
            if (bY > planesTopY + PROGRAM_DATA["settings"]["expected_canvas_height"]){
                ignoreBulletsCheck1[bIndex] = true;
                continue;
            }
        }

        let currentTick = this.gamemode.getNumTicks();
        let previousTick = currentTick - 1;

        // Make simple bullet data
        let simpleBulletData = [];
        for (let [bullet, bIndex] of this.bullets[team]){
            if (bullet.isDead() || ignoreBulletsCheck1[bIndex]){ simpleBulletData.push({}); continue; }
            let x1 = bullet.getXAtTick(previousTick);
            let x2 = bullet.getXAtTick(currentTick);
            let y1 = bullet.getYAtTick(previousTick);
            let y2 = bullet.getYAtTick(currentTick);
            let leftX = Math.min(x1, x2);
            let rightX = Math.max(x1, x2);
            let topY = Math.max(y1, y2);
            let bottomY = Math.min(y1, y2);
            simpleBulletData.push({"lX": leftX, "rX": rightX, "bY": bottomY, "tY": topY});
        }

        // Loop through planes to look for collision
        for (let [plane, pIndex] of this.planes[otherTeam]){
            if (plane.isDead()){ continue; }
            let x1 = plane.getXAtStartOfTick();
            let x2 = plane.getX();
            let y1 = plane.getYAtStartOfTick();
            let y2 = plane.getY();
            let leftX = Math.min(x1, x2);
            let rightX = Math.max(x1, x2);
            let topY = Math.max(y1, y2);
            let bottomY = Math.min(y1, y2);
            let simplePlaneData = {"lX": leftX, "rX": rightX, "bY": bottomY, "tY": topY};
            for (let [bullet, bIndex] of this.bullets[team]){
                if (bullet.isDead() || ignoreBulletsCheck1[bIndex]){ continue; }
                if (bullet.collidesWithPlane(plane, simpleBulletData[bIndex], simplePlaneData)){
                    plane.damage(bullet.getDamage());
                    bullet.die();
                    if (plane.isDead()){
                        this.handleKill(bullet, plane);
                        break;
                    }
                }
            }
        }
    }

    /*
        Method Name: getNumberOfEntities
        Method Parameters: None
        Method Description: Determines the number of entities that exist
        Method Return: int
    */
    /*
        Method Name: getNumberOfEntities
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    getNumberOfEntities(){
        let count = 0;
        for (let team of this.teams){
            count += this.planes[team].countCondition((plane) => {return plane.isAlive();});
            count += this.bullets[team].countCondition((bullet) => {return bullet.isAlive();});
        }
        count += this.bombs.countCondition((bomb) => {return bomb.isAlive();});
        count += this.buildings.countCondition((building) => {return building.isAlive();});
        return count;
    }

    /*
        Method Name: displayAll
        Method Parameters:
            lX:
                Lower x bound of the displayed area
            bY:
                Lower y bound of the displayed area
            excludeID:
                Entity to exclude from display
            displayTime:
                The time used to interpolate the positions of the planes
        Method Description: Displays all entities that aren't excluded
        Method Return: void
    */
    /*
        Method Name: displayAll
        Method Parameters: 
            lX:
                TODO
             bY:
                TODO
             excludeID:
                TODO
             displayTime:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    displayAll(lX, bY, excludeID, displayTime){
        for (let team of this.teams){
            for (let [plane, pIndex] of this.planes[team]){
                if (plane.getID() != excludeID){
                    plane.display(lX, bY, displayTime);
                }
            }
        }

        for (let team of this.teams){
            for (let [bullet, bIndex] of this.bullets[team]){
                if (!bullet.isDead() && bullet.getID() != excludeID){
                    bullet.display(lX, bY, displayTime);
                }
            }
        }

        for (let [building, buildingIndex] of this.buildings){
            building.display(lX, bY, displayTime);
        }

        for (let [bomb, bombIndex] of this.bombs){
            bomb.display(lX, bY, displayTime);
        }
    }

    /*
        Method Name: getLivingPlanes
        Method Parameters: None
        Method Description: Gathers a list of all living planes
        Method Return: List of Plane
    */
    /*
        Method Name: getLivingPlanes
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    getLivingPlanes(){
        let planes = [];
        for (let team of this.teams){
            for (let [plane, pIndex] of this.planes[team]){
                if (!plane.isDead()){
                    planes.push(plane);
                }
            }
        }
        return planes;
    }

    /*
        Method Name: getAllPlanes
        Method Parameters: None
        Method Description: Gathers a list of all planes
        Method Return: List of Plane
    */
    /*
        Method Name: getAllPlanes
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    getAllPlanes(){
        let planes = [];
        for (let team of this.teams){
            for (let [plane, pIndex] of this.planes[team]){
                planes.push(plane);
            }
        }
        return planes;
    }

    /*
        Method Name: getDeadPlanes
        Method Parameters: None
        Method Description: Find all the dead planes
        Method Return: List of Plane
    */
    /*
        Method Name: getDeadPlanes
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    getDeadPlanes(){
        let planes = [];
        for (let team of this.teams){
            for (let [plane, pIndex] of this.planes[team]){
                if (plane.isDead()){
                    planes.push(plane);
                }
            }
        }
        return planes;
    }

    /*
        Method Name: getAllBullets
        Method Parameters: None
        Method Description: Gathers a list of all living bullets
        Method Return: List of Bullets
    */
    /*
        Method Name: getAllBullets
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    getAllBullets(){
        let bullets = [];
        for (let team of this.teams){
            for (let [bullet, bIndex] of this.bullets[team]){
                if (!bullet.isDead()){
                    bullets.push(bullet);
                }
            }
        }
        return bullets;
    }

    /*
        Method Name: getBombs
        Method Parameters: None
        Method Description: Getter
        Method Return: LinkedList of Bombs
    */
    /*
        Method Name: getBombs
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    getBombs(){
        return this.bombs;
    }

    /*
        Method Name: countAlliance
        Method Parameters:
            allianceName:
                Team of an alliance
        Method Description: Counts living entities of an alliance
        Method Return: int
    */
    /*
        Method Name: countAlliance
        Method Parameters: 
            allianceName:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    countAlliance(allianceName){
        let aliveCount = 0;
        for (let [plane, pIndex] of this.planes[allianceName]){
            if (!plane.isDead()){
                aliveCount++;
            }
        }
        return aliveCount;
    }

    /*
        Method Name: handleKill
        Method Parameters:
            bullet:
                A bullet that kills a plane
            deadPlane:
                A plane that is dying
        Method Description: Records a kill that takes place
        Method Return: void
    */
    /*
        Method Name: handleKill
        Method Parameters: 
            bullet:
                TODO
             deadPlane:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    handleKill(bullet, deadPlane){
        let shooter = this.getEntity(bullet.getShooterID());
        // If human 
        if (shooter.isHuman()){
            this.gamemode.getStatsManager().addPlayerKill(shooter.getID(), planeModelToAlliance(shooter.getPlaneClass()));
        }else{
            this.gamemode.getStatsManager().addBotKill(shooter.getPlaneClass());
        }
    }

    /*
        Method Name: getPlane
        Method Parameters:
            id:
                Id of the plane being looked for
        Method Description: Finds a plane with a given ID
        Method Return: Plane Object
    */
    /*
        Method Name: getPlane
        Method Parameters: 
            id:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    getPlane(id){
        for (let plane of this.getAllPlanes()){
            if (plane.getID() == id){
                return plane;
            }
        }
        return null;
    }

    /*
        Method Name: getPlaneJSON
        Method Parameters: None
        Method Description: Creates a JSON representation of every plane
        Method Return: List of JSON Objects
    */
    /*
        Method Name: getPlaneJSON
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    getPlaneJSON(){
        let planeJSON = [];
        for (let team of this.teams){
            for (let [plane, pIndex] of this.planes[team]){
                planeJSON.push(plane.toJSON());
            }
        }
        return planeJSON;
    }

    /*
        Method Name: getBulletJSON
        Method Parameters: None
        Method Description: Creates a JSON representation of every bullet
        Method Return: List of JSON Objects
    */
    /*
        Method Name: getBulletJSON
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    getBulletJSON(){
        let bulletJSON = [];
        for (let bullet of this.getAllBullets()){
            bulletJSON.push(bullet.toJSON());
        }
        return bulletJSON;
    }

    /*
        Method Name: getBombJSON
        Method Parameters: None
        Method Description: Creates a JSON representation of every bomb
        Method Return: List of JSON Objects
    */
    /*
        Method Name: getBombJSON
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    getBombJSON(){
        let bombJSON = [];
        for (let [bomb, bombIndex] of this.bombs){
            bombJSON.push(bomb.toJSON());
        }
        return bombJSON;
    }

    /*
        Method Name: getBuildingJSON
        Method Parameters: None
        Method Description: Creates a JSON representation of every building
        Method Return: List of JSON Objects
    */
    /*
        Method Name: getBuildingJSON
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    getBuildingJSON(){
        let buildingJSON = [];
        for (let [building, buildingIndex] of this.buildings){
            buildingJSON.push(building.toJSON());
        }
        return buildingJSON;
    }
    
    /*
        Method Name: fromBuildingJSON
        Method Parameters:
            buildingsJSON:
                A list of json representations of buildings
        Method Description: Loads new buildings into the game
        Method Return: void
    */
    /*
        Method Name: fromBuildingJSON
        Method Parameters: 
            buildingsJSON:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    fromBuildingJSON(buildingsJSON){
        let index = 0;
        for (let buildingJSON of buildingsJSON){
            // Add building or set stats from JSON 
            if (index >= this.buildings.getLength()){
                this.buildings.push(Building.fromJSON(buildingJSON, this.gamemode));
            }else{
                this.buildings.get(index).fromJSON(buildingJSON);
            }
            index++;
        }
    }

    /*
        Method Name: fromBombJSON
        Method Parameters:
            bombsJSON:
                A list of json representations of bombs
        Method Description: Loads new bombs into the game
        Method Return: void
    */
    /*
        Method Name: fromBombJSON
        Method Parameters: 
            bombsJSON:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    fromBombJSON(bombsJSON){
        for (let bombJSON of bombsJSON){
            let index = bombJSON["index"];
            // Add bomb 
            if (index >= this.bombs.getLength()){
                this.bombs.push(Bomb.fromJSON(bombJSON, this.gamemode));
            }else{
                this.bombs.get(index).fromJSON(bombJSON, false);
            }
        }
    }
    /*
        Method Name: fromBulletJSON
        Method Parameters:
            bulletsJSON:
                A list of json representations of bullets
        Method Description: Loads new bullets into the game
        Method Return: void
    */
    /*
        Method Name: fromBulletJSON
        Method Parameters: 
            bulletsJSON:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    fromBulletJSON(bulletsJSON){
        for (let bulletJSON of bulletsJSON){
            let allianceName = planeModelToAlliance(bulletJSON["shooter_class"]);
            let index = bulletJSON["index"];
            // Add bullet 
            if (index >= this.bullets[allianceName].getLength()){
                this.bullets[allianceName].push(Bullet.fromJSON(bulletJSON, this.gamemode));
            }else{
                this.bullets[allianceName].get(index).fromJSON(bulletJSON, false);
            }
        }
    }
}
// If using NodeJS -> export the class
if (typeof window === "undefined"){
    module.exports = TeamCombatManager;
}