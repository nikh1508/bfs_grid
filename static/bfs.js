class Point {
  constructor(coord = null, coord_prev = null, dist = 0) {
    this.i = coord[0];
    this.j = coord[1];
    this.dist = dist;
    if (coord_prev != null) this.prev_node = coord_prev;
    else this.prev_node = null;
  }
}
class BFS {
  constructor(matrix, source, x, y) {
    this.matrix = matrix;
    this.x = x;
    this.y = y;
    this.visited = new Array(y);
    for (var i = 0; i < y; i++) {
      this.visited[i] = new Array(x);
      for (var j = 0; j < x; j++) this.visited[i][j] = 0;
    }
    this.source = new Point(source);
    this.path = null;
    this.path_dist = null;
    this.queue = new Queue();
    this.queue.enqueue(this.source);
    this.visited[source[0]][source[1]] = 1;
  }

  getPath() {
    return [this.path, this.path_dist];
  }

  calcPath() {
    var dr = [-1, 1, 0, 0];
    var dc = [0, 0, 1, -1];
    var rr, cc;
    while (this.queue.length()) {
      var node_now = this.queue.dequeue();
      //   console.log(node_now);
      //check if reached destination
      if (this.matrix[node_now.i][node_now.j] == "d") {
        this.path = [];
        this.path_dist = node_now.dist;
        while (node_now != null) {
          this.path.unshift([node_now.i, node_now.j]);
          node_now = node_now.prev_node;
          //   console.log(this.path[0]);
        }
        break;
      }

      //explore neighbours
      for (var i = 0; i < 4; i++) {
        rr = node_now.i + dr[i];
        cc = node_now.j + dc[i];

        if (rr < 0 || rr >= this.x || cc < 0 || cc >= this.y) continue; // out of bounds
        if (this.visited[rr][cc] == 1 || this.matrix[rr][cc] == "1") continue; // Either visited or obstacle
        this.visited[rr][cc] = 1;
        var next_node = new Point([rr, cc], node_now, node_now.dist + 1);
        this.queue.enqueue(next_node);
      }
    }
  }
}

// var matrix = new Array(5);
// for (var i = 0; i < 5; i++) {
//   matrix[i] = new Array(5);
//   for (var j = 0; j < 5; j++) matrix[i][j] = 0;
// }

// matrix[0][0] = "1";
// matrix[0][2] = "1";
// matrix[1][2] = "1";
// matrix[2][2] = "1";
// matrix[3][1] = "1";

// source = [2, 1];
// matrix[2][1] = "s";

// matrix[1][3] = "d";
