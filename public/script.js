let scene, camera, renderer, model;
const canvas = document.getElementById('canvas');

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas });

    camera.position.z = 5;
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function generateModel() {
    const prompt = document.getElementById('prompt').value;
    fetch('/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
    }).then(response => response.json()).then(data => {
        if (model) scene.remove(model);
        model = createModel(data);
        scene.add(model);
    });
}

function rotateModel() {
    if (model) {
        let rotation = 0;
        const interval = setInterval(() => {
            rotation += 0.01;
            model.rotation.y = rotation;
            if (rotation >= Math.PI * 2) clearInterval(interval);
        }, 16);
    }
}

function applyAnimation() {
    const animationType = document.getElementById('animation').value;
    if (model) {
        switch (animationType) {
            case 'move':
                model.position.x += 0.1;
                break;
            case 'fall':
                model.position.y -= 0.1;
                break;
            case 'float':
                model.position.y += Math.sin(Date.now() * 0.001) * 0.01;
                break;
            case 'fly':
                model.position.z -= 0.1;
                break;
        }
    }
}

function createModel(data) {
    switch (data.type) {
        case 'cube':
            return createCube(data.color);
        case 'human':
            return createHuman(data.color);
        default:
            return createCube(data.color);
    }
}

function createCube(color) {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: parseInt(color) });
    return new THREE.Mesh(geometry, material);
}

function createHuman(color) {
    const material = new THREE.MeshBasicMaterial({ color: parseInt(color) });

    const headGeometry = new THREE.SphereGeometry(0.5);
    const head = new THREE.Mesh(headGeometry, material);
    head.position.y = 1.5;

    const bodyGeometry = new THREE.BoxGeometry(1, 2, 0.5);
    const body = new THREE.Mesh(bodyGeometry, material);
    body.position.y = 0;

    const leftArmGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1.5);
    const leftArm = new THREE.Mesh(leftArmGeometry, material);
    leftArm.position.set(-0.8, 0.5, 0);

    const rightArmGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1.5);
    const rightArm = new THREE.Mesh(rightArmGeometry, material);
    rightArm.position.set(0.8, 0.5, 0);

    const leftLegGeometry = new THREE.CylinderGeometry(0.3, 0.3, 2);
    const leftLeg = new THREE.Mesh(leftLegGeometry, material);
    leftLeg.position.set(-0.3, -2, 0);

    const rightLegGeometry = new THREE.CylinderGeometry(0.3, 0.3, 2);
    const rightLeg = new THREE.Mesh(rightLegGeometry, material);
    rightLeg.position.set(0.3, -2, 0);

    const human = new THREE.Group();
    human.add(head);
    human.add(body);
    human.add(leftArm);
    human.add(rightArm);
    human.add(leftLeg);
    human.add(rightLeg);

    return human;
}

init();
