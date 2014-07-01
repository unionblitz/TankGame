# Tank Game

The Tank Game is a very basic 2D shooter game, using NodeJS, JavaScript and Canvas.  The purpose is to destroy opponent tanks by shooting missiles at them. 

This game is driven by NodeJS via the server code (app.js).  The client side of this application receives broadcasts from the server and draws to the canvas via (clientengine.js).

When users enter the game, they are asked to supply a name and to choose a tank.  Then, they enter the match with their username right above their tank, and a health bar (the green bar).

When a tank takes damage, the portion of that tank will become visibly damaged.  An explosion will also appear after a missile impact on a tank or edge of the canvas.  Lastly, when a tank
gets hit, the health bar will fill with red.  When the bar is entirely red, the tank is considered "exploded" and the user's controls should stop.

### Game Controls
Key              | Action
---------------- | ----------------
[A], [LEFT KEY]  | Left
[D], [RIGHT KEY] | RIGHT
[W], [UP KEY]    | UP
[S], [DOWN KEY]  | DOWN
[SHIFT]          | SPEED BURST
[SPACE]          | MISSILE


-----------------------------

### Important Files

[App.js](app.js) - The server side engine.

[ClientEngine.js](/public/js/clientengine.js) - The client side engine.  This controls drawing to the canvas, and it handles keyboard events.

[Globals.js](/public/js/globals.js) - global variables on the client side.  Specifically, the canvas object, the 2D context.
   
### Notes

You will want to change the "socketUrl" in the [Globals.js](/public/js/globals.js) file to point to your IP address.

You will also want to ensure that you have opened up the port (in this case, port 1337) for nodeJS.

