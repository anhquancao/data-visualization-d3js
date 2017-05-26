val x = read.csv("/Users/caoquan/MEGA/M1/UP13/Project/work/data/iris.proto.csv").unzip

val map = som(x, 10, 10)
hexmap(map.umatrix, Palette.jet(256))

val nodes=10
val codebook = map.map.flatten
val neurons = (0 until nodes).map { i => codebook.slice(nodes*i, nodes*(i+1)) }.toArray
val w= grid(neurons)
w.canvas.points("data", x, '#', Color.GREEN);