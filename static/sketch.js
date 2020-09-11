var mazeGenerated, sourceSelected, destSelected;
mazeGenerated = sourceSelected = destSelected = false;
var matrix = null,
  matrix_orig = null,
  cnv,
  path = null;
var screen_width = 360;
if (window.screen.width >= 600) screen_width = 600;
const CANVAS_X = screen_width;
const CANVAS_Y = screen_width;

var Y = 10; // ROWS
var X = 10; // COLS
var bias;
var source = [0, 0]; // x, y | col, row | From TOP-RIGHT
var destination = [0, 0];
var i, j;

/////////////////////////////////////////////////////////////
function generateMaze() {
  sourceSelected = destSelected = false;
  path = null;
  document.getElementById("sel_source").style.backgroundColor = "";
  document.getElementById("sel_destination").style.backgroundColor = "";
  X = document.getElementById("x").value;
  Y = document.getElementById("y").value;

  matrix = new Array(Y);
  for (i = 0; i < Y; i++) matrix[i] = new Array(X);

  bias = document.getElementById("bias").value / 100;
  const url_path =
    window.location.pathname === "/" ? "/" : window.location.pathname + "/";
  httpGet(`${url_path}get_random_matrix?x=${X}&y=${Y}&bias=${bias}`).then(
    (response) => {
      response = JSON.parse(response);
      for (i = 0; i < Y; i++)
        for (j = 0; j < X; j++) {
          matrix[i][j] = str(response[i * X + j]);
        }
      matrix_orig = matrix.map(function (arr) {
        return arr.slice();
      });
      mazeGenerated = true;
    }
  );
}

function selectSource() {
  if (!mazeGenerated) {
    alert("Maze not generated");
    return;
  }
  path = null;
  if (sourceSelected) {
    matrix[source[0]][source[1]] = matrix_orig[source[0]][source[1]];
    sourceSelected = false;
  }
  document.getElementById("sel_destination").style.backgroundColor = "";
  document.getElementById("sel_source").style.backgroundColor = "grey";
  cnv.mousePressed(() => changeColor("source"));
}
function selectDestination() {
  if (!mazeGenerated) {
    alert("Maze not generated");
    return;
  }
  path = null;
  if (destSelected) {
    matrix[destination[0]][destination[1]] =
      matrix_orig[destination[0]][destination[1]];
    destSelected = false;
  }
  document.getElementById("sel_source").style.backgroundColor = "";
  document.getElementById("sel_destination").style.backgroundColor = "grey";
  cnv.mousePressed(() => changeColor("destination"));
}

function changeColor(point) {
  x = parseInt(mouseX / (CANVAS_X / X));
  y = parseInt(mouseY / (CANVAS_Y / Y));
  if (point == "source") {
    matrix[y][x] = "s";
    document.getElementById("sel_source").style.backgroundColor = "";
    source = [y, x];
    sourceSelected = true;
  } else {
    matrix[y][x] = "d";
    document.getElementById("sel_destination").style.backgroundColor = "";
    destination = [y, x];
    destSelected = true;
  }
  //   console.log(x, y);
  cnv.mousePressed(() => {});
}

//p5 sketch///////////////////////////////////////////////////
function setup() {
  cnv = createCanvas(CANVAS_X, CANVAS_Y);
  cnv.parent("p5_canvas");
  //   center("horizontal");
}

function draw() {
  background(220);
  if (mazeGenerated) {
    var x_init = 0;
    var y_init = 0;
    stroke(0);
    strokeWeight(1);
    for (i = 0; i < Y; i++) {
      x_init = 0;
      for (j = 0; j < X; j++) {
        if (matrix[i][j] == "0") fill(color("white"));
        else if (matrix[i][j] == "1") fill(color("black"));
        else if (matrix[i][j] == "s") fill(color("green"));
        else if (matrix[i][j] == "d") fill(color("red"));
        square(x_init, y_init, CANVAS_X / X);
        x_init += CANVAS_X / X;
      }
      y_init += CANVAS_Y / Y;
    }
    if (path != null) {
      var len = path.length;
      stroke(200, 0, 0);
      strokeWeight(3);
      for (var i = 0; i < len - 1; i++) {
        var p1 = getCenter(path[i]);
        var p2 = getCenter(path[i + 1]);
        line(p1[0], p1[1], p2[0], p2[1]);
      }
    }
  }
}

function getCenter(p) {
  return [
    (CANVAS_X / X) * p[1] + CANVAS_X / X / 2,
    (CANVAS_Y / Y) * p[0] + CANVAS_Y / Y / 2,
  ];
}

//BFS /////////////////////////////////////////////////////////
function calcPath() {
  if (!mazeGenerated) {
    alert("Maze not generated");
    return;
  }
  if (!sourceSelected) {
    alert("Source not selected");
    return;
  }
  if (!destSelected) {
    alert("Destination not selected");
    return;
  }
  var bfs = new BFS(matrix, source, X, Y);
  bfs.calcPath();
  var _path = bfs.getPath();
  path = _path[0];
  if (_path[0] == null) {
    document.getElementById("path_len").style.color = "rgb(239, 74, 56)";
    document.getElementById("path_len").innerHTML = "No Possible Path";
  } else {
    document.getElementById("path_len").style.color = "#001F3F";
    document.getElementById("path_len").innerHTML =
      "Shortest Path Length : " + _path[1];
  }
}
