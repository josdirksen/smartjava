// This class represents the map on the screen. It renders the map using three.js
// and adds the geometries based on an external SVG file.
function DebtMap() {

    this.self = this;
    this.scene = {};
    this.renderer = {};
    this.camera = {};
    this.pointLight = {};
    this.referenceMap = [];

    // call this first to create the Three.js scene used to render everything in.
    DebtMap.prototype.initScene = function () {

        // create a WebGL renderer, camera, and a scene
        this.renderer = new THREE.WebGLRenderer({antialias:false});


        this.camera = new THREE.PerspectiveCamera(CONS.VIEW_ANGLE, CONS.WIDTH / CONS.HEIGHT, CONS.NEAR, CONS.FAR);
        this.scene = new THREE.Scene();

        // add and position the camera at a fixed position
        this.scene.add(this.camera);
        this.camera.position.z = CONS.CAMERA_Z;
        this.camera.position.x = CONS.CAMERA_X;
        this.camera.position.y = CONS.CAMERA_Y;

        this.camera.lookAt(this.scene.position);

        // start the renderer, and black background
        this.renderer.setSize(CONS.WIDTH, CONS.HEIGHT);
        this.renderer.setClearColor(0x000);
        this.renderer.shadowMapEnabled = true;
        this.renderer.shadowMapSoft = true;


        // add the render target to the page
        $("#main_map").append(this.renderer.domElement);

        // add a light at a specific position
        this.pointLight = new THREE.SpotLight(0xFFFFFF);
        this.scene.add(this.pointLight);
        this.pointLight.position.x = 200;
        this.pointLight.position.y = 100;
        this.pointLight.position.z = 60;
        this.pointLight.intensity = 1.3;
        this.pointLight.castShadow = true;

        // add a base plane on which we'll render our map
        var planeGeo = new THREE.PlaneGeometry(10000, 10000, 10, 10);
        var planeMat = new THREE.MeshLambertMaterial({color:0x666699});
        var plane = new THREE.Mesh(planeGeo, planeMat);

        // rotate it to correct position
        plane.rotation.x = -Math.PI / 2;

        plane.translateY(-1);
        plane.receiveShadow = true;
        this.scene.add(plane);
    }

    // Used to convert a 2d plane to a 3d object by extruding it a base amount
    // this also applies any svg transforms that are left to make sure
    // everything is positioned correctly.
    DebtMap.prototype.addMesh = function (mesh, value, transform, id, group) {

        var shape3d = mesh.extrude({amount:75, bevelEnabled:false});
        var material = new THREE.MeshLambertMaterial({
            color:0xcccccc
        });

        var toAdd = new THREE.Mesh(shape3d, material);

        if (transform != null) {
            applySVGTransformExposed(toAdd, transform);
        }

        toAdd.translateX(-1300);
        toAdd.translateY(-320);

        if (this.referenceMap[id] == null) {
            this.referenceMap[id] = [];
        }

        this.referenceMap[id].push(toAdd);

        toAdd.receiveShadow = true;
        toAdd.castShadow = true;
        group.add(toAdd);
    }

    // Add all the geo objects from the XML file to the scene. When this
    // is done, the scene is rendered.
    DebtMap.prototype.addGeoObject = function () {
        // assign this to self, to avoid inner function issues
        var self = this;


        d3.xml("data/maps/eurozone.svg", "application/xml", function (xml) {
            var threeGroup = new THREE.Object3D();

            var groups = xml.documentElement.getElementsByTagName("g");
            for (var g = 0; g < groups.length; g++) {
                var group = groups[g];
                var transform = group.getAttribute("transform");
                var id = group.getAttribute("id");
                var paths = group.getElementsByTagName("path");
                for (var i = 0; i < paths.length; i++) {
                    // meshes is the set of meshes for a specific country
                    var meshes = transformSVGPathExposed(paths[i].getAttribute("d"));
                    for (var j = 0; j < meshes.length; j++) {
                        // each mesh is added to the group with a specific color
                        self.addMesh(meshes[j], g, transform, id, threeGroup);
                    }
                }
            }

            // these are all the elements combined
            threeGroup.rotation.x = Math.PI / 2;
            threeGroup.rotation.z = -0.5;
            threeGroup.translateX(-45);
            threeGroup.translateZ(-30);
            threeGroup.castShadow = true;
            threeGroup.receiveShadow = true;

            self.scene.add(threeGroup);
            self.render();
        });
    }

    // Render the map. Call this when an update to the scene
    // needs to be rendered.
    DebtMap.prototype.render = function () {
        this.renderer.render(this.scene, this.camera);
    }

    // Call this to update the map based on a new color and rate. This
    // changes the height and the color of all elements in a group
    DebtMap.prototype.updateColors = function (posInMap, colorArray, rate) {
        var toUpdate = this.referenceMap[posInMap];

        if (toUpdate != null) {
            for (var j = 0; j < toUpdate.length; j++) {
                var newColor = new THREE.Color();
                newColor.setRGB(colorArray.rgb[0] / 255, colorArray.rgb[1] / 255, colorArray.rgb[2] / 255)
                toUpdate[j].position.z = -2 * (rate);
                toUpdate[j].material.color = newColor;
            }
        }
    }
}
