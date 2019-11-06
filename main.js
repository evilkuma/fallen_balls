
/** 
 * created by example http://jsfiddle.net/sad5ztmw/2/
 * 
 * 
 * adaptive from three.js by @evilkuma
 * 
 */

function randomInt(min, max) {

    return Math.floor(min + Math.random() * (max + 1 - min))

}

/**
 * init scene
 */

var scene = new THREE.Scene()

var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 )
camera.position.z = 15

var lights = []
lights[ 0 ] = new THREE.PointLight( 0xffe7cc, 1, 50 )
lights[ 1 ] = new THREE.PointLight( 0xffe7cc, 1, 50 )
lights[ 2 ] = new THREE.PointLight( 0xffe7cc, 1, 50 )

lights[ 0 ].position.set( 10, 20, 10 )
lights[ 1 ].position.set( -10, 20, 10 )
lights[ 2 ].position.set( -10, -20, 10 )

scene.add( ...lights )

var renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize( window.innerWidth, window.innerHeight )

document.body.appendChild( renderer.domElement )

var animate = function () {
    requestAnimationFrame( animate )

    world.step(fixedTimeStep)
    render()

};

/**
 * init b2 and create objects
 */

var fixedTimeStep = 1 / 60
var colorList = [
    0xf64c4c,
    0xf6844c,
    0xd0f64c,
    0x4cc8f6
]
var itemList = [];

var world = new p2.World({
    gravity: [0, -9.82]
})

createWall(-6, 0, 8, 1, -Math.PI / 4)
createWall(6, 0, 8, 1, Math.PI / 4)


/**
 * run loop
 */

animate()

/**
 * functions
 */

function render() {

    createBall();

    for(var i = itemList.length - 1; i >= 0; i--) {

        var mesh = itemList[i]

        if(mesh.body.world && mesh.shape.type == p2.Shape.CIRCLE) {

            var x = mesh.body.position[0]
            var y = mesh.body.position[1]

            if(y < -10) {

                world.removeBody(mesh.body)
                scene.remove(mesh)
                itemList.splice(i, 1)

            } else {

                mesh.position.x = x
                mesh.position.y = y

            }

        }

    }

    renderer.render( scene, camera );

}

function createWall(x, y, w, h, rotation) {

    var shape = new p2.Box({
        width: w, 
        height: h,
    });

    var body = new p2.Body({
        mass: 0,
        position: [x, y],
        angle: rotation
    });

    body.addShape(shape);
    world.addBody(body);
    
    var mesh = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, 1),
        new THREE.MeshPhongMaterial({color: 0x666666})
    )

    mesh.position.x = x
    mesh.position.y = y
    mesh.rotation.z = rotation

    scene.add(mesh)

    mesh.body = body;
    mesh.shape = shape;

}

function createBall() {

    var x = randomInt(-10, 10)
    var y = randomInt(5, 10)

    var radius = .4

    var ballShape = new p2.Circle({ radius })
    var ballBody = new p2.Body({
        mass:.5, 
        position: [x, y]
    });
    var colorID = Math.floor(Math.random() * colorList.length);
    var color = colorList[colorID];
    ballBody.color = color;
    ballBody.addShape(ballShape);
    world.addBody(ballBody);

    var mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 20), new THREE.MeshPhongMaterial({color}))
    mesh.position.x = x
    mesh.position.y = y
    scene.add(mesh)

    mesh.body = ballBody
    mesh.shape = ballShape
    itemList.push(mesh)

}
