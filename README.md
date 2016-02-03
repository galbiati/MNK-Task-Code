# MNK-Task-Code
This is a behavioral experiment that runs in a web browser (currently only compatible with Chrome). The experiment involves an "M,N,K" game, with a MxN board on which players compete to get K in a row. Tic-tac-toe and Gomoku are quintessential M,N,K games.

## How to Use
Currently, the only way to run this experiment is to download the directory and host with a Apache-MySQL-PHP server.

The server must have a data base configured appropriately; instructions on this will be added at some point, but currently you should be able to figure this out by looking at the PHP scripts.

## Future Plans
In the next several months, this will be changed to a tornado-based server. This will have several advantages: easier templating, more flexible choice in database, greater portability between systems, and (hopefully) the ability to handle multiple connections and persistent users. The python backend should also make it easier to create a live dash for experimenters to monitor individual subjects as they play.

While the organization of the client side scripts has been improved, there is still a lot more that can be done. Once there is a python backend, a lot of the client side code can be moved to the server (this will be more secure against users that might know to use the console).
