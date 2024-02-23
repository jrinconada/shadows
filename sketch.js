let size = 500;
let margin = 30;

let day_of_year;
let latitude;
let hour_of_day = 12;

let angle = 0;
let elevation = 0;
let dragging = false;

let sunX;
let sunY;
let sunSize = size / 15;
let pathSize = size / 1.5;

let buildingSize = size / 10;
let buildingX = size / 2 - buildingSize / 2;
let buildingY = size / 2 - buildingSize;

let shadowLength;
let shadowAngle;

function setup() {
  angleMode(DEGREES);
  createCanvas(size, size);
  // Latitude
  latitude = createSlider(0, 180, 50);
  latitude.position(margin, size - 2 * margin);
  latitude.size(size - 2 * margin);
  // Día del año
  day_of_year = createSlider(1, 365, 90);
  day_of_year.position(margin, size - margin);
  day_of_year.size(size - 2 * margin);
}

function draw() {
  background(150);  
  // Cálculos de valores
  angle = getDeclination();  
  elevation = getElevation();
  pathSize = getPathSize();
  sunX = size / 2 + pathSize / 2 * cos(angle);
  sunY = size / 2 + pathSize / 2 * sin(angle) + elevation;  
  shadowLength = getShadowLength();
  shadowAngle = getShadowAngle();
  // Arco
  noFill();
  stroke(100);
  circle(size / 2, size / 2 + elevation, pathSize);
  // Día
  noStroke();
  fill(50);
  text('Día ' + day_of_year.value() + ' del año. Mes ' + ceil(day_of_year.value() / 30.42), size / 3, size - margin);
  // Latitud
  text('Latitud ' + getLatitude() + 'º', size / 3, size - 2 * margin);
  // Hora
  text(getTime(hour_of_day), size / 2 - 15, margin);
  // Sol  
  fill(255, 204, 0);
  circle(sunX, sunY, sunSize);
  // Suelo
  fill(200);
  rect(margin, size / 2, size - 2 * margin, size / 250);
  // Edificio
  fill(120);
  rect(buildingX, buildingY, buildingSize, buildingSize);
  // Sombra
  fill(100);
  quad(buildingX, size / 2,
       buildingX + buildingSize, size / 2,
       shadowAngle * buildingX + buildingSize, size / 2 + buildingSize * shadowLength,
       shadowAngle * buildingX, size / 2 + buildingSize * shadowLength);
}

// Hora
function getTime(hour_of_day) {
  let hours = str(getHours(hour_of_day));
  if (hours.length == 1) {
    hours = '0' + hours;
  }
  let minutes = str(getMinutes(hour_of_day));
  if (minutes.length == 1) {
    minutes = '0' + minutes;
  }
  return hours + ':' + minutes;
}
function getHours(hour_of_day) {
  return floor(hour_of_day);
}
function getMinutes(hour_of_day) {
  let decimal = hour_of_day % 1;  
  return round(decimal * 60);
}

// Posición del Sol
function getDeclination() {
  let rotated = hour_of_day + 6; // Para que 0º sean las 12:00
  let normalized = rotated / 24;   
  return normalized * 360; // Convertir en grados
}
function getElevation() {
  let normalized = day_of_year.value() / 365;
  let degress = normalized * 360; // Convertir en grados
  let cicle = cos(degress); // Usando coseno se hace el movimento cíclico
  return cicle * size / 10; // Escalar la elevación a un décimo de la pantalla
}
function getLatitude() {
  return 90 - latitude.value();
}
function getPathSize() {
  let normalized = abs(getLatitude()) / 90;
  let minSize = 2; // Número de veces más pequeño en el polo
  let maxSize = size / 1.3; // Tamaño en el ecuador
  let scalingFactor = (1 / sq(normalized * (minSize - 1) + 1)); // Se usar el cuadrado del resultado para suavizar el escalado
  return maxSize * scalingFactor;
}

// Movimiento del Sol
function mousePressed() {  
  if (mouseX > (sunX - sunSize / 2) && mouseX < (sunX + sunSize / 2) &&
     mouseY > (sunY - sunSize / 2) && mouseY < (sunY + sunSize / 2)) {
    dragging = true;    
  }
}
function mouseReleased() {
  dragging = false;
}
function mouseDragged() {
  if (dragging) {
    let normalized = mouseX / size;
    hour_of_day = normalized * 24;
  }  
}

// Sombra
function getShadowAngle() {  
  let rotated = angle - 270; // Para que mediodía sea 0º
  return cos(rotated + 90) + 1; // Sumamos 90 y 1 para crear una curva S invertida
}
function getShadowLength() {
  let normalized = sunY / (size / 2);
  return 2 * normalized;
}